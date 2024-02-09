import { useState } from "react";
import { db, auth } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [howDidYouHear, setHowDidYouhear] = useState("");
  const [formError, setFormError] = useState("");
  const [passwordFormError, setPasswordFormError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!/\d/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setPasswordFormError("Password must contain at least one digit, one uppercase letter, and one lowercase letter.");
      return;
    }

    const formData = {
      username: username,
      email: email,
      phoneNumber: phoneNumber,
      country: country,
      age: age,
      howDidYouHear: howDidYouHear,
    };

    try {
      // Creating the user.
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Creating a collection with the user and more information inside of it.
      const usersCollectionRef = collection(db, "users");
      const docRef = await addDoc(usersCollectionRef, {
        userId: userCredential.user.uid,
        ...formData,
      });

      navigate("/");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.log(e);
      if ((e as FirebaseError).code === "auth/email-already-in-use") {
        setFormError("Email is already in use");
      } else {
        setFormError("An error occurred. Please try again later.");
      }
    }
  }

  function formDefaults(name: string, placeholder: string, override = {}) {
    return {
      name,
      type: "text",
      placeholder,
      required: true,
      autoComplete: "on",
      ...override,
    };
  }

  return (
    <>
      <div className="register-container">
        <div className="register-wrapper">
          <form onSubmit={handleRegister}>
            <h1 className="title">Sign Up</h1>

            <div className="error-box">
              <p>{formError}</p>
            </div>
            <div className="input-box">
              <input
                {...formDefaults("email", "Email", { type: "email" })}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-box">
              <input {...formDefaults("username", "Username")} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="input-box">
              <input
                {...formDefaults("phoneNumber", "Phone Number", { type: "tel" })}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="input-box">
              <input {...formDefaults("country", "Country")} onChange={(e) => setCountry(e.target.value)} />
            </div>

            <div className="input-box">
              <input {...formDefaults("age", "Age", { type: "number" })} onChange={(e) => setAge(e.target.value)} />
            </div>

            <p className="password-error">{passwordFormError}</p>

            <div className="input-box">
              <input
                {...formDefaults("password", "Choose a password", { minLength: 8, type: "password" })}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="select-box">
              <select
                {...formDefaults("HowDidYouhear", "", { required: false })}
                className="register-select"
                onChange={(e) => setHowDidYouhear(e.target.value)}
              >
                <option value=""> How did you hear about us?</option>
                <option>From a friend</option>
                <option>On an internet forum</option>
                <option>Somewhere else</option>
              </select>
            </div>

            <button className="register-btn" type="submit">
              Register
            </button>

            <div className="register-link">
              <p>
                Already have an account? <Link to={"/login"}>Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
