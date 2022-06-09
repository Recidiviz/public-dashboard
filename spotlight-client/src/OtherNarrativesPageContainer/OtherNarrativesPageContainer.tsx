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
import RacialDisparitiesNarrative from "../contentModels/RacialDisparitiesNarrative";
import { useDataStore } from "../StoreProvider";
import RacialDisparitiesNarrativePage from "../RacialDisparitiesNarrativePage/RacialDisparitiesNarrativePage";
import RidersNarrative from "../contentModels/RidersNarrative";
import RidersNarrativePage from "./RidersNarrativePage";

const OtherNarrativesPageContainer: React.FC = () => {
  const { narrative } = useDataStore();

  if (narrative instanceof RacialDisparitiesNarrative) {
    if (narrative.isLoading === undefined) narrative.hydrate();
    return <RacialDisparitiesNarrativePage narrative={narrative} />;
  }

  if (narrative instanceof RidersNarrative && narrative.id === "Riders") {
    return <RidersNarrativePage narrative={narrative} />;
  }

  return null;
};

export default observer(OtherNarrativesPageContainer);
