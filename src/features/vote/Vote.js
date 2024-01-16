import React, { useState } from "react";
import "./vote.css";

import { useSingleElectionMutation } from "../election/electionApiSlice";
import { setElectionData } from "./voteSlice";

import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

import { MdSubtitles, MdPermIdentity } from "react-icons/md";

import Input from "../../components/input/Input";

import { setElectionExist } from "./voteSlice";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function Vote() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [getSingleElection] = useSingleElectionMutation();

  const [electionId, setElectionId] = useState("");
  const [electionName, setElectionName] = useState("");

  const handleVote = async () => {
    const toastId = toast.loading("Processing...");
    const response = await getSingleElection({
      _id: electionId,
      title: electionName,
      fromVote: true,
    }).unwrap();

    if (response === "thisElectionDoesNotExist") {
      toast.update(toastId, {
        render: "This election does not exist",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }

    if (response === "serverError") {
      toast.update(toastId, {
        render: "server error, try again later",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }
    if (response.status !== "running" || response.status !== "completed") {
      toast.update(toastId, {
        render: "This election is not active",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
    }
    if (response.status === "running" || response.status === "completed") {
      toast.update(toastId, {
        render: "Successful!!",
        type: "success",
        autoClose: 5000,
        isLoading: false,
      });
      dispatch(setElectionData(response));
      dispatch(setElectionExist(true));
      navigate("login-vote");
    } else {
      toast.update(toastId, {
        render: "This election cant be accessed at this moment!!",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }
  };

  return (
    <div className="FormElect">
      <div className="FormElect__NavBarLogo">
        <img alt="logo" src={logo} />
        <h1>Votify</h1>
      </div>

      <div className="FormElectContent">
        <b className="FormElectContentTitle">Search for Election</b>

        <div className="FormElectContent__input">
          <b>Election Id</b>
          <div>
            <Input
              placeholder="Election's Id"
              Icon={MdPermIdentity}
              type="text"
              onChange={(e) => setElectionId(e.target.value)}
            />
          </div>
        </div>

        <div className="FormElectContent__input">
          <b>Election Name</b>
          <div>
            <Input
              placeholder="Election's Name"
              Icon={MdSubtitles}
              type="text"
              onChange={(e) => setElectionName(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleVote}>Search</button>
      </div>
    </div>
  );
}
