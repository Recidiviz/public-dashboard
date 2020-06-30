import PropTypes from "prop-types";
import React from "react";

export default function Page({ name, tenantId }) {
  return (
    <div>
      Page: {name} - Tenant: {tenantId}
    </div>
  );
}

Page.propTypes = {
  name: PropTypes.string.isRequired,
  tenantId: PropTypes.string.isRequired,
};
