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

import { typography } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import { rem } from "polished";
import React, { useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";
import { animated, useTransition } from "react-spring/web.cjs";
import useClipboard from "react-use-clipboard";
import styled from "styled-components/macro";
import emailPath from "../assets/email-logo-white.svg";
import facebookPath from "../assets/facebook-logo-white.svg";
import twitterPath from "../assets/twitter-logo-white.svg";
import getUrlForResource from "../routerUtils/getUrlForResource";
import { useDataStore } from "../StoreProvider";
import {
  animation,
  Checkbox,
  colors,
  Modal,
  ModalHeading,
  SpotlightModalProps,
} from "../UiLibrary";

const Button = styled.button.attrs({ type: "button" })`
  align-items: center;
  background-color: ${colors.link};
  border-radius: 3em;
  border: none;
  color: ${colors.textLight};
  cursor: pointer;
  display: flex;
  font-size: ${rem(11)};
  justify-content: center;
  padding: ${rem(12)} ${rem(16)};
  transition: background-color ${animation.defaultDuration}ms;

  &:disabled {
    cursor: not-allowed;
  }

  &:hover,
  &:focus {
    background-color: ${colors.text};
  }

  &:active {
    background-color: ${colors.text};
  }
`;

const ShareActions = styled.div`
  border-color: ${colors.rule};
  border-style: solid;
  border-width: 1px 0;
  margin: ${rem(24)} 0;
  padding: ${rem(24)} 0;
  position: relative;
`;

const UrlText = styled.div`
  ${typography.Serif24}

  padding-bottom: ${rem(16)};
`;

const ShareButtons = styled.div`
  display: flex;

  & > button {
    margin: 0 ${rem(4)};

    &:first-of-type {
      margin-left: 0;
    }

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const IconTwitter = styled.img.attrs({
  alt: "Twitter",
  src: twitterPath,
})``;

const IconEmail = styled.img.attrs({
  alt: "E-mail",
  src: emailPath,
})``;

const IconFacebook = styled.img.attrs({
  alt: "Facebook",
  src: facebookPath,
})``;

const CopyConfirmation = styled(animated.div).attrs({ role: "status" })`
  bottom: ${rem(4)};
  font-size: ${rem(11)};
  position: absolute;
`;

const IncludeSectionLabel = styled.label`
  align-items: baseline;
  display: flex;
  font-size: ${rem(14)};
  line-height: 1.4;
`;

const SectionTitle = styled.span`
  color: ${colors.link};
`;

const ShareModal = (
  modalProps: Omit<SpotlightModalProps, "children">
): JSX.Element => {
  const {
    tenantStore: {
      currentTenantId,
      currentNarrative,
      currentNarrativeTypeId,
      currentSectionNumber,
    },
  } = useDataStore();
  const [includeSection, setIncludeSection] = useState(false);

  let urlToShare = window.location.host;

  if (currentTenantId) {
    if (currentNarrativeTypeId) {
      urlToShare += getUrlForResource({
        page: "narrative",
        params: {
          tenantId: currentTenantId,
          narrativeTypeId: currentNarrativeTypeId,
          sectionNumber: includeSection ? currentSectionNumber : undefined,
        },
      });
    } else {
      urlToShare += getUrlForResource({
        page: "tenant",
        params: { tenantId: currentTenantId },
      });
    }
  }

  const [isCopied, copyUrl] = useClipboard(urlToShare, {
    successDuration: 5000,
  });

  const transitionConfirmation = useTransition(isCopied, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <Modal {...modalProps}>
      <ModalHeading>Share</ModalHeading>
      <ShareActions>
        <UrlText>{urlToShare}</UrlText>
        <ShareButtons>
          <Button onClick={() => copyUrl()}>Copy URL</Button>
          <EmailShareButton
            url={urlToShare}
            // opens the link in a new tab or window;
            // good for webmail users and consistent with other share links
            // that also open a new window by default
            openShareDialogOnClick
            // prevents the mailto link from also opening a webmail client
            //  in the current window, which happens in some browsers
            onClick={() => undefined}
          >
            <Button as="div">
              <IconEmail />
            </Button>
          </EmailShareButton>
          <FacebookShareButton url={urlToShare}>
            <Button as="div">
              <IconFacebook />
            </Button>
          </FacebookShareButton>
          <TwitterShareButton url={urlToShare}>
            <Button as="div">
              <IconTwitter />
            </Button>
          </TwitterShareButton>
        </ShareButtons>
        {transitionConfirmation.map(
          ({ item, key, props }) =>
            item && (
              <CopyConfirmation key={key} style={props}>
                The URL has been copied to your clipboard.
              </CopyConfirmation>
            )
        )}
      </ShareActions>
      <>
        {currentSectionNumber && currentSectionNumber > 1 && (
          <IncludeSectionLabel>
            <Checkbox
              checked={includeSection}
              onChange={(e) => {
                setIncludeSection(e.target.checked);
              }}
            />
            <span>
              Link to current section:{" "}
              <SectionTitle>
                {currentNarrative?.sections[currentSectionNumber - 2].title}
              </SectionTitle>
            </span>
          </IncludeSectionLabel>
        )}
      </>
    </Modal>
  );
};

export default observer(ShareModal);
