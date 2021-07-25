import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/client";

function MainNavigation() {
  const [session, loading] = useSession();

  function logOutHandler() {
    signOut();
  }

  return (
    <>
      <nav className="navbar navbar-light bg-light border-bottom border-left border-right border-info rounded-bottom">
        <Link href="/">
          <a className="navbar-brand">
            <Image
              src="/toppng.com-enguin-penguin-logo-transparent-291x431.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt=""
            />
            PENGUIN CLUB
          </a>
        </Link>
        <form className="form-inline">
          {!session && !loading && (
            <button className="btn btn-primary btn-lg">
              <Link href="/auth">Sign In</Link>
            </button>
          )}
          {session && (
            <>
              <button className="btn btn-danger btn-lg super">
                <Link href="/management">User Management</Link>
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={logOutHandler}
              >
                <Link href="/">Log Out</Link>
              </button>
            </>
          )}
        </form>
      </nav>
    </>
  );
}

export default MainNavigation;