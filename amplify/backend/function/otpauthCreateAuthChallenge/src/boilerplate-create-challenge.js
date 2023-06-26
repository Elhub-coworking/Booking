// const AWS = require("aws-sdk");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

exports.handler = async (event) => {
  const challengeAnswer = Math.random().toString(10).slice(2, 6);
  const phoneNumber = event.request.userAttributes.phone_number;

  if (!event.request.session || event.request.session.length === 0) {
    const client = new SNSClient({ region: "REGION" });
    const params = {
      Message: `Your OTP code: ${challengeAnswer}`,
      PhoneNumber: phoneNumber, //PHONE_NUMBER, in the E.164 phone number structure
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

  // const sns = new AWS.SNS({ region: "us-east-1" });
  // sns.publish(
  //   {
  //     Message: "your otp: " + challengeAnswer,
  //     PhoneNumber: phoneNumber,
  //     MessageStructure: "string",
  //     MessageAttributes: {
  //       "AWS.SNS.SMS.SenderID": {
  //         DataType: "String",
  //         StringValue: "AMPLIFY",
  //       },
  //       "AWS.SNS.SMS.SMSType": {
  //         DataType: "String",
  //         StringValue: "Transactional",
  //       },
  //     },
  //   },
  //   (err, data) => {
  //     if (err) {
  //       console.log("CREATE ERROR");
  //       console.log(err.stack);
  //       console.log(data);
  //       return;
  //     }
  //     console.log(`SMS sent to ${phoneNumber} and otp = ${challengeAnswer}`);
  //     return data;
  //   }
  // );

  // //set return params
  // event.response.privateChallengeParameters = {};
  // event.response.privateChallengeParameters.answer = challengeAnswer;
  // event.response.challengeMetadata = "CUSTOM_CHALLENGE";

  // callback(null, event);
};
