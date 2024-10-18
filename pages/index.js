import Link from "next/link";
import useUser from "../lib/useUser";
import Router from "next/router";

function Header({ title }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

export default function HomePage() {
  const { user, mutateUser } = useUser({
    redirectTo: "/chatting",
    redirectIfFound: true,
  });

  function loginButton() {
    return (
      <Link href="/login" className="">
        Login
      </Link>
    );
  }

  return (
    <div className="flex justify-center">
      {!user && loginButton()}
      {user?.isLoggedIn === false && loginButton()}
    </div>
  );
}
