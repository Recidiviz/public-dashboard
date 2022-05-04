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
 * This file contains route handlers for calls to our Metrics API, to be mapped to app routes
 * in server.js.
 */

const metricsApi = require("../core/metricsApi");
const demoMode = require("../utils/demoMode");

const isDemoMode = demoMode.isDemoMode();

/**
 * A callback which returns either either an error payload or a data payload.
 */
function responder(res) {
  return function respond(err, data) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.send(data);
    }
  };
}

function metricsByName(req, res) {
  const { AUTH_ENABLED, AUTH0_APP_METADATA_KEY } = process.env;
  const { tenantId } = req.params;
  const { metrics } = req.body;
  const stateCode =
    AUTH0_APP_METADATA_KEY &&
    req.user?.[AUTH0_APP_METADATA_KEY]?.state_code?.toLowerCase();
  if (!Array.isArray(metrics)) {
    res
      .status(400)
      .json({ error: "request is missing metrics array parameter" });
  } else if (
    AUTH_ENABLED === "true" &&
    stateCode !== tenantId.toLowerCase() &&
    stateCode !== "recidiviz"
  ) {
    res.status(401).json({
      error: `User is not a member of the requested tenant ${tenantId}`,
    });
  } else {
    metricsApi.fetchMetricsByName(
      tenantId,
      metrics,
      isDemoMode,
      responder(res)
    );
  }
}

module.exports = {
  metricsByName,
};
