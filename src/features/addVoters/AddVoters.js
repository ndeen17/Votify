import React, { useState } from "react";
import "./style.css";
import { MdPeople } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

import { setVoterId } from "../../stateSlice";

import { setElectionData, electionState } from "../election/electionSlice";
import { setAddVoterRoute } from "./addVoterSlice";

import { useUpdateVoterMutation } from "./addVoterApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { addVoterState as advState } from "./addVoterSlice";

import { Tooltip } from "react-tooltip";

// COMPONENT IMPORT

export default function AddVoters() {
  const { electionData } = useSelector(electionState);

  const { voterRoute } = useSelector(advState);
  const dispatch = useDispatch();
  const [updateVoter] = useUpdateVoterMutation();

  // INPUT STATE
  const [search, setSearch] = useState("");

  // FUNCTION

  const handleDelete = async (id) => {
    const newValue = electionData?.voters?.filter((voter) => voter?._id !== id);
    const response = await updateVoter({
      voters: newValue,
    }).unwrap();
    dispatch(setElectionData(response));
    dispatch(setAddVoterRoute("home"));
  };

  // MAPPING
  const filteredVoters = electionData?.voters?.filter((voter) =>
    voter?.name.toLowerCase().includes(search.toLowerCase())
  );
  const mappedVoters = filteredVoters?.map((voter) => {
    return (
      <div className="addVotersList" key={voter._id}>
        <p>{voter.name}</p>
        <p>{voter.email}</p>
        <div>
          <BsThreeDots id={voter._id} style={{ fontSize: "1.3em" }} />
          <Tooltip
            delayHide={1500}
            anchorId={voter._id}
            place="bottom"
            clickable
            className="admin__main__header__profile__tooltip"
            style={{
              color: "white",
              backgroundColor: "grey",
              zIndex: "100",
            }}
          >
            <>
              <div
                className="admin__main__header__profile__tooltip__data"
                onClick={() => {
                  dispatch(setVoterId(voter?._id));
                  dispatch(setAddVoterRoute("editVoter"));
                }}
              >
                Edit Voter
              </div>
              <div
                className="admin__main__header__profile__tooltip__data"
                onClick={() => {
                  handleDelete(voter?._id);
                }}
              >
                Delete Voter
              </div>
            </>
          </Tooltip>
        </div>
      </div>
    );
  });

  return (
    <>
      {electionData?.voters?.length === 0 && (
        <div className="addVotersIntro">
          <div className="addVotersIntroDiv">
            <MdPeople className="addVotersIntroSpace" />
            <p className="addVotersIntroP">Add Voters</p>
          </div>
          <p className="addVotersIntroPp">Add Voter To The Option</p>
          <div className="addVotersIntroButton">
            <button onClick={() => dispatch(setAddVoterRoute("addVoter"))}>
              <MdPeople className="addVotersIntroButtonIcon" />
              Add voter
            </button>
          </div>
        </div>
      )}

      {voterRoute === "home" && electionData?.voters?.length !== 0 && (
        <div className="addVotersHome">
          <div className="addVotersSearch">
            <input
              type="search"
              placeholder="Search For Voter.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span>
              <FaSearch />
            </span>
          </div>
          <div className="addVotersListHeader">
            <b>Voter Name</b>
            <b>Voter Email</b>
            <b>Edit</b>
          </div>
          <div className="addVotersListWrapper">
            {filteredVoters?.length > 0 ? (
              mappedVoters
            ) : (
              <p className="addVotersList"> sorry no voter found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
