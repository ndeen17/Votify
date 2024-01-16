import React from "react";
import "./menu.scss";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../navbar/Navbar";
import { useGetUserQuery } from "../../features/user/userApiSlice";
import { useGetElectionsQuery } from "../../features/election/electionApiSlice";

import NiceCard from "../niceCard/NiceCard";
import manageElection from "../../assets/manageElection.svg";
import compSurvey from "../../assets/compSurvey.svg";
import createSurvey from "../../assets/createSurvey.svg";
import vote from "../../assets/vote.svg";

export default function Menu() {
  const niceCardData = [
    {
      banner: vote,
      title: "Manage elections",
      desc: "Create, build and deploy your elections",
      onClick: handleElection,
    },
    {
      banner: manageElection,
      title: "I want to vote",
      desc: "Vote and see live result of elections",
      onClick: handleVote,
    },
    {
      banner: createSurvey,
      title: "Create surveys",
      desc: "This feature is still under development",
      onClick: handleSurvey,
    },
    {
      banner: compSurvey,
      title: "Complete a survey",
      desc: "This feature is still under development",
      onClick: handleCompSurvey,
    },
  ];

  const { data: userData } = useGetUserQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: electionData } = useGetElectionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const navigate = useNavigate();

  function handleElection() {
    if (electionData?.ids.length === 0) {
      navigate("/dash/createElectionForm");
    } else {
      navigate("/dash/dashboard");
    }
  }
  function handleVote() {
    navigate("/dash/vote");
  }
  function handleSurvey() {
    // navigate("/dash/survey");
  }
  function handleCompSurvey() {
    // navigate("/dash/surveyForm");
  }
  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);
  return (
    <>
      <Navbar />
      <div className="menu__container">
        <motion.div className="menu__showboard">
          <motion.div
            whileInView={{ opacity: [0, 1] }}
            transition={{ duration: 1 }}
            className="menu__showboard__greeting"
          >
            <h2>Good Morning! {userData?.name}</h2>
          </motion.div>
          <motion.div
            whileInView={{ x: [-100, 0] }}
            transition={{ duration: 0.5 }}
            className="menu__showboard__date"
          >
            <h3>{today}</h3>
          </motion.div>
        </motion.div>
        <motion.div className="menu__links">
          {niceCardData.map(({ banner, title, desc, onClick }, i) => {
            return (
              <NiceCard
                banner={banner}
                title={title}
                desc={desc}
                onClick={onClick}
                key={title}
                index={i}
              />
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
