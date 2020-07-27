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
    "supervision_revocations_by_month_by_type_by_demographics.json",
    "supervision_success_by_month.json",
    "supervision_success_by_period_by_demographics.json",
  ],
  prison: ["incarceration_releases_by_type_by_period.json"],
  probation: [
    "active_program_participation_by_region.json",
    "judicial_districts.json",
    "supervision_population_by_district_by_demographics.json",
    "supervision_revocations_by_month_by_type_by_demographics.json",
    "supervision_success_by_month.json",
    "supervision_success_by_period_by_demographics.json",
  ],
  sentencing: [
    "judicial_districts.json",
    "sentence_lengths_by_district_by_demographics.json",
    "sentence_type_by_district_by_demographics.json",
  ],
};

/**
 * Converts the given contents, a Buffer of bytes, into a JS object or array.
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
 * Returns an array of all of the files that should be retrieved based on the
 * given metric type.

 * If a file is given, it will return an array containing only a normalized
 * version of that file name, unless that file does not match the given metric
 * type, in which case this throws an Error.
 */
function filesForMetricType(metricType, file) {
  const files = FILES_BY_METRIC_TYPE[metricType];

  if (file) {
    const normalizedFile = `${file}.json`;
    if (files.indexOf(normalizedFile) > -1) {
      return [normalizedFile];
    }
    throw new Error(
      `Metric file ${normalizedFile} not registered for metric type ${metricType}`
    );
  }

  return files;
}

/**
 * Retrieves all metric files for the given metric type from Google Cloud Storage.
 *
 * Returns a list of Promises, one per metric file for the given type, where each Promise will
 * eventually return either an error or an object with two keys:
 *   - `fileKey`: a unique key for identifying the metric file, e.g. 'revocations_by_month'
 *   - `contents`: the contents of the file deserialized into JS objects/arrays
 *   - `file`: (optional) a specific metric file under this metric type to request. If absent,
 *             requests all files for the given metric type.
 */
function fetchMetricsFromGCS(tenantId, metricType, file) {
  const promises = [];

  const files = filesForMetricType(metricType, file);
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
 * This is a parallel to fetchMetricsFromGCS, but instead fetches metric files from the local
 * file system.
 */
function fetchMetricsFromLocal(tenantId, metricType, file) {
  const promises = [];

  const files = filesForMetricType(metricType, file);
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
 * If we are in demo mode, then fetches the files from a static directory, /server/core/demo_data/.
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

function fetchParoleMetrics(isDemo, tenantId, callback) {
  return fetchMetrics(tenantId, "parole", null, isDemo, callback);
}

function fetchPrisonMetrics(isDemo, tenantId, callback) {
  return fetchMetrics(tenantId, "prison", null, isDemo, callback);
}

function fetchProbationMetrics(isDemo, tenantId, callback) {
  return fetchMetrics(tenantId, "probation", null, isDemo, callback);
}

function fetchSentencingMetrics(isDemo, tenantId, callback) {
  return fetchMetrics(tenantId, "sentencing", null, isDemo, callback);
}

module.exports = {
  fetchParoleMetrics,
  fetchPrisonMetrics,
  fetchProbationMetrics,
  fetchSentencingMetrics,
};
