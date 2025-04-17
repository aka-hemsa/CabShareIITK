import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createUserIfNotExists = async (userId, userData) => {
  const userRef = doc(db, "users", userId);
  const docSnapshot = await getDoc(userRef);

  if (!docSnapshot.exists()) {
    await setDoc(userRef, userData);
  }
};
