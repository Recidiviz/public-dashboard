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

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const zip = require("express-easy-zip");
const api = require("./routes/api");

const app = express();

app.use(cors());

const port = process.env.PORT || 3001;
app.set("port", port);

app.use(morgan("dev"));
app.use(helmet());
app.use(zip());

if (process.env.AUTH_ENABLED === "true") {
  const checkJwt = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri:
        "https://recidiviz-spotlight-staging.us.auth0.com/.well-known/jwks.json",
    }),
    audience: "recidiviz-spotlight-staging",
    issuer: "https://spotlight-login-staging.recidiviz.org/",
    algorithms: ["RS256"],
  });
  app.use(checkJwt);
}

app.post("/api/:tenantId/public", express.json(), api.metricsByName);

// uptime check endpoint
app.get("/health", (req, res) => {
  // eslint-disable-next-line no-console
  console.log("Responding to uptime check ...");
  res.sendStatus(200);
});

// An App Engine-specific API for handling warmup requests on new instance initialization
app.get("/_ah/warmup", () => {
  // The server automatically launches initialization of the metric cache, so nothing is needed here
  // eslint-disable-next-line no-console
  console.log("Responding to warmup request...");
});

module.exports = { app, port };
