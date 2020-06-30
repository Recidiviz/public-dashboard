import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const PageContainer = styled.main``;

export default function Page({ name }) {
  return <PageContainer>Page: {name}</PageContainer>;
}

Page.propTypes = {
  name: PropTypes.string.isRequired,
};
