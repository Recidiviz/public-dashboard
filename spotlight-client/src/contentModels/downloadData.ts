// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import { csvFormat } from "d3-dsv";
import downloadjs from "downloadjs";
import JsZip from "jszip";
import mapValues from "lodash/mapValues";
import { stripHtml } from "string-strip-html";

type Records = Record<string, unknown>[];

function recordsToCsv(data: Records): string {
  // filter out NaNs before writing to file
  return csvFormat(
    data.map((record) =>
      mapValues(record, (v) => (Number.isNaN(v) ? undefined : v))
    )
  );
}

type DownloadProps = {
  archiveName: string;
  dataFiles: { name: string; data: Records }[];
  readmeContents: string;
};

export default function downloadData({
  archiveName,
  dataFiles,
  readmeContents,
}: DownloadProps): Promise<void> {
  return new Promise((resolve, reject) => {
    const zip = new JsZip();
    zip.file(`${archiveName}/README.txt`, stripHtml(readmeContents).result);

    dataFiles.forEach(({ name, data }) => {
      zip.file(`${archiveName}/${name}.csv`, recordsToCsv(data));
    });

    zip
      .generateAsync({ type: "blob" })
      .then((content) => {
        downloadjs(content, `${archiveName}.zip`);
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
