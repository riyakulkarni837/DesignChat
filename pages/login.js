import React, { useState } from "react";
import useUser from "../lib/useUser";
import LoginForm from "../components/LoginForm";
import fetchJson, { FetchError } from "../lib/fetchJson";

export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: "/chatting",
    redirectIfFound: true,
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (event) => {
    {
      event.preventDefault();

      const body = {
        chatHandle: event.currentTarget.chatHandle.value,
      };

      try {
        const result = await fetchJson("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (result.message && result.message.length > 0) {
          setErrorMsg(result.message);
        } else {
          mutateUser(result);
        }
      } catch (error) {
        if (error instanceof FetchError) {
          setErrorMsg(error.data.message);
        } else {
          console.error("An unexpected error happened:", error);
        }
      }
    }
  };

  return (
    <div className="login-page-container">
      <LoginForm errorMessage={errorMsg} onSubmit={handleSubmit} />
    </div>
  );
}
