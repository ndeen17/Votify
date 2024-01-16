import React from "react";
import "./modal.scss";

import { SlClose } from "react-icons/sl";

import { ballotState, setBallotRoute } from "../../features/ballot/ballotSlice";

import { useDispatch, useSelector } from "react-redux";

import { electionState } from "../../features/election/electionSlice";
import UpdateForm from "../../components/updateForm/UpdateForm";
import AddVoterForm from "../../features/addVoters/AddVoterForm";

import { addVoterState } from "../../features/addVoters/addVoterSlice";

const Modal = () => {
  const dispatch = useDispatch();
  const { electionRoute } = useSelector(electionState);
  const { voterRoute } = useSelector(addVoterState);
  const { ballotRoute } = useSelector(ballotState);

  const headerTitle = () => {
    let srting = ballotRoute;
    let stringArray = srting.split(/(?=[A-Z])/);
    let newStringArray = stringArray.map((element) => {
      return element.charAt(0).toUpperCase() + element.slice(1);
    });
    return newStringArray;
  };
  headerTitle();
  return (
    <>
      {(ballotRoute === "createBallot" ||
        ballotRoute === "editBallot" ||
        ballotRoute === "createOption" ||
        ballotRoute === "editOption") && (
        <div className="backdrop">
          <div className="modal__form">
            <SlClose
              className="modal__form__close"
              onClick={() => dispatch(setBallotRoute("home"))}
            />
            <h1>
              {headerTitle().map((element) => {
                return <span key={element}>{element + " "}</span>;
              })}
            </h1>
            <UpdateForm />
          </div>
        </div>
      )}
      {electionRoute === "Add Voters" && voterRoute === "addVoter" && (
        <div className="backdrop">
          <div className="modal__form">
            <AddVoterForm action="addVoter" />
          </div>
        </div>
      )}
      {electionRoute === "Add Voters" && voterRoute === "editVoter" && (
        <div className="backdrop">
          <div className="modal__form">
            <AddVoterForm action="editVoter" />
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
