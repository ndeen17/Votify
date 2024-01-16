// Third Party Import
import { Outlet } from "react-router-dom";

import { voteState } from "./voteSlice";

import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

export default function ProtectedVote() {
  const { electionExist } = useSelector(voteState);

  return electionExist ? <Outlet /> : <Navigate to="/dash/vote" />;
}
