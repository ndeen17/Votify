import React, { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";

// Component Import

// third Party Import
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

export default function DashLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    async function fetchIsLoggedIn() {
      const response = await fetch(
        `${process.env.REACT_APP_DOMAIN}/auth/isLoggedIn`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data === "false") {
        toast.error("You have to login again");
      }
      if (data) {
        setIsLoggedIn(data);
      }
      return;
    }
    fetchIsLoggedIn();
  }, []);
  return (
    <>
      {!isLoggedIn && <Loader container={{ height: "100vh" }} />}
      {isLoggedIn === "true" && (
        <div>
          <Outlet />
        </div>
      )}
      {isLoggedIn === "false" && <Navigate to="/form" />}
    </>
  );
}
