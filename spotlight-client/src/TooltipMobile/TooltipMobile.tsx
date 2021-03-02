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
import { rem } from "polished";
import React from "react";
import { useSpring } from "react-spring/web.cjs";
import { useDataStore } from "../StoreProvider";
import { FixedBottomPanel } from "../UiLibrary";

const TOOLTIP_HEIGHT = 266;

const TooltipMobile = (): React.ReactElement | null => {
  const enabled = useBreakpoint(false, ["mobile-", true]);
  const { uiStore } = useDataStore();
  const { tooltipMobileData, renderTooltipMobile } = uiStore;

  const dismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    uiStore.clearTooltipMobile();
  };

  const isOpen = Boolean(enabled && tooltipMobileData && renderTooltipMobile);

  // animate the panel opening and closing
  const transitionStyles = useSpring({
    from: { top: 0 },
    top: isOpen ? TOOLTIP_HEIGHT : 0,
  });

  if (enabled) {
    return (
      <>
        <FixedBottomPanel
          className="TooltipMobile"
          closePanel={dismiss}
          isOpen={isOpen}
          top={transitionStyles.top.interpolate((top) =>
            // top should never be undefined in practice, this is just type safety
            top === undefined ? "100%" : `calc(100% - ${rem(top)})`
          )}
        >
          {tooltipMobileData &&
            renderTooltipMobile &&
            renderTooltipMobile(tooltipMobileData)}
        </FixedBottomPanel>
      </>
    );
  }
  return null;
};

export default observer(TooltipMobile);
