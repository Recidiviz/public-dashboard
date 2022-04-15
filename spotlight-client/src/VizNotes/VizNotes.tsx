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

import { observer } from "mobx-react-lite";
import React from "react";
import { Unknowns } from "../contentModels/types";
import Notes from "../Notes";
import { useDataStore } from "../StoreProvider";
import { UnknownsNote } from "./UnknownsNote";

type VizNotesProps = {
  smallData?: boolean;
  unknowns?: Unknowns;
  download?: () => void;
};

const VizNotes: React.FC<VizNotesProps> = ({
  smallData,
  unknowns,
  download,
}) => {
  const { tenant } = useDataStore();
  return (
    <Notes>
      {smallData && <>{tenant?.smallDataDisclaimer}</>}
      {unknowns && download && <UnknownsNote download={download} />}
    </Notes>
  );
};

export default observer(VizNotes);
