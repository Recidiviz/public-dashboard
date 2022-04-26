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
    api.idToken.setCustomClaim(`${namespace}/app_metadata`, event.user.app_metadata);
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
  