import { onAuthStateChanged, signOut } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";

interface User {
  uid: string | undefined;
  email: string | undefined | null;
}

interface DecodedToken {
  admin: boolean;
}

export default function Header() {
  const [signedInUser, setSignedInUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState(false);

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
  }, []);

  async function logout() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="header-container">
      <h2 className="header-title">
        <Link to="/">Header</Link>
      </h2>
      <nav>
        <ul className="header-ul">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/info">Info</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin">Admin</Link>
            </li>
          )}
          {signedInUser ? (
            <li onClick={logout}> Logout</li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
