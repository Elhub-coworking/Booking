import "./App.css";

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
      //triggers custom auth flow
      const userSession = await Auth.signIn(phoneValue);
      setSession(userSession);
      setStatusMessage("Waiting for OTP");
      console.log("app", userSession);
    } catch (error) {
      if (error.code === "UserNotFoundException") {
        setStatusMessage("User not found");
      } else if (error.code === "UsernameExistsException") {
        setStatusMessage("Waiting for OTP-222");
      } else {
        console.error(error);
      }
    }
  };

  const verifyOTP = async () => {
    try {
      const user = await Auth.sendCustomChallengeAnswer(session, otp);
      setUser(user);
      setStatusMessage("Verification successful");
      setSession(null);
    } catch (error) {
      setStatusMessage(error);
      setOTP("");
      console.log(error);
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
          <Button onClick={verifyOTP}>Send</Button>
        </Flex>
      )}
    </div>
  );
};

export default App;
