import React, { useState, useEffect } from "react";

import { TiTick } from "react-icons/ti";

import { useGetBallotsQuery } from "../../ballot/ballotApiSlice";
import { voteState } from "../voteSlice";
import { useSelector } from "react-redux";
import { useVotedMutation, useSingleVotedMutation } from "../voteApiSlice";
import { toast } from "react-toastify";
import NoAvatar from "../../../components/noAvatar/NoAvatar";
import { useDispatch } from "react-redux";

export default function Voting() {
  const dispatch = useDispatch();
  const { voterData, electionData, setVoteRoute } = useSelector(voteState);

  const [createVoted] = useVotedMutation();
  const [singleVoted] = useSingleVotedMutation();

  const [ballots, setBallots] = useState([]);

  const { data: allBallotData } = useGetBallotsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    let arr = allBallotData?.ids?.map((id) => {
      let obj = allBallotData?.entities[id];
      return obj;
    });
    setBallots(arr);
  }, [allBallotData]);

  const choosen = (optionId, ballotId) => {
    const newArray = ballots?.map((ballot) => {
      if (ballot._id === ballotId) {
        const newOptions = ballot.options.map((option) => {
          if (option._id !== optionId) {
            return {
              ...option,
              choosen: false,
            };
          } else {
            return option;
          }
        });
        return {
          ...ballot,
          options: newOptions,
        };
      } else {
        return ballot;
      }
    });
    const newBallots = newArray.map((ballot) => {
      if (ballot._id === ballotId) {
        const newOptions = ballot.options.map((option) => {
          if (option._id === optionId) {
            return {
              ...option,
              choosen: true,
            };
          } else {
            return option;
          }
        });
        return {
          ...ballot,
          options: newOptions,
        };
      } else {
        return ballot;
      }
    });
    setBallots(newBallots);
  };

  const handleVote = async () => {
    if (electionData?.status !== "running") {
      toast.warn("This election is not active");
      return;
    }
    const toastId = toast.loading("Processing");
    const ifVoted = await singleVoted({}).unwrap();
    if (ifVoted === "serverError") {
      toast.update(toastId, {
        render: "Server Error, try again later",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }
    if (ifVoted === "alreadyVoted") {
      toast.update(toastId, {
        render: "already voted",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }
    if (ifVoted === "vote") {
      const votedDetails = await createVoted({
        voterId: voterData._id,
        voterName: voterData.name,
        timeVoted: Date.now(),
        voteData: ballots,
      }).unwrap();
      if (votedDetails === "serverError") {
        toast.update(toastId, {
          render: "Server Error, try again later",
          type: "error",
          autoClose: 5000,
          isLoading: false,
        });
        return;
      }
      if (votedDetails === "votedError") {
        toast.update(toastId, {
          render: "Failed, try again later",
          type: "error",
          autoClose: 5000,
          isLoading: false,
        });
        return;
      }
      if (votedDetails === "electionEnded") {
        toast.update(toastId, {
          render: "This election has ended",
          type: "error",
          autoClose: 5000,
          isLoading: false,
        });
        dispatch(setVoteRoute("Live Result"));
        return;
      }
      if (votedDetails) {
        toast.update(toastId, {
          render: "Successful!!",
          type: "success",
          autoClose: 5000,
          isLoading: false,
        });
        dispatch(setVoteRoute("Receipt"));
        return;
      } else {
        toast.update(toastId, {
          render: "Failed, try again later",
          type: "error",
          autoClose: 5000,
          isLoading: false,
        });
        return;
      }
    }
    if (ifVoted === "alreadyVoted") {
      toast.update(toastId, {
        render: "Failed, it seems you have already voted",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    } else {
      toast.update(toastId, {
        render: "Failed, try again later",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }
  };

  return (
    <>
      <div className="voting">
        {ballots?.map((ballot) => {
          return (
            <>
              <div className="ballot-header">{ballot?.title}</div>
              <div key={ballot?._id} className="ballot-wrap">
                <div className="voting-inst">
                  <b>Instruction</b>
                  <p>You can only select one option from the list below.</p>
                </div>
                <div className="option-wrap">
                  {ballot?.options?.map((option) => {
                    return (
                      <div
                        key={option?._id}
                        className="option-single"
                        onClick={() => choosen(option?._id, ballot?._id)}
                        style={{
                          boxShadow: option.choosen ? "1px 1px 10px green" : "",
                        }}
                      >
                        <div className="option-single-section1">
                          {option?.imgUrl && (
                            <img
                              style={{
                                border: "2px solid var(--bg-grey-300)",
                                objectFit: "cover",
                              }}
                              src={option?.imgUrl}
                              alt={option?.name}
                              className="option-single-section1-logo"
                            ></img>
                          )}
                          {!option?.imgUrl && (
                            <div className="option-single-section1-logo">
                              <NoAvatar />
                            </div>
                          )}
                          {option?.name}
                        </div>
                        <div
                          className="option-single-section2"
                          style={{
                            backgroundColor: option.choosen ? "green" : "",
                            boxShadow: option.choosen
                              ? "1px 1px 10px green"
                              : "",
                          }}
                        >
                          {option.choosen && (
                            <TiTick className="option-single-section2-tick" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          );
        })}
        <div className="voting-button">
          <button onClick={handleVote}>Submit Your Vote</button>
        </div>
      </div>
    </>
  );
}
