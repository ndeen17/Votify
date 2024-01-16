import React, { useState, useEffect } from "react";
import { FiDatabase } from "react-icons/fi";
import { MdBallot } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import {
  useGetBallotsQuery,
  useSingleBallotMutation,
  useDeleteBallotMutation,
} from "./ballotApiSlice";
import { setBallotRoute } from "../../features/ballot/ballotSlice";
import { useDispatch, useSelector } from "react-redux";
import { setBallotData } from "./ballotSlice";
import { setBallotList } from "./ballotSlice";
import "./style.css";

import { ballotState as bState } from "../../features/ballot/ballotSlice";
import { useDelBallotOptionsMutation } from "./ballotApiSlice";

import { motion } from "framer-motion";
import { setCurrentOption, setOptionImgId } from "../../stateSlice";
import { toast } from "react-toastify";

import noAvatarImg from "../../assets/noAvatar.png";

export default function Ballot() {
  const ballotState = useSelector(bState);
  const dispatch = useDispatch();

  const [singleBallot] = useSingleBallotMutation();
  const [deleteBallot] = useDeleteBallotMutation();
  const [deleteOption] = useDelBallotOptionsMutation();

  const { ballotRoute } = ballotState;

  const { data: allBallotData } = useGetBallotsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const ids = allBallotData?.ids;
  const entities = allBallotData?.entities;

  useEffect(() => {
    dispatch(setBallotList(allBallotData));
  }, [allBallotData, dispatch]);

  const getSingleBallot = async (ballotId) => {
    const fetchedBallotData = await singleBallot({ _id: ballotId }).unwrap();
    dispatch(setBallotData(fetchedBallotData));
  };

  const handleOptionDelete = async (id, ballotData, _imgId) => {
    const toastId = toast.loading("Processing...");

    const newValue = ballotData.options.filter((option) => {
      return option._id !== id;
    });
    const data = await deleteOption({
      _id: ballotData._id,
      options: newValue,
      _imgId,
    }).unwrap();
    if (data === "cantEdit") {
      toast.update(toastId, {
        type: "error",
        render: "Changes cannot be made after election has been launched",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }
    if (data === "serverError") {
      toast.update(toastId, {
        type: "error",
        render: "server error, try again later",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }
    if (data) {
      toast.update(toastId, {
        type: "success",
        render: "Successful!!",
        autoClose: 5000,
        isLoading: false,
      });
    } else {
      toast.update(toastId, {
        type: "error",
        render: "server error, try again later",
        autoClose: 5000,
        isLoading: false,
      });
    }
  };
  const handleBallotDelete = async (ballotId) => {
    const toastId = toast.loading("Processing...");
    const data = await deleteBallot({ _id: ballotId }).unwrap();
    if (data === "cantEdit") {
      toast.update(toastId, {
        type: "error",
        render: "Changes cannot be made after election has been launched",
        autoClose: 5000,
        isLoading: false,
      });
      return;
    }
    if (data === "ballotDeleted") {
      toast.update(toastId, {
        type: "success",
        render: "Successful!!",
        autoClose: 5000,
        isLoading: false,
      });
    } else {
      toast.update(toastId, {
        type: "error",
        render: "server error, try again later",
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  const mappedBallots = ids?.map((id, ballotIndex) => {
    const ballot = entities[id];
    let mappedOptions;
    if (ballot.options.length > 0) {
      const mappedOption = ballot.options.map((option, index) => {
        return (
          <motion.div
            key={option?._id}
            className="BallotContentOptions"
            whileInView={{
              opacity: [0, 1],
              transition: {
                duration: 0.5,
                delay: index * 0.8,
              },
            }}
          >
            <div className="optionTitle">
              {option?.imgUrl && <img src={option?.imgUrl} alt="pic" />}
              {!option?.imgUrl && (
                <div className="optionTitle__no_avatar">
                  <img
                    src={noAvatarImg}
                    alt="noAvatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <p>{option?.name}</p>
            </div>
            <div>
              <BsThreeDots id={option?._id} style={{ fontSize: "1.3em" }} />
              <Tooltip
                anchorId={option?._id}
                delayHide={1500}
                place="left"
                clickable
                className="ballot__option__profile__tooltip"
                style={{
                  color: "white",
                  backgroundColor: "gray",
                  zIndex: "100",
                }}
              >
                <>
                  <div
                    className="ballot__option__profile__tooltip"
                    onClick={() => {
                      getSingleBallot(ballot._id);
                      dispatch(setOptionImgId(option?._imgId));
                      dispatch(setCurrentOption(option?._id));
                      dispatch(setBallotRoute("editOption"));
                    }}
                  >
                    Edit Option
                  </div>
                  <div
                    className="ballot__option__profile__tooltip"
                    onClick={() => {
                      handleOptionDelete(option?._id, ballot, option?._imgId);
                    }}
                  >
                    Delete Option
                  </div>
                </>
              </Tooltip>
            </div>
          </motion.div>
        );
      });
      mappedOptions = mappedOption;
    }
    return (
      <motion.div
        key={ballot._id}
        className="BallotContent"
        whileInView={{
          opacity: [0, 1],
          transition: {
            duration: 0.5,
            delay: ballotIndex * 0.3,
          },
        }}
      >
        <div className="BallotContentHeader">
          <div className="BallotContentTitleWrapper">
            <div className="BallotContentTitle">{ballot?.title}</div>
            <div>
              <BsThreeDots id={ballot?._id} style={{ fontSize: "1.3em" }} />
              <Tooltip
                anchorId={ballot?._id}
                delayHide={1500}
                place="bottom"
                clickable
                className="admin__main__header__profile__tooltip"
                style={{
                  color: "#5520b7",
                  backgroundColor: "white",
                  zIndex: "100",
                }}
              >
                <>
                  <div
                    className="admin__main__header__profile__tooltip__data"
                    onClick={() => {
                      getSingleBallot(ballot?._id);
                      dispatch(setBallotRoute("editBallot"));
                    }}
                  >
                    Edit Ballot
                  </div>
                  <div
                    className="admin__main__header__profile__tooltip__data"
                    onClick={() => {
                      handleBallotDelete(ballot?._id);
                    }}
                  >
                    Delete Ballot
                  </div>
                </>
              </Tooltip>
            </div>
          </div>
          <div className="BallotContentRoute1">
            <FiDatabase />
            <p>Options</p>
          </div>
          {/* <div className="BallotContentRoute2">
            <BallotOutlined />
            <p>Details</p>
          </div> */}
        </div>
        {
          <>
            {mappedOptions}
            <button
              style={{ width: "150px", height: "40px" }}
              className="BallotContentOptionsButton"
              onClick={() => {
                getSingleBallot(ballot._id);
                dispatch(setBallotRoute("createOption"));
              }}
            >
              Add Option
            </button>
          </>
        }
      </motion.div>
    );
  });
  // Return
  return (
    <>
      {ids?.length < 1 && ballotRoute !== "createBallot" && (
        <div className="addVotersIntro">
          <div className="addVotersIntroDiv">
            <MdBallot className="addVotersIntroSpace" />
            <p className="addVotersIntroP">Add Ballot</p>
          </div>
          <p className="addVotersIntroPp">Add Ballot To The Election</p>
          <div className="addVotersIntroButton">
            <button onClick={() => dispatch(setBallotRoute("createBallot"))}>
              <MdBallot className="addVotersIntroButtonIcon" />
              Add Ballot
            </button>
          </div>
        </div>
      )}
      {ballotRoute === "home" && (
        <div className="ballotWrapper">{mappedBallots}</div>
      )}
    </>
  );
}
