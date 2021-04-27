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

import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import RacialDisparitiesNarrative from "../contentModels/RacialDisparitiesNarrative";
import { getDemographicViewLabel, RaceIdentifier } from "../demographics";
import { Dropdown } from "../UiLibrary";

type RaceOrEthnicityFilterSelectProps = {
  narrative: RacialDisparitiesNarrative;
};

const RaceOrEthnicityFilterSelect: React.FC<RaceOrEthnicityFilterSelectProps> = ({
  narrative,
}) => {
  const onChange = action(
    "change race/ethnicity filter",
    (newFilter: string) => {
      // safe assertion because this is the id type in our options array
      // eslint-disable-next-line no-param-reassign
      narrative.selectedCategory = newFilter as RaceIdentifier;
    }
  );

  const dropdownOptions = narrative.allCategories.map(
    ({ identifier, label }) => ({ label, id: identifier })
  );

  return (
    <Dropdown
      label={getDemographicViewLabel("raceOrEthnicity")}
      onChange={onChange}
      options={dropdownOptions}
      selectedId={narrative.selectedCategory}
    />
  );
};

export default observer(RaceOrEthnicityFilterSelect);
