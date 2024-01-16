import React from "react";

import "./analytics.scss";

import { useGetVotedQuery } from "./analyticsApiSlice";

const Analytics = () => {
  const { data: allVotedData } = useGetVotedQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const MappedAnalytics = allVotedData?.map(
    ({ timeVoted, voteData, voterName }) => {
      let arrangedArr = voteData.map((data) => {
        return {
          ballotName: data.title,
          choosedOption: data.options?.find(
            (option) => option?.choosen === true
          ),
        };
      });
      const choosedOption = arrangedArr.map((data) => {
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
            <b>Voter Name:</b> <p>{voterName}</p>
          </div>
          <div className="analytics__list1">
            <b>Date Voted:</b> <p>{timeVoted}</p>
          </div>

          <div className="analytics__list2">{choosedOption}</div>
        </div>
      );
    }
  );

  return (
    <div className="analytic__cont">
      <div className="analytic__list__head">Voters Analytics</div>
      <div className="analytic__list__cont">{MappedAnalytics}</div>
    </div>
  );
};

export default Analytics;
