const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
// require('dotenv').config()

// const client = require("twilio")(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

exports.handler = async (event) => {
  const challengeAnswer = Math.random().toString(10).slice(2, 6);
  const phoneNumber = event.request.userAttributes.phone_number;

  if (!event.request.session || event.request.session.length === 0) {
    try {
      const message = await client.messages.create({
        from: "+13093883031",
        to: phoneNumber,
        body: `Your OTP code is: ${challengeAnswer}`,
      });
      return {
        user: "exists"
      }

    } catch (error) {
      console.log(error);
    }

    event.response.privateChallengeParameters = {
      answer: challengeAnswer,
    };
    event.response.challengeMetadata = "CUSTOM_CHALLENGE";
  }
  return event;
};
