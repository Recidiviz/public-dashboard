import PropTypes from "prop-types";
import { Link } from "@reach/router";
import classNames from "classnames";
import React from "react";

import styled from "styled-components";
import { PATHS } from "../constants";

const NavContainer = styled.nav``;

const NavItem = styled.li``;

const NavList = styled.ul`
  font: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => (props.large ? "24px" : "11px")};
  font-weight: 600;
  line-height: 2;
  list-style: none;
  margin: 0;
  padding: 0;

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
          left: calc(100% + ${(props) => (props.large ? 16 : 8)}px);
          top: 50%;
          width: ${(props) => (props.large ? 56 : 24)}px;
          border-top: 2px solid ${(props) => props.theme.colors.blue};
        }
      }
    }
  }
`;

const addLinkClasses = ({ isCurrent }) => ({
  className: classNames("NavItem__link", {
    "NavItem__link--active": isCurrent,
  }),
});

export default function NavBar({ large, onClick }) {
  return (
    <NavContainer>
      <NavList large={large}>
        <NavItem>
          <Link getProps={addLinkClasses} to={PATHS.overview} onClick={onClick}>
            Overview
          </Link>
        </NavItem>
        <NavItem>
          <Link
            getProps={addLinkClasses}
            to={PATHS.sentencing}
            onClick={onClick}
          >
            Sentencing
          </Link>
        </NavItem>
        <NavItem>
          <Link getProps={addLinkClasses} to={PATHS.prison} onClick={onClick}>
            Prison
          </Link>
        </NavItem>
        <NavItem>
          <Link
            getProps={addLinkClasses}
            to={PATHS.probation}
            onClick={onClick}
          >
            Probation
          </Link>
        </NavItem>
        <NavItem>
          <Link getProps={addLinkClasses} to={PATHS.parole} onClick={onClick}>
            Parole
          </Link>
        </NavItem>
      </NavList>
    </NavContainer>
  );
}

NavBar.propTypes = {
  large: PropTypes.bool,
  onClick: PropTypes.func,
};

NavBar.defaultProps = {
  large: false,
  onClick: undefined,
};
