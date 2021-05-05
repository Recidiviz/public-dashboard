// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "intersection-observer";

import { configure } from "mobx";
import React from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import smoothScroll from "smoothscroll-polyfill";
import App from "./App";

smoothScroll.polyfill();

configure({
  // make proxies optional for IE 11 support
  useProxies: "ifavailable",
  // activate runtime linting
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});

ReactDOM.render(<App />, document.getElementById("root"), () => {
  ReactModal.setAppElement("#root");
});
