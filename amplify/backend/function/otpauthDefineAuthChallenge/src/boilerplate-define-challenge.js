exports.handler = async (event) => {
  console.log("checking DEFINE");
  //if there's no session or it's empty
  if (!event.request.session || event.request.session.length === 0) {
    event.response.challengeName = "CUSTOM_CHALLENGE";
    event.response.failAuthentication = false;
    event.response.issueTokens = false;
  } else if (
    event.request.session.length === 1 &&
    event.request.session[0].challengeResult === true
  ) {
    // If passed CUSTOM_CHALLENGE then issue token
    event.response.failAuthentication = false;
    event.response.issueTokens = true;
  } else {
    // Something's wrong. Fail authentication
    event.response.failAuthentication = true;
    event.response.issueTokens = false;
  }
  return event;
};
