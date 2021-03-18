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

import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { animated, useTransition } from "react-spring/web.cjs";
import styled from "styled-components/macro";
import { Hydratable } from "../contentModels/types";
import Loading from "../Loading";
import { animation } from "../UiLibrary";

const Wrapper = styled.div`
  position: relative;
`;

const LoadingWrapper = styled(animated.div)`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

type ModelHydrator = {
  children: React.ReactElement;
  model: Hydratable;
};

/**
 * Observes the provided model and only renders `children` if it is hydrated;
 * otherwise renders a loading state. Also initiates hydration of the model
 * if it is not already pending.
 */
const ModelHydrator = ({
  children,
  model,
}: ModelHydrator): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(model.isLoading);

  useEffect(
    autorun(() => {
      if (model.isLoading === undefined) {
        model.hydrate();
      }
      if (isLoading !== model.isLoading) {
        setIsLoading(model.isLoading);
      }
    })
  );

  const transitions = useTransition(isLoading, null, animation.crossFade);

  return (
    <Wrapper>
      {transitions.map(({ item: showLoading, key, props }) => {
        if (showLoading || showLoading === undefined) {
          return (
            <LoadingWrapper key={key} style={{ ...props, width: "100%" }}>
              <Loading />
            </LoadingWrapper>
          );
        }

        return (
          <animated.div key={key} style={props}>
            {children}
          </animated.div>
        );
      })}
    </Wrapper>
  );
};

export default observer(ModelHydrator);
