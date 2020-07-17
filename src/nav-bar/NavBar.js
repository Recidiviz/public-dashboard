import PropTypes from "prop-types";
import { Link } from "@reach/router";
import classNames from "classnames";
import React from "react";
import styled from "styled-components";

import { PATHS, ALL_PAGES } from "../constants";

const NavContainer = styled.nav``;

const NavItem = styled.li``;

const NavList = styled.ul`
  font: ${(props) => props.theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  line-height: 2;
  list-style: none;
  margin: 0;
  padding: 0;

  /* Overrides */
  ${(props) => props.navigationStyles.ul};

  ${NavItem} {
    .NavItem__link {
      color: ${(props) => props.theme.colors.heading};
      display: inline-block;
      position: relative;
      text-decoration: none;

      &--active {
        &::after {
          content: "";
          position: absolute;
          left: calc(100% + 8px);
          top: 50%;
          width: 24px;
          border-top: 2px solid ${(props) => props.theme.colors.highlight};
        }
      }

      /* Overrides */
      ${(props) => props.navigationStyles.li};
    }
  }
`;

const addLinkClasses = ({ isCurrent }) => ({
  className: classNames("NavItem__link", {
    "NavItem__link--active": isCurrent,
  }),
});

export default function NavBar({ pages, onClick, navigationStyles, nested }) {
  return (
    <NavContainer>
      <NavList navigationStyles={navigationStyles}>
        {Array.from(pages, ([path, label]) => (
          <NavItem key={path}>
            <Link
              getProps={addLinkClasses}
              to={`${nested ? "../" : ""}${PATHS[path]}`}
              onClick={onClick}
            >
              {label}
            </Link>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
}

NavBar.propTypes = {
  pages: PropTypes.instanceOf(Map),
  onClick: PropTypes.func,
  navigationStyles: PropTypes.shape({
    ul: PropTypes.array,
    li: PropTypes.array,
  }),
  nested: PropTypes.bool,
};

NavBar.defaultProps = {
  pages: ALL_PAGES,
  onClick: undefined,
  navigationStyles: {},
  nested: false,
};
