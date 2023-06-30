const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

exports.handler = async (event) => {
  const challengeAnswer = Math.random().toString(10).slice(2, 6);
  const phoneNumber = event.request.userAttributes.phone_number;

  if (!event.request.session || event.request.session.length === 0) {
    const client = new SNSClient({ region: "us-east-1" });
    const params = {
      Message: `Your OTP code: ${challengeAnswer}`,
      PhoneNumber: phoneNumber, 
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: "AMPLIFY",
        },
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    };
    const command = new PublishCommand(params);
    try {
      const data = await client.send(command);
      console.log(`SMS sent to ${phoneNumber} and otp = ${challengeAnswer}`);
      return data;
    } catch (err) {
      console.log("Error", err.stack);
    }

    event.response.privateChallengeParameters = {
      answer: challengeAnswer,
    };
    event.response.challengeMetadata = "CUSTOM_CHALLENGE";
  }
  return event;
};
