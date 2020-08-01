import PropTypes from "prop-types";
import { Link } from "@reach/router";
import classNames from "classnames";
import React from "react";
import styled from "styled-components";
import { mediaQuery } from "@w11r/use-breakpoint";

import { PATHS, ALL_PAGES } from "../constants";
import { fluidFontSizeStyles } from "../utils";

const NavContainer = styled.nav`
  /* List Style Overrides */

  .secondary {
    display: flex;
    ${mediaQuery(["mobile-", "display: inline-block;"])}
    font-size: 20px;
    justify-content: space-between;
  }
`;

const NavItem = styled.li``;

const NavList = styled.ul`
  font: ${(props) => props.theme.fonts.body};
  font-size: 15px;
  font-weight: 600;
  line-height: 2;
  list-style: none;
  margin: 0;
  padding: 0;

  ${NavItem} {
    /* Default List Item Link Styles */

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
          border-top: 2px solid ${(props) => props.theme.colors.highlight};
        }
      }
    }

    /* List Item Link Style Overrides */

    .branding-bar {
      font-size: 24px;
      &--active {
        &::after {
          content: "";
          position: absolute;
          left: calc(100% + 16px);
          top: 50%;
          width: 56px;
          border-top: 2px solid ${(props) => props.theme.colors.highlight};
        }
      }
    }

    .overview {
      border-top: 1px solid ${(props) => props.theme.colors.divider};
      font-size: 64px;
      width: 100%;
      ${fluidFontSizeStyles(32, 64)}
    }

    .secondary {
      &--active {
        border-bottom: 2px solid ${(props) => props.theme.colors.highlight};

        &::after {
          content: none;
        }
      }
    }
  }
`;

const addLinkClasses = (overrideClass, isCurrent) => ({
  className: classNames(
    "NavItem__link",
    overrideClass,
    { "NavItem__link--active": isCurrent },
    { [`${overrideClass}--active`]: isCurrent }
  ),
});

export default function NavBar({
  pages,
  onClick,
  className,
  nested,
  extraLinks,
}) {
  return (
    <NavContainer>
      <NavList className={className}>
        {Array.from(pages, ([path, label]) => (
          <NavItem key={path}>
            <Link
              getProps={({ isCurrent }) => addLinkClasses(className, isCurrent)}
              to={`${nested ? "../" : ""}${PATHS[path]}`}
              onClick={onClick}
            >
              {label}
            </Link>
          </NavItem>
        ))}
        {extraLinks.map(({ text, url }, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <NavItem key={i}>
            <a {...addLinkClasses(className)} href={url}>
              {text}
            </a>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
}

NavBar.propTypes = {
  pages: PropTypes.instanceOf(Map),
  onClick: PropTypes.func,
  className: PropTypes.string,
  nested: PropTypes.bool,
  extraLinks: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.node.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
};

NavBar.defaultProps = {
  pages: ALL_PAGES,
  onClick: undefined,
  className: "",
  nested: false,
  extraLinks: [],
};
