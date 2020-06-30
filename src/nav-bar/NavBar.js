import { Link } from "@reach/router";
import React from "react";

import styled from "styled-components";
import { PATHS } from "../constants";

const NavContainer = styled.nav``;

const NavList = styled.ul``;
const NavItem = styled.li``;

export default function NavBar() {
  // eventually it will be possible to change this;
  // for initial launch it is hard-coded to a single value
  return (
    <NavContainer>
      <NavList>
        <NavItem>
          <Link to={PATHS.overview}>Overview</Link>
        </NavItem>
        <NavItem>
          <Link to={PATHS.sentencing}>Sentencing</Link>
        </NavItem>
        <NavItem>
          <Link to={PATHS.prison}>Prison</Link>
        </NavItem>
        <NavItem>
          <Link to={PATHS.probation}>Probation</Link>
        </NavItem>
        <NavItem>
          <Link to={PATHS.parole}>Parole</Link>
        </NavItem>
      </NavList>
    </NavContainer>
  );
}
