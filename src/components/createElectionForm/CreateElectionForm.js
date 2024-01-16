import React, { useState } from "react";
import "./createElectionForm.scss";
import { useNavigate } from "react-router-dom";
import { setElectionData } from "../../features/election/electionSlice";
import { useDispatch } from "react-redux";
import { useAddNewElectionMutation } from "../../features/election/electionApiSlice";

import Input from "../../components/input/Input";

import logo from "../../assets/logo2.png";

import { BsFillCreditCard2BackFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { Oval, ThreeDots } from "react-loader-spinner";

export default function CreateElectionForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addNewElection] = useAddNewElectionMutation();
  const [electionName, setElectionName] = useState("");
  const [date, setDate] = useState("");

  const msDate = new Date(date).getTime();

  const [pending, setPending] = useState("");

  const createElection = async () => {
    setPending("createElect");
    if (electionName && date) {
      const electionData = await addNewElection({
        title: electionName,
        description: "",
        voters: [],
        endDate: msDate,
        status: "building",
      }).unwrap();
      setPending("");
      if (electionData === "cantCreateTwoElectionsWithDesameTitle") {
        toast.warn("Cant create two election with desame title");
        return;
      }
      if (electionData === "character must be greater than two") {
        toast.warn("Character must be greater than two");
        return;
      }
      if (electionData === "credentialError") {
        toast.warn("Fill all the fields correctly");
        return;
      }
      if (electionData === "serverError") {
        toast.error("Server error, try again later");
        return;
      }
      if (electionData) {
        toast.success("Successful!!");
        dispatch(setElectionData(electionData));
        navigate("/dash/election");
      } else {
        if (electionData === "serverError") {
          toast.error("Server error, try again later");
          return;
        }
      }
      return;
    } else {
      setPending("");
      toast.warn("Fill all the fields correctly");
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
        <b className="FormElectContentTitle">Create an election</b>

        <div className="FormElectContent__input">
          <b>Election Name</b>
          <div>
            <Input
              placeholder="Election Name"
              Icon={BsFillCreditCard2BackFill}
              value={electionName}
              type="text"
              onChange={(e) => setElectionName(e.target.value)}
            />
          </div>
        </div>

        <div className="FormElectContent__input">
          <b>End Date</b>
          <div>
            <Input
              value={date}
              type="date"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {pending !== "createElect" && (
          <button onClick={createElection}>Continue</button>
        )}
        {pending === "createElect" && (
          <button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="button btn solid"
          >
            <Oval
              height={25}
              width={25}
              color="white"
              wrapperStyle={{ marginRight: "5px" }}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="white"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
            <div>Loading</div>
            <div>
              <ThreeDots
                height="20"
                width="20"
                radius="2"
                color="white"
                ariaLabel="three-dots-loading"
                wrapperStyle={{ marginLeft: "5px", marginTop: "5px" }}
                wrapperClassName=""
                visible={true}
              />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
