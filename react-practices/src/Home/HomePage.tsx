import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  uid: string | undefined;
  email: string | undefined | null;
}

interface DecodedToken {
  admin: boolean;
}

export default function HomePage() {
  const [signedInUser, setSignedInUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setSignedInUser({
          uid: user.uid,
          email: user.email,
        });

        try {
          const accessToken = await user.getIdToken();
          if (accessToken) {
            const decodedToken = jwtDecode<DecodedToken>(accessToken);
            console.log(decodedToken);
            setIsAdmin(decodedToken.admin);
          } else {
            console.error("Access token is undefined");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        // User is not logged in
        console.log("You are not logged in");
        setIsAdmin(false);
        setSignedInUser(undefined);
      }
    });

    return unsubscribe; // Clean up the subscription
  }, [navigate]);

  return (
    <>
      <h1 className="title">This is the Home Page</h1>
    </>
  );
}
