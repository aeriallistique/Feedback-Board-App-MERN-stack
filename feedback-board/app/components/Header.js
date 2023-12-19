import { signIn, signOut, useSession } from "next-auth/react"
import Button from "./Button";
import Login from "./icons/Login";
import Logout from "./icons/Logout";

export default function Header(){
  const {data:session} = useSession();
  const isLoggedIn = !!session?.user?.email;
  function logout(){
    signOut();
  }

  function login(){
    signIn('google');
  }

  return(
    <div className="max-w-2xl mx-auto p-2 text-right flex gap-4 justify-end items-center">
      {isLoggedIn && (
        <>
          <span>
            Hello <b>{session.user.name}</b>
          </span>
          <Button 
            className="border bg-white shadow-sm px-2 py-" 
            onClick={logout}>
              Logout <Logout />
          </Button>
        </>
      )}
      {!isLoggedIn && (
        <>
          <span>
            Not logged in!
          </span>
          <Button 
            primary
            className="shadow-sm px-2 py-" 
            onClick={login}>
              Login <Login />
          </Button>
        </>
      )}
    </div>
  )
}