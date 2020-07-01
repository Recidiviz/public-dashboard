import { Link } from "@reach/router";
import classNames from "classnames";
import React from "react";

import styled from "styled-components";
import { PATHS } from "../constants";

const NavContainer = styled.nav``;

const NavList = styled.ul`
  font: ${(props) => props.theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  line-height: 2;
  list-style: none;
  margin: 0;
  padding: 0;
`;
const NavItem = styled.li`
  .NavItem__link {
    color: ${(props) => props.theme.colors.heading};
    display: inline-block;
    position: relative;
    text-decoration: none;

    &--active {
      &::after {
        content: "";
        position: absolute;
        left: calc(100% + 6px);
        top: 50%;
        width: 24px;
        border-top: 2px solid ${(props) => props.theme.colors.blue};
      }
    }
  }
`;

const addLinkClasses = ({ isCurrent }) => ({
  className: classNames("NavItem__link", {
    "NavItem__link--active": isCurrent,
  }),
});

export default function NavBar() {
  return (
    <NavContainer>
      <NavList>
        <NavItem>
          <Link getProps={addLinkClasses} to={PATHS.overview}>
            Overview
          </Link>
        </NavItem>
        <NavItem>
          <Link getProps={addLinkClasses} to={PATHS.sentencing}>
            Sentencing
          </Link>
        </NavItem>
        <NavItem>
          <Link getProps={addLinkClasses} to={PATHS.prison}>
            Prison
          </Link>
        </NavItem>
        <NavItem>
          <Link getProps={addLinkClasses} to={PATHS.probation}>
            Probation
          </Link>
        </NavItem>
        <NavItem>
          <Link getProps={addLinkClasses} to={PATHS.parole}>
            Parole
          </Link>
        </NavItem>
      </NavList>
    </NavContainer>
  );
}
