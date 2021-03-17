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

import { capitalCase } from "change-case";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import RacialDisparitiesNarrative, {
  SupervisionType,
  SupervisionTypeList,
} from "../contentModels/RacialDisparitiesNarrative";
import { Dropdown } from "../UiLibrary";

const DROPDOWN_OPTIONS = SupervisionTypeList.map((id) => ({
  id,
  label: `${id === "supervision" ? "All " : ""}${capitalCase(id)}`,
}));

type SupervisionTypeFilterSelectProps = {
  narrative: RacialDisparitiesNarrative;
};

const SupervisionTypeFilterSelect: React.FC<SupervisionTypeFilterSelectProps> = ({
  narrative,
}) => {
  const onChange = action(
    "change supervision type filter",
    (newFilter: string) => {
      // safe assertion because this is the id type in our options array
      // eslint-disable-next-line no-param-reassign
      narrative.supervisionType = newFilter as SupervisionType;
    }
  );

  return (
    <Dropdown
      label="Supervision Type"
      onChange={onChange}
      options={DROPDOWN_OPTIONS}
      selectedId={narrative.supervisionType}
    />
  );
};

export default observer(SupervisionTypeFilterSelect);
