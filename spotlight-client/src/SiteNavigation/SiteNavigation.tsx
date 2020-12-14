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

import { Link } from "@reach/router";
import { observer } from "mobx-react-lite";
import React from "react";
import { useDataStore } from "../StoreProvider";

const SiteNavigation: React.FC = () => {
  const tenant = useDataStore().tenantStore.currentTenant;

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">home</Link>
        </li>
        <li>
          <Link to="/us-nd">north dakota</Link>
        </li>
        {tenant && (
          <>
            <li>
              <Link to="/us-nd/explore">north dakota explore</Link>
            </li>
            <li>
              <Link to="/us-nd/narratives">north dakota narratives</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default observer(SiteNavigation);
