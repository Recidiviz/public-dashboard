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

import { navigate } from "@reach/router";
import { range } from "d3-array";
import { reaction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_BAR_HEIGHT } from "../constants";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";

/**
 * Encapsulates the internal narrative navigation functionality
 * and returns the properties and methods necessary for rendering.
 */
export const useInternalNavigation = (): {
  alwaysExpanded: boolean;
  currentSectionNumber: number;
  fixedHeightSections: number[];
  onSectionInViewChange: (props: {
    inView: boolean;
    sectionNumber: number;
  }) => void;
  scrollToSection: (s: number) => void;
  sectionsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
} => {
  const { tenantStore } = useDataStore();
  const {
    currentTenantId: tenantId,
    currentNarrativeTypeId: narrativeTypeId,
    currentSectionNumber = 1,
  } = tenantStore;

  // call this to update the URL, which will in turn update
  // the currentSectionNumber we get from the data store
  const navigateToSection = useCallback(
    (newSectionNumber: number) => {
      // this is just type safety; should always be defined in practice
      if (!tenantId || !narrativeTypeId) return;

      navigate(
        getUrlForResource({
          page: "narrative",
          params: {
            tenantId,
            narrativeTypeId,
            sectionNumber: newSectionNumber,
          },
        }),
        { replace: true }
      );
    },
    [narrativeTypeId, tenantId]
  );

  // attach this to the element containing sections so we can inspect its children
  const sectionsContainerRef = useRef<HTMLDivElement | null>(null);

  // call this to scroll a section into view
  const scrollToSection = useCallback(
    (targetSection: number) => {
      const sectionEl = sectionsContainerRef.current?.querySelector(
        `#section${targetSection}`
      );

      if (sectionEl) {
        const { top } = sectionEl.getBoundingClientRect();
        // NOTE: we are using a polyfill to make sure this method works in all browsers;
        // native support is spotty as of this writing
        window.scrollBy({
          top: top - NAV_BAR_HEIGHT,
          behavior: "smooth",
        });
      }
    },
    [sectionsContainerRef]
  );

  // needed for handling direct section links without layout jank
  const initialState = useLocalObservable(() => ({
    initialSection: currentSectionNumber,
  }));
  // when the narrative changes, reset the initial section
  useEffect(() =>
    reaction(
      () => {
        // sectionNumber is only "initial" when it's accompanied by one or both of these changing;
        // we don't actually need to consume them, only react to them
        return [
          tenantStore.currentTenantId,
          tenantStore.currentNarrativeTypeId,
        ];
      },
      () => {
        initialState.initialSection = tenantStore.currentSectionNumber || 1;
      }
    )
  );
  // dereference for the sake of brevity
  const { initialSection } = initialState;

  // if we have navigated directly to a section, bring it into the viewport
  useEffect(() => {
    scrollToSection(initialSection);
  }, [initialSection, navigateToSection, scrollToSection]);

  // when navigating directly to a section at page load, we will
  // restrict the heights of any sections above it
  // to prevent them from pushing other content down the page as they load
  const [fixedHeightSections, setFixedHeightSections] = useState(
    range(1, initialSection)
  );
  // we can skip the height restrictions and animations if we landed at the top
  const alwaysExpanded = initialSection === 1;

  // remove sections from the fixed-height list as we pass through their range;
  // retain any still above the current section until we get all the way to the top
  useEffect(() => {
    const fixedHeightEnd = Math.min(currentSectionNumber, initialSection);
    if (fixedHeightSections.length) {
      setFixedHeightSections(
        // make sure we don't add any sections back when we scroll down again
        range(1, fixedHeightEnd).slice(0, fixedHeightSections.length)
      );
    }
  }, [currentSectionNumber, initialSection, fixedHeightSections.length]);

  // the IntersectionObservers within sections need to be disabled until we have made sure
  // the initial section indicated by the URL is in the viewport, so let's keep track of that
  const [initialScrollComplete, setInitialScrollComplete] = useState(
    // if we have landed on the first section there won't be any initial scroll
    initialSection === 1
  );

  // call this when new sections come into view; it makes sure the initial section is aligned
  // with the viewport, and it updates the URL to reflect what's currently in view
  const onSectionInViewChange = useCallback(
    ({ inView, sectionNumber }: { inView: boolean; sectionNumber: number }) => {
      if (inView) {
        if (initialScrollComplete) {
          navigateToSection(sectionNumber);
        } else if (sectionNumber === initialSection) {
          // section number could be missing or out of bounds; make sure URL matches view
          navigateToSection(sectionNumber);
          // section could be offset from the top due to saved browser state; align it
          scrollToSection(sectionNumber);
          // clearing this activates the IntersectionObservers for all sections
          setInitialScrollComplete(true);
        }
      }
    },
    [initialScrollComplete, initialSection, navigateToSection, scrollToSection]
  );

  return {
    alwaysExpanded,
    currentSectionNumber,
    fixedHeightSections,
    onSectionInViewChange,
    scrollToSection,
    sectionsContainerRef,
  };
};
