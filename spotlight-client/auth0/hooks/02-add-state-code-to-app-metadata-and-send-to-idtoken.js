/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const namespace = "https://recidiviz.org"; // namespace has to be an HTTP URL
  // https://auth0.com/docs/actions/triggers/post-login
  // https://auth0.com/docs/get-started/apis/scopes/sample-use-cases-scopes-and-claims
  // https://auth0.com/docs/secure/tokens/json-web-tokens/create-namespaced-custom-claims
  const acceptedStateCodes = ["nd", "pa"];
  const emailSplit = event.user.email && event.user.email.split("@");
  const userDomain = emailSplit?.[emailSplit.length - 1].toLowerCase();
  if (
    userDomain &&
    !event.user.app_metadata.state_code &&
    !event.user?.app_metadata.recidiviz_tester
  ) {
    if (userDomain === "recidiviz.org") {
      api.user.setAppMetadata("state_code", "recidiviz");
      api.idToken.setCustomClaim(`${namespace}/app_metadata`, {
        ...event.user.app_metadata,
        state_code: "recidiviz",
      });
      return;
    }

    /** 2. Add user's state_code to the app_metadata */
    const domainSplit = userDomain.split(".");

    const tld = domainSplit[domainSplit.length - 1].toLowerCase();

    // assumes the state is always the second to last component of the domain
    // e.g. @doc.mo.gov or @nd.gov, but not @nd.docr.gov
    const state = domainSplit[domainSplit.length - 2].toLowerCase();

    if (tld === "gov" && acceptedStateCodes.includes(state)) {
      const stateCode = `us_${state}`;
      api.user.setAppMetadata("state_code", stateCode);
      api.idToken.setCustomClaim(`${namespace}/app_metadata`, {
        ...event.user.app_metadata,
        state_code: stateCode,
      });
      return;
    }
  }
  api.idToken.setCustomClaim(
    `${namespace}/app_metadata`,
    event.user.app_metadata
  );
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
// exports.onContinuePostLogin = async (event, api) => {
// };
