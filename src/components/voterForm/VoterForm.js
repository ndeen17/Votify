import React, { useState } from "react";
import "./style.css";
import { BallotOutlined } from "@mui/icons-material";
import { nanoid } from "nanoid";

import EditOption from "../editOption/EditOption";

export default function VoterForm() {
  const [editState, setEditState] = useState(false);
  const [editAction, setEditAction] = useState("");
  // INPUT STATE
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [voterKey, setVoterKey] = useState("");

  // FUNCTION
  const handleEdit = (id) => {
    if (editAction === id && editState) {
      setEditState((prev) => !prev);
    }
    if (editAction === id && !editState) {
      setEditState((prev) => !prev);
      setEditAction(id);
    }
    if (editAction !== id && editState) {
      setEditAction(id);
    }
    if (editAction !== id && !editState) {
      setEditState((prev) => !prev);
      setEditAction(id);
    }
  };
  const randomId = () => {
    return nanoid() + Date.now().toString();
  };
  const handleAdd = async () => {
    const value = [
      ...state.currentElectionData.voters,
      {
        name: name,
        email: email,
        voterKey: voterKey,
        _id: randomId(),
      },
    ];
  };
  const handleUpdate = () => {
    const updatedVoters = state.currentElectionData.voters.map((voter) => {
      if (voter._id === editAction) {
        return {
          ...voter,
          name: name,
          email: email,
          voterKey: voterKey,
        };
      }
    });
    fetch(`${process.env.REACT_APP_DOMAIN}/election/voter/update`, {
      method: "put",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        createdBy: state.userData._id,
        _id: state.currentElectionData._id,
        voters: updatedVoters,
      }),
    })
      .then((r) => r.json())
      .then((newVoters) => {
        dispatch({ type: ACTIONS.CURRENT_ELECTION, payload: newVoters });
        dispatch({ type: ACTIONS.VOTER_ROUTE, payload: "home" });
      });
  };
  const handleDelete = () => {
    const newValue = state.currentElectionData.voters.filter(
      (voter) => voter._id !== editAction
    );
    fetch(`${process.env.REACT_APP_DOMAIN}/election/voter/update`, {
      method: "put",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        createdBy: state.userData._id,
        _id: state.currentElectionData._id,
        voters: newValue,
      }),
    })
      .then((r) => r.json())
      .then((newVoters) => {
        dispatch({ type: ACTIONS.CURRENT_ELECTION, payload: newVoters });
        dispatch({ type: ACTIONS.VOTER_ROUTE, payload: "home" });
      });
  };
  // MAPPING
  const filteredVoters = state.currentElectionData.voters.filter((voter) =>
    voter.name.toLowerCase().includes(search.toLowerCase())
  );
  const mappedVoters = filteredVoters.map((voter) => {
    return (
      <div className="addVotersList" key={voter._id}>
        <p>{voter.name}</p>
        <div className="EditMenu">
          <BallotOutlined onClick={() => handleEdit(voter._id)} />
          {editState && editAction === voter._id && (
            <EditOption
              editList={[
                {
                  name: "edit",
                  action: "editVoter",
                },
                {
                  name: "delete",
                  action: "deleteVoter",
                },
              ]}
              setEditState={setEditState}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
    );
  });

  return (
    <>
      {false && (
        <div className="addVotersIntro">
          <div className="addVotersIntroDiv">
            <BallotOutlined className="addVotersIntroSpace" />
            <p>Add Voters</p>
          </div>
          <p>Add Voters to an option</p>
          <button className="addVotersIntroDiv">
            <BallotOutlined className="addVotersIntroSpace" /> Add voter
          </button>
        </div>
      )}
      {state.voterRoute === "home" && (
        <div className="addVotersHome">
          <div className="addVotersSearch">
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span>
              <BallotOutlined />
            </span>
          </div>
          <div className="addVotersListWrapper">
            <div className="addVotersListHeader">
              <b>Voters...</b>
            </div>
            {filteredVoters.length > 0 ? (
              mappedVoters
            ) : (
              <p className="addVotersList"> sorry no voter found</p>
            )}
          </div>
        </div>
      )}
      {state.voterRoute === "addVoter" && (
        <div className="addVoter">
          <div className="EditFormTitle">
            <p>Add Voter</p>
            <BallotOutlined
              onClick={() =>
                dispatch({ type: ACTIONS.VOTER_ROUTE, payload: "home" })
              }
            />
          </div>
          <div className="addVoterContent">
            <div className="addVoterContentInput">
              <p>Name</p>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="addVoterContentInput">
              <p>Voter Key</p>
              <input
                value={voterKey}
                onChange={(e) => setVoterKey(e.target.value)}
              />
            </div>
            <div className="addVoterContentInput">
              <p>Email</p>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div
              style={{ marginTop: "1em" }}
              className="ElectionSettingsGeneralContentButtonWrapper"
            >
              <button className="Clickable" onClick={handleAdd}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {state.voterRoute === "editVoter" && (
        <div className="addVoter">
          <div className="EditFormTitle">
            <p>edit Voter</p>
            <BallotOutlined
              onClick={() =>
                dispatch({ type: ACTIONS.VOTER_ROUTE, payload: "home" })
              }
            />
          </div>
          <div className="addVoterContent">
            <div className="addVoterContentInput">
              <p>Name</p>
              <input />
            </div>
            <div className="addVoterContentInput">
              <p>Voter Key</p>
              <input
                value={voterKey}
                onChange={(e) => setVoterKey(e.target.value)}
              />
            </div>
            <div className="addVoterContentInput">
              <p>Email</p>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div
              style={{ marginTop: "1em" }}
              className="ElectionSettingsGeneralContentButtonWrapper"
            >
              <button className="Clickable" onClick={handleUpdate}>
                Save
              </button>
              <button className="Clickable" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
