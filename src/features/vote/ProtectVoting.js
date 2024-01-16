// Third Party Import
import { Outlet } from "react-router-dom";

import { voteState } from "./voteSlice";

import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

export default function ProtectedVoting() {
  const { canVote } = useSelector(voteState);

  return canVote ? <Outlet /> : <Navigate to="/dash/vote/login-vote" />;
}
