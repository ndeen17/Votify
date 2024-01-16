import React, { useState, useEffect } from "react";
import "./result.css";
import { useGetResultsQuery } from "../result/resultApiSlice";
import { useGetBallotsQuery } from "../ballot/ballotApiSlice";
import Pusher from "pusher-js";
import NoAvatar from "../../components/noAvatar/NoAvatar";

export default function Result() {
  const [ballots, setBallots] = useState([]);
  const [results, setResults] = useState([]);

  const { data: allResultData } = useGetResultsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  console.log(allResultData);
  const { data: allBallotData } = useGetBallotsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    setResults(allResultData);
    let arr = allBallotData?.ids?.map((id) => {
      let obj = allBallotData?.entities[id];
      return obj;
    });
    setBallots(arr);
  }, [allResultData, allBallotData]);

  useEffect(() => {
    // Pusher.logToConsole = true;
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "eu",
    });

    const channel = pusher.subscribe("votify-development");
    channel.bind("my-event", function (data) {
      setResults((prevState) => {
        return [...prevState, data];
      });
    });

    return () => {
      pusher.unsubscribe("votify-development");
    };
  }, []);

  const filteredBallot = results?.filter((votedObject) => {
    return votedObject?.voteData;
  });
  const newBallot = filteredBallot?.map((votedObject) => {
    return votedObject?.voteData;
  });

  // extract all the options and insert in optionsArray
  let optionsArray = [];
  newBallot?.forEach((ballots) => {
    ballots.forEach((ballot) => {
      optionsArray.push(...ballot.options);
    });
  });

  // filter out falseful option
  const trueOptions = optionsArray.filter((option) => option.choosen === true);

  // groups all the element based on the given property
  const groupBy = (array, property) =>
    array.reduce(
      (grouped, element) => ({
        ...grouped,
        [element[property]]: [...(grouped[element[property]] || []), element],
      }),
      {}
    );
  const groupedOption = groupBy(trueOptions, "_id");
  console.log("group", groupedOption);

  const resultBallot = ballots?.map((ballot) => {
    const newOption = ballot.options?.map((option) => {
      return {
        ...option,
        count: groupedOption[option?._id]?.length || 0,
      };
    });
    return {
      ...ballot,
      options: newOption,
    };
  });
  console.log("resultBallot", resultBallot);
  return (
    <div className="result">
      {resultBallot?.map((ballot) => {
        return (
          <div className="result-ballot-wrap">
            <div className="result-ballot-header">{ballot?.title}</div>
            <div className="result-ballot-option-wrap">
              {ballot?.options?.map((option) => {
                return (
                  <div className="result-ballot-option-single">
                    <div className="result-ballot-option-id">
                      {option?.imgUrl && (
                        <img
                          style={{
                            border: "2px solid var(--bg-grey-300)",
                            objectFit: "cover",
                          }}
                          src={option?.imgUrl}
                          alt={option?.name}
                          className="result-ballot-option-id__logo"
                        />
                      )}
                      {!option?.imgUrl && (
                        <div className="result-ballot-option-id__logo">
                          <NoAvatar />
                        </div>
                      )}
                      <p style={{ fontFamily: "Acme" }}>{option?.name}</p>
                    </div>
                    <div
                      className="result-ballot-option-count"
                      style={{ fontFamily: "Acme", fontSize: "1.2em" }}
                    >
                      {option?.count}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* <div className="result-ballot-winner">the winner</div> */}
          </div>
        );
      })}
    </div>
  );
}
