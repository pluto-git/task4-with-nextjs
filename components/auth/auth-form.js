import { useState, useRef } from "react";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";

import classes from "./auth-form.module.css";

async function createUser(name, email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

export default function AuthForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const nameInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }
  async function submitHandler(event) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredName = nameInputRef.current.value;

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });

      if (!result.error) {
        console.log(result.error);
        router.replace("/management");
      }
    } else {
      try {
        const result = await createUser(
          enteredName,
          enteredEmail,
          enteredPassword
        );
        console.log(result);
        setIsLogin((prevState) => !prevState);
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Sign In" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          {!isLogin ? (
            <>
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" required ref={nameInputRef} />
            </>
          ) : (
            <>
              <input type="hidden" id="name" required ref={nameInputRef} />
            </>
          )}
        </div>

        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}
