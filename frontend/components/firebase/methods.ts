import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const addUser = async (
  address: string,
  name: string,
  email: string,
  pfp: string,
  safeAddress: string
) => {
  try {
    const docsRef = doc(db, "UserDetails", `${address}`);
    await setDoc(docsRef, {
      name: name,
      email: email,
      pfp: pfp,
      safeAddress: safeAddress,
    });
    console.log(docsRef);
  } catch (error) {
    console.log(error);
  }
};
