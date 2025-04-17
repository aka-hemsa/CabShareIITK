import { Button } from "@chakra-ui/react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { auth } from "../firebase";
import { useRouter } from "next/router";

const SigninButton = () => {
  const router = useRouter();

  const handleAuth = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle the authentication success {dummy text}
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle the authentication error
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <Button leftIcon={<FaGoogle />} onClick={handleAuth} variant="outline">
      Login
    </Button>
  );
};

export default SigninButton;
