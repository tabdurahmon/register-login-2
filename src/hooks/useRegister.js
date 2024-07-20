import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useState } from "react";
import { useGlobalContext } from "./useGlobalContext";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useGlobalContext();

  // Register with Google
  const registerWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsPending(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      dispatch({ type: "LOG_IN", payload: user });
      toast.success(`Welcome, ${user.displayName}`);
      setIsPending(false);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
      setIsPending(false);
    }
  };

  // Register with email and password
  const registerEmailAndPassword = async (
    email,
    password,
    displayName,
    photoURL,
    confirmpassword
  ) => {
    try {
      if (confirmpassword !== password) {
        throw new Error("Passwords did not match");
      }
      setIsPending(true);
      const register = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = register.user;

      await updateProfile(auth.currentUser, {
        photoURL,
        displayName,
      });

      dispatch({ type: "LOG_IN", payload: user });
      toast.success(`Welcome, ${user.displayName}`);
      setIsPending(false);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
      setIsPending(false);
    }
  };

  return { registerWithGoogle, isPending, registerEmailAndPassword };
};
