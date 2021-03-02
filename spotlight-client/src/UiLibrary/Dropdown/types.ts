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

import { UseSelectReturnValue } from "downshift";

export type DropdownOption = {
  id: string;
  label: string;
};

export type DropdownCommonProps = {
  disabled?: boolean;
  label: string;
  options: DropdownOption[];
};

export type MenuProps = {
  closeMenu: UseSelectReturnValue<DropdownOption>["closeMenu"];
  getItemProps: UseSelectReturnValue<DropdownOption>["getItemProps"];
  getMenuProps: UseSelectReturnValue<DropdownOption>["getMenuProps"];
  highlightedIndex: number;
  isOpen: boolean;
  label: string;
  options: DropdownCommonProps["options"];
  renderOption: RenderOption;
  setWaitForCloseAnimation: (val: boolean) => void;
  waitForCloseAnimation: boolean;
};

export type RenderOption = <Opt extends DropdownOption>(props: {
  getItemProps: UseSelectReturnValue<Opt>["getItemProps"];
  highlightedIndex: number;
  index: number;
  option: Opt;
}) => React.ReactElement;
