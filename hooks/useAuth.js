import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createUserIfNotExists } from "../api/createUserIfNotExists";
import { auth } from "../firebase";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create user document if it doesn't exist
        await createUserIfNotExists(user.uid, {
          username: user.displayName,
          email: user.email,
        });

        setUser(user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoggedIn };
};

export default useAuth;
