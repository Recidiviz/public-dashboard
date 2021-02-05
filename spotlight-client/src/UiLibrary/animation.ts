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

const defaultDuration = 500;
const crossFade = {
  initial: { opacity: 1, top: 0 },
  from: { opacity: 0 },
  enter: { opacity: 1 },
  leave: { opacity: 0, position: "absolute" },
  config: { friction: 40, tension: 280 },
} as const;

export default {
  defaultDuration,
  crossFade,
};
