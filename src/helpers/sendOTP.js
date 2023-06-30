import twilio from "twilio";
import "dotenv/config";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOTP = async (phoneNumber) => {
  const codeOTP = Math.random().toString(10).slice(2, 6);
  try {
    const message = await client.messages.create({
      from: "+13093883031",
      to: phoneNumber,
      body: `Your OTP code is: ${codeOTP}`,
    });
    console.log(message.sid);
    return {
      user: "Test user object"
    }
  } catch (error) {
    console.log(error);
  }
};

export { sendOTP };
