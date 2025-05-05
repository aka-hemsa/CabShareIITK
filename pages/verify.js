import { useState } from "react";
import { sendOTP } from "../utils/verifyHelper";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { auth, db } from "../firebase";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router"; // Import useRouter

export default function Verify() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const toast = useToast();
  const router = useRouter(); // Initialize router

  const handleSendOTP = async () => {
    const otp = await sendOTP(email);
    if (otp) {
      setServerOtp(otp);
      setOtpSent(true);
      toast({
        title: "OTP sent",
        description: "Check your email for the OTP",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleVerify = async () => {
    if (enteredOtp === serverOtp) {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Error",
          description: "User not logged in",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const userRef = doc(db, "users", user.uid);

      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          await updateDoc(userRef, {
            isVerified: true,
            instituteEmail: email,
          });
        } else {
          await setDoc(userRef, {
            isVerified: true,
            instituteEmail: email,
            name: user.displayName || "",
            photoURL: user.photoURL || "",
            createdAt: new Date().toISOString(),
          });
        }

        toast({
          title: "Verified",
          description: "Your email has been verified",
          status: "success",
          duration: 4000,
          isClosable: true,
        });

        // Redirect to the home page
        router.push("/"); // Redirect to home page

      } catch (err) {
        console.error("Verification error:", err);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Incorrect OTP",
        description: "Please enter the correct OTP",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minHeight="80vh"
      flexDirection="column"
      justifyContent="center" // Center content vertically
      alignItems="center" // Center content horizontally
      p={6}
    >
      <Box maxW="sm" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
        <Heading size="md" mb={4} textAlign="center">
          Verify Institute Email
        </Heading>

        <FormControl mb={4}>
          <FormLabel>Email Address</FormLabel>
          <Input
            placeholder="your@iitk.ac.in"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" width="100%" onClick={handleSendOTP}>
          Send OTP
        </Button>

        {otpSent && (
          <>
            <FormControl mt={6}>
              <FormLabel>Enter OTP</FormLabel>
              <Input
                placeholder="Enter OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
              />
            </FormControl>

            <Button colorScheme="green" mt={4} width="100%" onClick={handleVerify}>
              Verify
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
