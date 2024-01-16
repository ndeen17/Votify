import React from "react";
import { BallotOutlined } from "@mui/icons-material";
import { ACTIONS } from "../../../../../action";
import { useGlobalState, useDispatch } from "../../../../../stateContex";

export default function AddVoterHeader() {
  //  STATE
  const state = useGlobalState();
  const dispatch = useDispatch();
  return (
    <div className="BallotHeader">
      <div>
        <div className="BallotHeaderMenu">
          <BallotOutlined />
          <p style={{ marginRight: "1em" }}>Voter</p>
        </div>
      </div>
      <div className="BallotHeaderMenu">
        <div>
          <BallotOutlined />
        </div>
        <button
          onClick={() =>
            dispatch({ type: ACTIONS.VOTER_ROUTE, payload: "addVoter" })
          }
        >
          Add Voters
        </button>
      </div>
    </div>
  );
}
