import React, { useState } from "react";
import { nanoid } from "nanoid";

import { useDispatch, useSelector } from "react-redux";
import { setAddVoterRoute, addVoterState } from "./addVoterSlice";

import { useUpdateVoterMutation } from "./addVoterApiSlice";

import { electionState, setElectionData } from "../election/electionSlice";
import { stateData } from "../../stateSlice";

import { SlClose } from "react-icons/sl";
import { toast } from "react-toastify";

const AddVoterForm = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [voterKey, setVoterKey] = useState("");

  const { electionData: currentElectionData } = useSelector(electionState);
  const dispatch = useDispatch();
  const { voterId } = useSelector(stateData);
  const { voterRoute } = useSelector(addVoterState);
  const [updateVoter] = useUpdateVoterMutation();
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const handleAdd = async () => {
    if (name.length < 3 || voterKey.length < 3) {
      toast.warn("Fill in the fields properly");
      return;
    }
    if (!mailformat.test(email)) {
      toast.warn("You have entered a wrong email address");
      return;
    }
    const toastId = toast.loading("Processing...");
    console.log(currentElectionData);
    const value = [
      ...currentElectionData?.voters,
      {
        name: name,
        email: email,
        voterKey: voterKey,
        _id: randomId(),
      },
    ];
    const response = await updateVoter({
      voters: value,
    }).unwrap();
    if (response === "cantEdit") {
      toast.update(toastId, {
        type: "error",
        render: "Changes cannot be made after election has been launched",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }
    if (response === "serverError") {
      toast.update(toastId, {
        render: "Server error, try again later",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }
    if (response) {
      toast.update(toastId, {
        render: "Successful!!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      dispatch(setElectionData(response));
      dispatch(setAddVoterRoute("home"));
    } else {
      toast.update(toastId, {
        render: "Server error, try again later",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const randomId = () => {
    return nanoid() + Date.now().toString();
  };

  const handleUpdate = async () => {
    if (name.length < 3 && voterKey.length < 3 && !mailformat.test(email)) {
      toast.warn("Fill in the fields properly");
      return;
    }
    const toastId = toast.loading("Processing");
    const updatedVoters = currentElectionData?.voters.map((voter) => {
      if (voter?._id === voterId) {
        return {
          ...voter,
          ...(name !== "" && { name }),
          ...(email !== "" && { email }),
          ...(voterKey !== "" && { voterKey }),
        };
      } else {
        return voter;
      }
    });
    const response = await updateVoter({
      voters: updatedVoters,
    }).unwrap();
    if (response === "cantEdit") {
      toast.update(toastId, {
        type: "error",
        render: "Changes cannot be made after election has been launched",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }
    if (response === "serverError") {
      toast.update(toastId, {
        render: "Server error, try again later",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }
    if (response) {
      toast.update(toastId, {
        render: "Successful!!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      dispatch(setElectionData(response));
      dispatch(setAddVoterRoute("home"));
    } else {
      toast.update(toastId, {
        render: "Server error, try again later",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleAction = () => {
    if (props.action === "addVoter") {
      handleAdd();
    }
    if (props.action === "editVoter") {
      handleUpdate();
    }
  };

  return (
    <div className="addVoter__form" style={{ position: "relative" }}>
      <SlClose
        style={{
          position: "absolute",
          top: "1px",
          right: "1px",
          fontSize: "1.7em",
          cursor: "pointer",
          color: "red",
        }}
        onClick={() => dispatch(setAddVoterRoute("home"))}
      />
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Acme",
        }}
      >
        {voterRoute === "editVoter" ? "Edit Voter" : "Add Voter"}
      </h1>

      <div className="modal__form__input">
        <input
          id="Esgtc"
          placeholder="Voter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          id="Esgtc"
          placeholder="Voter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={{ marginBottom: "2em" }}
          id="Esgtc"
          placeholder="Voter Key"
          value={voterKey}
          onChange={(e) => setVoterKey(e.target.value)}
        />

        <button onClick={handleAction}>Save</button>
      </div>
    </div>
  );
};

export default AddVoterForm;
