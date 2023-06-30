import "./App.css";

import { sendOTP } from "./helpers/sendOTP";
import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { Auth } from "aws-amplify";
import awsmobile from "./aws-exports";
import {
  Flex,
  PhoneNumberField,
  Button,
  TextField,
} from "@aws-amplify/ui-react";

Amplify.configure(awsmobile);

const App = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dialCode, setDialCode] = useState("");
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [otp, setOTP] = useState("");

  const signIn = async () => {
    setStatusMessage("Verifying your number");
    const phoneValue = `${dialCode}${phoneNumber}`;
    try {
      const userSession = await sendOTP(phoneValue);
      setSession(userSession);
      setStatusMessage("Waiting for OTP");
      console.log("app", userSession);
    } catch (error) {
      console.log("App error", error);
    }
  };

  return (
    <div>
      <h1>{statusMessage}</h1>

      {!user && !session && (
        <Flex direction="column" gap="1rem" width="30vw">
          <PhoneNumberField
            autoComplete="username"
            label="Phone Number"
            name="phoneNumber"
            defaultDialCode="+1"
            descriptiveText="Please enter your phone number"
            placeholder="234-567-8910"
            isRequired={true}
            errorMessage="Enter a valid phone number"
            onDialCodeChange={(event) => setDialCode(event.target.value)}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
          <Button onClick={signIn}>Get OTP</Button>
        </Flex>
      )}

      {!user && session && (
        <Flex direction="column" gap="1rem" width="30vw">
          <TextField
            isRequired={true}
            onChange={(event) => setOTP(event.target.value)}
          />
          <Button>Send</Button>
        </Flex>
      )}
    </div>
  );
};

export default App;
