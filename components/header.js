import Link from "next/link";
import useUser from "../lib/useUser";
import { useRouter } from "next/router";

import fetchJson from "../lib/fetchJson";

export default function NavBar() {
  const { user, mutateUser } = useUser({
    redirectTo: "",
  });
  const router = useRouter();

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-log-container">
          <span className="logo">
            {user?.isLoggedIn === false && (
              <Link className="logo" href="/">
                Design Challenge
              </Link>
            )}
            {user?.isLoggedIn === true && <span>Design Challenge</span>}
          </span>
        </div>
        {user?.isLoggedIn === false && (
          <div>
            <Link href="/login" className="login">
              Login
            </Link>
          </div>
        )}
        {user?.isLoggedIn === true && (
          <p className="text-slate-100">
            Hello!&nbsp;{user.chatHandle}&nbsp;&nbsp;
          </p>
        )}
        {user?.isLoggedIn === true && (
          <div>
            <a
              href="/logout"
              onClick={async (e) => {
                e.preventDefault();
                mutateUser(
                  await fetchJson("/api/logout", { method: "POST" }),
                  false
                );
                router.push("/login");
              }}
              className="login"
            >
              Logout
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
