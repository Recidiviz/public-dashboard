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

import fetchMock from "jest-fetch-mock";
import { runInAction, when } from "mobx";
import { fromPromise } from "mobx-utils";
import { RaceIdentifier } from "../demographics";
import { reactImmediately } from "../testUtils";
import RacialDisparitiesNarrative from "./RacialDisparitiesNarrative";
import contentFixture from "./__fixtures__/tenant_content_exhaustive";

let narrative: RacialDisparitiesNarrative;
const testTenantId = "US_ND";

beforeEach(() => {
  narrative = RacialDisparitiesNarrative.build({
    tenantId: testTenantId,
    content: contentFixture.racialDisparitiesNarrative,
    categoryFilter: contentFixture.demographicCategories.raceOrEthnicity,
  });
});

test("file loading state", (done) => {
  // this should be the initial state of the metric instance
  when(
    () => true,
    () => {
      expect(narrative.isLoading).toBeUndefined();
      expect(narrative.error).toBeUndefined();
    }
  );

  // initiate the fetch; we react to it below
  const dataPromise = fromPromise(narrative.hydrate());

  when(
    () => dataPromise.state === "pending",
    () => {
      expect(narrative.isLoading).toBe(true);
      expect(narrative.error).toBeUndefined();
    }
  );

  when(
    () => dataPromise.state === "fulfilled",
    () => {
      expect(narrative.isLoading).toBe(false);
      expect(narrative.error).toBeUndefined();
      done();
    }
  );

  expect.assertions(6);
});

test("fetch error state", async () => {
  // mocking the backend for this test so we can simulate an error response
  fetchMock.doMock();
  fetchMock.mockResponse(JSON.stringify({ error: "test error message" }), {
    status: 500,
  });

  await narrative.hydrate();

  reactImmediately(() => {
    expect(narrative.isLoading).toBe(false);
    expect(narrative.error?.message).toBe(
      "Metrics API responded with status 500. Error message: test error message"
    );
  });

  expect.hasAssertions();

  // return the mock to its default inactive state
  fetchMock.resetMocks();
  fetchMock.dontMock();
});

describe("total data", () => {
  beforeEach(() => {
    narrative.hydrate();
  });

  test("for introduction", (done) => {
    when(
      () => narrative.likelihoodVsWhite !== undefined,
      () => {
        expect(narrative.likelihoodVsWhite).toMatchSnapshot();
        done();
      }
    );
  });

  test("for sentencing", (done) => {
    when(
      () => narrative.sentencingOverall !== undefined,
      () => {
        expect(narrative.sentencingOverall).toMatchSnapshot();
        done();
      }
    );
  });

  test.each(["supervision", "parole", "probation"] as const)(
    "for %s",
    (supervisionType, done) => {
      runInAction(() => {
        narrative.supervisionType = supervisionType;
      });

      when(
        () => narrative.supervisionOverall !== undefined,
        () => {
          expect(narrative.supervisionOverall).toMatchSnapshot();
          // @ts-expect-error jest type definitions are wrong, this will be a callback
          done();
        }
      );
    }
  );

  test("population data series", (done) => {
    when(
      () => narrative.populationDataSeries !== undefined,
      () => {
        expect(narrative.populationDataSeries).toMatchSnapshot();
        done();
      }
    );
  });
});

describe.each([
  "BLACK",
  "HISPANIC",
  "AMERICAN_INDIAN_ALASKAN_NATIVE",
  "OTHER",
] as RaceIdentifier[])("%s data", (raceIdentifier) => {
  beforeEach(() => {
    runInAction(() => {
      narrative.selectedCategory = raceIdentifier;
    });
    narrative.hydrate();
  });

  test("before corrections", (done) => {
    when(
      () => narrative.beforeCorrections !== undefined,
      () => {
        expect(narrative.beforeCorrections).toMatchSnapshot();
        done();
      }
    );
  });

  test("for sentencing", (done) => {
    when(
      () => narrative.sentencing !== undefined,
      () => {
        expect(narrative.sentencing).toMatchSnapshot();
        done();
      }
    );
  });

  test("for releases to parole", (done) => {
    when(
      () => narrative.releasesToParole !== undefined,
      () => {
        expect(narrative.releasesToParole).toMatchSnapshot();
        done();
      }
    );
  });

  test("for programming", (done) => {
    when(
      () => narrative.programming !== undefined,
      () => {
        expect(narrative.programming).toMatchSnapshot();
        done();
      }
    );
  });

  test.each(["supervision", "parole", "probation"] as const)(
    "for %s",
    (supervisionType, done) => {
      runInAction(() => {
        narrative.supervisionType = supervisionType;
      });

      when(
        () => narrative.supervision !== undefined,
        () => {
          expect(narrative.supervision).toMatchSnapshot();
          // @ts-expect-error jest type definitions are wrong, this will be a callback
          done();
        }
      );
    }
  );

  test("for focused population data series", (done) => {
    when(
      () => narrative.focusedPopulationDataSeries !== undefined,
      () => {
        expect(narrative.focusedPopulationDataSeries).toMatchSnapshot();
        done();
      }
    );
  });

  test("for parole release data series", (done) => {
    when(
      () => narrative.paroleReleaseDataSeries !== undefined,
      () => {
        expect(narrative.paroleReleaseDataSeries).toMatchSnapshot();
        done();
      }
    );
  });

  test("for programming data series", (done) => {
    when(
      () => narrative.programmingDataSeries !== undefined,
      () => {
        expect(narrative.programmingDataSeries).toMatchSnapshot();
        done();
      }
    );
  });

  test("for sentencing data series", (done) => {
    when(
      () => narrative.sentencingDataSeries !== undefined,
      () => {
        expect(narrative.sentencingDataSeries).toMatchSnapshot();
        done();
      }
    );
  });

  test.each(["supervision", "parole", "probation"] as const)(
    "for %s revocations data series",
    (supervisionType, done) => {
      runInAction(() => {
        narrative.supervisionType = supervisionType;
      });

      when(
        () => narrative.revocationsDataSeries !== undefined,
        () => {
          expect(narrative.revocationsDataSeries).toMatchSnapshot();
          // @ts-expect-error jest type definitions are wrong, this will be a callback
          done();
        }
      );
    }
  );
});

describe("available categories", () => {
  test("default", () => {
    narrative = RacialDisparitiesNarrative.build({
      tenantId: testTenantId,
      content: contentFixture.racialDisparitiesNarrative,
      categoryFilter: undefined,
    });
    expect(narrative.allCategories).toMatchSnapshot();
  });

  test("customized", () => {
    expect(narrative.allCategories).toMatchSnapshot();
  });
});
