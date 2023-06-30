import twilio from "twilio";
// import "dotenv/config";

const client = twilio(
  "AC4193e4911b7d637fd3beef6bf73850f1",
  "93a2b4df394210d99ec9153b4c6f6002"
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
  } catch (error) {
    console.log(error);
  }
};

export { sendOTP };
