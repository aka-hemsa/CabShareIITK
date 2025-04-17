import { useState } from "react";
import { sendOTP } from "../utils/verifyHelper";
import { Button, Input, Text } from "@chakra-ui/react";
import { auth, db } from "../firebase"; // ✅ import auth and db
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");

  const handleSendOTP = async () => {
    const otp = await sendOTP(email);
    if (otp) {
      setServerOtp(otp);
      setOtpSent(true);
    }
  };

  const handleVerify = async () => {
    if (enteredOtp === serverOtp) {
      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in");
        return;
      }

      const userRef = doc(db, "users", user.uid);

      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          // 🔄 update if user doc already exists
          await updateDoc(userRef, {
            isVerified: true,
            instituteEmail: email,
          });
        } else {
          // 🆕 create if user doc doesn’t exist
          await setDoc(userRef, {
            isVerified: true,
            instituteEmail: email,
            name: user.displayName || "",
            photoURL: user.photoURL || "",
            createdAt: new Date().toISOString(),
          });
        }

        alert("Email verified successfully!");
      } catch (err) {
        console.error("Error updating verification status:", err);
        alert("Something went wrong.");
      }
    } else {
      alert("Incorrect OTP");
    }
  };

  return (
    <div>
      <Text mb={2}>Enter your @iitk.ac.in email</Text>
      <Input
        placeholder="your@iitk.ac.in"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button mt={3} onClick={handleSendOTP}>Send OTP</Button>

      {otpSent && (
        <>
          <Input
            mt={4}
            placeholder="Enter OTP"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
          />
          <Button mt={2} colorScheme="green" onClick={handleVerify}>
            Verify
          </Button>
        </>
      )}
    </div>
  );
}
