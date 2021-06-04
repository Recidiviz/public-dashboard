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

import React from "react";
import { Unknowns } from "../contentModels/types";
import Notes from "../Notes";
import { UnknownsNote } from "./UnknownsNote";

type VizNotesProps = {
  smallData?: boolean;
  unknowns?: Unknowns;
};

const VizNotes: React.FC<VizNotesProps> = ({ smallData, unknowns }) => {
  return (
    <Notes>
      {smallData && (
        <>
          Please always take note of the number of people associated with each
          proportion presented here; in cases where the counts are especially
          low, the proportion may not be statistically significant and therefore
          not indicative of long-term trends.
        </>
      )}
      {unknowns && <UnknownsNote unknowns={unknowns} />}
    </Notes>
  );
};

export default VizNotes;
