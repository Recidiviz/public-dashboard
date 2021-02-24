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

import useBreakpoint from "@w11r/use-breakpoint";
import { observer } from "mobx-react-lite";
import React from "react";
import { useDataStore } from "../StoreProvider";
import { FixedBottomPanel } from "../UiLibrary";

const TooltipMobile = (): React.ReactElement | null => {
  const enabled = useBreakpoint(false, ["mobile-", true]);
  const { uiStore } = useDataStore();
  const { tooltipMobileData, renderTooltipMobile } = uiStore;

  const dismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    uiStore.clearTooltipMobile();
  };

  if (enabled && tooltipMobileData && renderTooltipMobile) {
    return (
      <>
        <FixedBottomPanel className="TooltipMobile" closePanel={dismiss} isOpen>
          {renderTooltipMobile(tooltipMobileData)}
        </FixedBottomPanel>
      </>
    );
  }
  return null;
};

export default observer(TooltipMobile);
