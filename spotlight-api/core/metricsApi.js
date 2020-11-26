// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

/**
 * Utilities for retrieving and caching metrics for the app.
 *
 * In the current implementation, metrics are stored in pre-processed json files in Google Cloud
 * Storage. Those files are pulled down and cached in memory with a TTL. That TTL is unaffected by
 * access to the cache, so files are re-fetched at a predictable cadence, allowing for updates to
 * those files to be quickly reflected in the app without frequent requests to GCS.
 */

const cacheManager = require("cache-manager");
const fs = require("fs");
const path = require("path");
const util = require("util");
const objectStorage = require("./objectStorage");

const BUCKET_NAME = process.env.METRIC_BUCKET;
const METRIC_CACHE_TTL_SECONDS = 60 * 60; // Expire items in the cache after 1 hour
const METRIC_REFRESH_SECONDS = 60 * 10;

const memoryCache = cacheManager.caching({
  store: "memory",
  ttl: METRIC_CACHE_TTL_SECONDS,
  refreshThreshold: METRIC_REFRESH_SECONDS,
});

const asyncReadFile = util.promisify(fs.readFile);

const FILES_BY_METRIC_TYPE = {
  parole: [
    "active_program_participation_by_region.json",
    "site_offices.json",
    "supervision_population_by_district_by_demographics.json",
    "supervision_revocations_by_period_by_type_by_demographics.json",
    "supervision_success_by_month.json",
    "supervision_success_by_period_by_demographics.json",
    "supervision_population_by_month_by_demographics.json",
  ],
  prison: [
    "incarceration_facilities.json",
    "incarceration_population_by_admission_reason.json",
    "incarceration_population_by_facility_by_demographics.json",
    "incarceration_releases_by_type_by_period.json",
    "incarceration_lengths_by_demographics.json",
    "incarceration_population_by_month_by_demographics.json",
    "recidivism_rates_by_cohort_by_year.json",
  ],
  probation: [
    "active_program_participation_by_region.json",
    "judicial_districts.json",
    "supervision_population_by_district_by_demographics.json",
    "supervision_revocations_by_period_by_type_by_demographics.json",
    "supervision_success_by_month.json",
    "supervision_success_by_period_by_demographics.json",
    "supervision_population_by_month_by_demographics.json",
  ],
  race: ["racial_disparities.json"],
  sentencing: [
    "judicial_districts.json",
    "sentence_type_by_district_by_demographics.json",
  ],
};

const ALL_METRIC_FILES = Array.from(
  new Set([].concat(...Object.values(FILES_BY_METRIC_TYPE))).values() // using Set to de-duplicate filenames
);

/**
 * Converts the given contents, a Buffer of bytes, into a JS object or array.
 * @return {DeserializedFile}
 */
function convertDownloadToJson(contents) {
  const stringContents = contents.toString();
  if (!stringContents || stringContents.length === 0) {
    return null;
  }

  const jsonObject = [];
  const splitStrings = stringContents.split("\n");
  splitStrings.forEach((line) => {
    if (line) {
      jsonObject.push(JSON.parse(line));
    }
  });

  return jsonObject;
}

/**
 * Verifies names against a list of registered files. If matched, returns
 * normalized versions of the names. If any do not match, throws an error.
 * @param {Object} opts - description.
 * @param {string[]} opts.names - the names to normalize
 * @param {string[]} opts.registeredFiles - normalized names to verify against
 * @return {string[]} normalized file names
 */
function normalizeMetricFilenames({ names, registeredFiles }) {
  return names.map((name) => {
    const normalizedFile = `${name}.json`;
    if (registeredFiles.indexOf(normalizedFile) > -1) {
      return normalizedFile;
    }
    throw new Error(`Metric file ${normalizedFile} not registered`);
  });
}

/**
 * Returns an array of all of the files that should be retrieved based on the
 * given metric type.

 * If a file is given, it will return an array containing only a normalized
 * version of that file name, unless that file does not match the given metric
 * type, in which case this throws an Error.
 */
function filesForMetricType(metricType, file) {
  const files = FILES_BY_METRIC_TYPE[metricType];

  if (file) {
    return normalizeMetricFilenames({ names: [file], registeredFiles: files });
  }

  return files;
}

