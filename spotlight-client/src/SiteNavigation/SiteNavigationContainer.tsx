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
import React, { useCallback, useState } from "react";
import ShareModal from "../ShareModal";
import SiteNavigation from "./SiteNavigation";
import SiteNavigationMobile from "./SiteNavigationMobile";

export default function SiteNavigationContainer(): React.ReactElement {
  const isMobile = useBreakpoint(false, ["mobile-", true]);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const openShareModal = useCallback(() => setShareModalOpen(true), []);
  return (
    <>
      {isMobile ? (
        <SiteNavigationMobile openShareModal={openShareModal} />
      ) : (
        <SiteNavigation openShareModal={openShareModal} />
      )}
      <ShareModal
        isOpen={shareModalOpen}
        onRequestClose={() => setShareModalOpen(false)}
      />
    </>
  );
}
