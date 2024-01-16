import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSingleElectionMutation } from "./electionApiSlice";
import { setElectionData } from "./electionSlice";
import { useDispatch } from "react-redux";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";

export default function ElectionLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [singleElection] = useSingleElectionMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      const data = await singleElection({ cleanReq: true }).unwrap();
      if (data.title) {
        setIsLoggedIn(true);
        dispatch(setElectionData(data));
      } else {
        toast.error("Not Allowed");
        setIsLoggedIn("false");
      }
    }
    fetchData();
  }, [singleElection, dispatch]);
  return (
    <>
      {!isLoggedIn && <Loader container={{ height: "100vh" }} />}
      {isLoggedIn && (
        <div>
          <Outlet />
        </div>
      )}
      {isLoggedIn === "false" && <Navigate to="/dash/dashboard" />}
    </>
  );
}