/**
 * @typedef {Object} FetchedFile
 * @property {string} fileKey - a unique key for identifying the metric file,
 * e.g. 'revocations_by_month'
 * @property {any} contents - the contents of the file deserialized into JS objects/arrays
 */

/**
 * Retrieves the specified files from Google Cloud Storage.
 * @param {string} tenantId - tenant to fetch from
 * @param {string[]} files - list of filenames to fetch
 * @return {Promise<FetchedFile>[]} one promise per file that will resolve to its deserialized contents
 */
function fetchFilesFromGCS(tenantId, files) {
  const promises = [];

  files.forEach((filename) => {
    const fileKey = filename.replace(".json", "");
    promises.push(
      objectStorage
        .downloadFile(BUCKET_NAME, tenantId, filename)
        .then((contents) => ({ fileKey, contents }))
    );
  });

  return promises;
}

/**
 * Retrieves the specified files from the `demo_data` directory.
 * @param {string} tenantId - tenant to fetch from
 * @param {string[]} files - list of filenames to fetch
 * @return {Promise<FetchedFile>[]} one promise per file that will resolve to its deserialized contents
 */
function fetchFilesFromLocal(tenantId, files) {
  const promises = [];

  files.forEach((filename) => {
    const fileKey = filename.replace(".json", "");
    const filePath = path.resolve(__dirname, `./demo_data/${filename}`);

    promises.push(
      asyncReadFile(filePath).then((contents) => ({ fileKey, contents }))
    );
  });

  return promises;
}

/**
 * Retrieves all metric files for the given metric type from Google Cloud Storage.
 * @param {string} tenantId - tenant to fetch from
 * @param {string} metricType - metric grouping to get files for
 * @param {string} [file] - if provided, only this file will be fetched instead of the entire group.
 * Must be a member of the metricType group or an error will be thrown.
 * @return {Promise<FetchedFile>[]} a list of Promises, one per metric file for the given type
 * (or a single promise if `file` was provided)
 */
function fetchMetricsFromGCS(tenantId, metricType, file) {
  return fetchFilesFromGCS(tenantId, filesForMetricType(metricType, file));
}

/**
 * This is a parallel to fetchMetricsFromGCS, but instead fetches metric files from the local
 * file system.
 *
 * @param {string} tenantId - tenant to fetch from
 * @param {string} metricType - metric grouping to get files for
 * @param {string} [file] - if provided, only this file will be fetched instead of the entire group.
 * Must be a member of the metricType group or an error will be thrown.
 * @return {Promise<FetchedFile>[]} a list of Promises, one per metric file for the given type
 * (or a single promise if `file` was provided)
 */
function fetchMetricsFromLocal(tenantId, metricType, file) {
  return fetchFilesFromLocal(tenantId, filesForMetricType(metricType, file));
}

/**
 * Retrieves the metrics for the given metric type and passes them into the given callback.
 *
 * The callback should be a function with a signature of `function (error, results)`. `results` is
 * a single object with keys mapping to individual metric files and values corresponding to the
 * deserialized contents of those files.
 *
 * First checks the cache to see if the metrics with the given type are already in memory and not
 * expired beyond the configured TTL. If not, then fetches the metrics for that type from the
 * appropriate files and invokes the callback only once all files have been retrieved.
 *
 * If we are in demo mode, then fetches the files from a static directory, /core/demo_data/.
 * Otherwise, fetches from Google Cloud Storage.
 */
function fetchMetrics(tenantId, metricType, file, isDemo, callback) {
  const cacheKey = `${tenantId}-${metricType}-${file}`;
  // eslint-disable-next-line no-console
  console.log(`Handling call to fetch ${cacheKey} metrics...`);

  return memoryCache.wrap(
    cacheKey,
    (cacheCb) => {
      let fetcher = null;
      let source = null;
      if (isDemo) {
        source = "local";
        fetcher = fetchMetricsFromLocal;
      } else {
        source = "GCS";
        fetcher = fetchMetricsFromGCS;
      }

      // eslint-disable-next-line no-console
      console.log(`Fetching ${cacheKey} metrics from ${source}...`);
      const metricPromises = fetcher(tenantId.toUpperCase(), metricType, file);

      Promise.all(metricPromises).then((allFileContents) => {
        const results = {};
        allFileContents.forEach((contents) => {
          // eslint-disable-next-line no-console
          console.log(`Fetched contents for fileKey ${contents.fileKey}`);
          const deserializedFile = convertDownloadToJson(contents.contents);
          results[contents.fileKey] = deserializedFile;
        });

        // eslint-disable-next-line no-console
        console.log(`Fetched all ${cacheKey} metrics from ${source}`);
        cacheCb(null, results);
      });
    },
    callback
  );
}

