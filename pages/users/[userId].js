import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  doc,
  collection,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import UserData from "../../components/UserData";
const userId = () => {
  return (
    <>
      <UserData />
    </>
  );
};

export default userId;
