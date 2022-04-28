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

import { Button as BasicButton } from "@recidiviz/design-system";
import { Link } from "@reach/router";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React from "react";
import startCase from "lodash/startCase";
import styled from "styled-components/macro";
import { track } from "../analytics";
import { NarrativeTypeId, TenantId } from "../contentApi/types";
import getUrlForResource from "../routerUtils/getUrlForResource";
import colors from "./colors";
import Arrow from "./Arrow";
import { fluidFontSizeStyles } from "./typography";

const Button = styled(BasicButton)<{ minSize: number; maxSize: number }>`
  background: ${colors.text};
  padding: ${rem(16)} ${rem(24)};
  box-shadow: 0px 10px 20px rgba(0, 108, 103, 0.3);
  animation: fadeInUp 0.5s ease;

  strong {
    display: contents;
  }

  svg {
    margin-left: ${rem(16)};
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(${rem(30)});
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${(props) => fluidFontSizeStyles(props.minSize, props.maxSize)}
`;

const ExploreNarrativeButton: React.FC<{
  narrativeId: NarrativeTypeId;
  tenantId: TenantId;
}> = observer(({ narrativeId, tenantId }) => {
  return (
    <Link
      to={getUrlForResource({
        page: "narrative",
        params: { tenantId, narrativeTypeId: narrativeId },
      })}
      onClick={() =>
        track("narrative_body_link_clicked", {
          category: "navigation",
          label: narrativeId,
        })
      }
    >
      <Button maxSize={24} minSize={16} key={narrativeId}>
        Explore &nbsp;<strong>{startCase(narrativeId)}</strong>&nbsp; Data
        <Arrow direction="right" />
      </Button>
    </Link>
  );
});

export default ExploreNarrativeButton;
