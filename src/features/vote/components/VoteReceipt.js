import React, { useEffect, useState } from "react";

import "./vote-receipt.scss";

import { BsFillCreditCard2FrontFill } from "react-icons/bs";

import { useSelector } from "react-redux";
import { voteState } from "../voteSlice";
import { useSingleVoted2Mutation } from "../voteApiSlice";

import ConfettiExplosion from "react-confetti-explosion";

const VoteReciept = () => {
  const [singleVoted2] = useSingleVoted2Mutation();
  const { voterData } = useSelector(voteState);

  const [votedData, setVotedData] = useState();
  const [isConfetti, setIsConfetti] = useState(true);

  useEffect(() => {
    const getVotedData = async () => {
      const singleVotedData = await singleVoted2({
        voterId: voterData._id,
        voterName: voterData.name,
      }).unwrap();
      setVotedData(singleVotedData);
      setTimeout(() => {
        setIsConfetti(false);
      }, 3000);
    };
    getVotedData();
  }, []);

  let allVotedData = [];

  allVotedData.push(votedData);

  const MappedAnalytics = allVotedData?.map((datas) => {
    let arrangedArr = datas?.voteData?.map((data) => {
      return {
        ballotName: data.title,
        choosedOption: data.options?.find((option) => option?.choosen === true),
      };
    });
    const choosedOption = arrangedArr?.map((data) => {
      return (
        <div className="analytics__list2__list">
          <div>
            <b>Ballot Name:</b> <p>{data?.ballotName}</p>
          </div>
          <div>
            <b>Option Choosed:</b> <p>{data?.choosedOption?.name}</p>
          </div>
        </div>
      );
    });
    return (
      <div className="analytics__list">
        <div className="analytics__list1">
          <b>Voter Name:</b> <p>{datas?.voterName}</p>
        </div>
        <div className="analytics__list1">
          <b>Date Voted:</b> <p>{datas?.timeVoted}</p>
        </div>

        <div className="analytics__list2">{choosedOption}</div>
      </div>
    );
  });

  return (
    <>
      {!votedData && (
        <div className="vote__receipt">
          <>
            <BsFillCreditCard2FrontFill className="vote__receipt__intro__logo" />
            <b className="vote__receipt__intro">
              Your votes will be used to generate a receipt for you!!!
            </b>
          </>
        </div>
      )}
      {votedData && (
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isConfetti && (
            <ConfettiExplosion
              force={0.8}
              duration={3000}
              particleCount={250}
              width={1600}
              style={{
                position: "absolute",
              }}
            />
          )}
          <div className="analytic__cont">
            <div className="analytic__list__head">This is your receipt</div>
            <div className="analytic__list__cont">{MappedAnalytics}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoteReciept;
