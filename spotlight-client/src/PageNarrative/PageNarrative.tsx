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

import { Redirect, RouteComponentProps } from "@reach/router";
import useBreakpoint from "@w11r/use-breakpoint";
import React from "react";
import { isSystemNarrativeTypeId, NarrativeTypeId } from "../contentApi/types";
import NarrativeFooter from "../NarrativeFooter";
import { NarrativesSlug } from "../routerUtils/types";
import SystemNarrativePage from "../SystemNarrativePage";
import withRouteSync from "../withRouteSync";

type PageNarrativeProps = RouteComponentProps & {
  narrativeTypeId?: NarrativeTypeId;
};

const PageNarrative: React.FC<PageNarrativeProps> = ({ narrativeTypeId }) => {
  const showFooter = useBreakpoint(true, ["mobile-", false]);

  if (narrativeTypeId === undefined) {
    return <Redirect to={`/${NarrativesSlug}/not-found`} />;
  }

  return (
    <>
      {isSystemNarrativeTypeId(narrativeTypeId) ? (
        <SystemNarrativePage />
      ) : (
        <div>TK</div>
      )}
      {showFooter && <NarrativeFooter />}
    </>
  );
};

export default withRouteSync(PageNarrative);
