import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../firebase";
import { collection, doc, getDoc } from "firebase/firestore";

const UserData = () => {
  const router = useRouter();
  const userId = router.query.userId;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          setUser(userSnapshot.data());
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user && user.displayName ? (
        <>
          <h1>{user.displayName}</h1>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>User does not exist or has no display name</p>
      )}
    </div>
  );
};

export default UserData;