/**
 * @typedef {Record<string, string>[]} DeserializedFile
 */

/**
 * Retrieves all specified metrics and passes them to the given callback.
 *
 * First checks the cache to see if the requested metrics type are already in memory and not
 * expired beyond the configured TTL. If not, then fetches the metrics from the
 * appropriate files and invokes the callback only once all files have been retrieved.
 *
 * @param {string} tenantId - tenant to fetch from
 * @param {string[]} metrics - list of desired metrics by name
 * @param {boolean} isDemo - in demo mode we fetch the files from a static directory, /core/demo_data/.
 * Otherwise, fetch from Google Cloud Storage.
 * @param {(error: Error | null, results: {[key: string]: DeserializedFile} | undefined) => void} callback -
 * the keys of `results` will map to the strings in `metrics`.
 * @return {Promise<void>} will not resolve until `callback` is called.
 */
async function fetchMetricsByName(tenantId, metricNames, isDemo, callback) {
  let fetcher = null;
  let source = null;
  if (isDemo) {
    source = "local";
    fetcher = fetchFilesFromLocal;
  } else {
    source = "GCS";
    fetcher = fetchFilesFromGCS;
  }

  /** @type {Record<string, DeserializedFile>} */
  const results = {};

  try {
    /** @type {DeserializedFile[]} */
    const deserializedFiles = await Promise.all(
      metricNames.map(async (metricName) => {
        // we want to cache these files individually to avoid redundancy,
        // but unfortunately memoryCache.wrap does not handle partial cache hits well
        // (see https://github.com/BryanDonovan/node-cache-manager/issues/130),
        // so we are going to manage the cache manually
        const cacheKey = `${tenantId}-${metricName}`;
        /** @type {DeserializedFile | void} */
        const cachedResult = await memoryCache.get(cacheKey);
        if (cachedResult) return cachedResult;

        // eslint-disable-next-line no-console
        console.log(`Fetching ${cacheKey} metric from ${source}...`);

        const [filePromise] = fetcher(
          tenantId.toUpperCase(),
          normalizeMetricFilenames({
            names: [metricName],
            registeredFiles: ALL_METRIC_FILES,
          })
        );
        const fileResult = await filePromise;

        // eslint-disable-next-line no-console
        console.log(`Fetched contents for fileKey ${fileResult.fileKey}`);
        const deserializedFile = convertDownloadToJson(fileResult.contents);

        memoryCache.set(cacheKey, deserializedFile);

        return deserializedFile;
      })
    );

    // create a result mapping and pass it to the callback
    metricNames.forEach((metricName, index) => {
      results[metricName] = deserializedFiles[index];
    });
    callback(null, results);
  } catch (e) {
    callback(e);
  }
}

function fetchParoleMetrics(isDemo, tenantId, callback) {
  return fetchMetrics(tenantId, "parole", null, isDemo, callback);
}

function fetchPrisonMetrics(isDemo, tenantId, callback) {
  return fetchMetrics(tenantId, "prison", null, isDemo, callback);
}

function fetchProbationMetrics(isDemo, tenantId, callback) {
  return fetchMetrics(tenantId, "probation", null, isDemo, callback);
}

function fetchRaceMetrics(isDemo, tenantId, callback) {
  return fetchMetrics(tenantId, "race", null, isDemo, callback);
}

function fetchSentencingMetrics(isDemo, tenantId, callback) {
  return fetchMetrics(tenantId, "sentencing", null, isDemo, callback);
}

module.exports = {
  fetchMetricsByName,
  fetchParoleMetrics,
  fetchPrisonMetrics,
  fetchProbationMetrics,
  fetchSentencingMetrics,
  fetchRaceMetrics,
  memoryCache,
};
