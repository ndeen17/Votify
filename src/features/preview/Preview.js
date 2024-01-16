import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useLoginVoteMutation } from "../../features/vote/voteApiSlice";
import { useDispatch } from "react-redux";
import {
  setVoterData,
  setCanVote,
  setElectionExist,
} from "../../features/vote/voteSlice";

import { useNavigate } from "react-router-dom";

import { BsKeyFill, BsFillPeopleFill } from "react-icons/bs";

import Input from "../../components/input/Input";

import logo from "../../assets/logo.png";

export default function Launch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginVote] = useLoginVoteMutation();

  const [voterKey, setVoterKey] = useState("");
  const [voterName, setVoterName] = useState("");

  const loginVoter = async () => {
    const toastId = toast.loading("Processing");
    const response = await loginVote({
      voterName: voterName,
      voterKey: voterKey,
    }).unwrap();
    if (response === "serverError") {
      toast.update(toastId, {
        render: "server error, try again later",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
    }
    if (response === "voterDoesNotExist") {
      toast.update(toastId, {
        render: "Voter does not exist",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
    }
    dispatch(setVoterData(response));

    if (response === "preview-vote") {
      toast.update(toastId, {
        render: "Successful!!",
        type: "success",
        autoClose: 5000,
        isLoading: false,
      });
      dispatch(setElectionExist(true));
      dispatch(setCanVote(true));
      navigate("/dash/vote/login-vote/voting");
      return;
    }
  };

  useEffect(() => {
    let id1 = toast.info("This is Preview Mode", { autoClose: false });
    let id2 = toast.info("Your voter name is test", { autoClose: false });
    let id3 = toast.info("Your voter key is test", { autoClose: false });
    return () => {
      toast.dismiss(id1);
      toast.dismiss(id2);
      toast.dismiss(id3);
    };
  }, []);

  return (
    <div className="LaunchWrapper">
      <div className="FormElect">
        <div className="FormElect__NavBarLogo">
          <img alt="logo" src={logo} />
          <h1>Votify</h1>
        </div>

        <div className="FormElectContent">
          <b className="FormElectContentTitle">Login to Election</b>

          <div className="FormElectContent__input">
            <b>Voter Name</b>
            <div>
              <Input
                placeholder="Voter Name"
                Icon={BsFillPeopleFill}
                type="text"
                onChange={(e) => setVoterName(e.target.value)}
              />
            </div>
          </div>

          <div className="FormElectContent__input">
            <b>Voter Key</b>
            <div>
              <Input
                placeholder="Voter Key"
                Icon={BsKeyFill}
                type="text"
                onChange={(e) => setVoterKey(e.target.value)}
              />
            </div>
          </div>

          <button onClick={loginVoter}>Continue</button>
        </div>
      </div>
    </div>
  );
}
