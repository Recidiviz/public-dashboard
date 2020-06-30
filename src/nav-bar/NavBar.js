import { Link } from "@reach/router";
import React from "react";

import { DEFAULT_TENANT, PATHS } from "../constants";

function addTenantIdToPath({ path, tenantId }) {
  return path.replace(":tenantId", tenantId);
}

export default function NavBar() {
  // eventually it will be possible to change this;
  // for initial launch it is hard-coded to a single value
  const currentTenant = DEFAULT_TENANT;
  return (
    <nav>
      <ul>
        <li>
          <Link
            to={addTenantIdToPath({
              path: PATHS.overview,
              tenantId: currentTenant,
            })}
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            to={addTenantIdToPath({
              path: PATHS.sentencing,
              tenantId: currentTenant,
            })}
          >
            Sentencing
          </Link>
        </li>
        <li>
          <Link
            to={addTenantIdToPath({
              path: PATHS.prison,
              tenantId: currentTenant,
            })}
          >
            Prison
          </Link>
        </li>
        <li>
          <Link
            to={addTenantIdToPath({
              path: PATHS.probation,
              tenantId: currentTenant,
            })}
          >
            Probation
          </Link>
        </li>
        <li>
          <Link
            to={addTenantIdToPath({
              path: PATHS.parole,
              tenantId: currentTenant,
            })}
          >
            Parole
          </Link>
        </li>
      </ul>
    </nav>
  );
}
