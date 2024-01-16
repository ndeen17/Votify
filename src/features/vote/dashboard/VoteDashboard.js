import React, { useState, useEffect } from "react";

import imgLogo from "../../../assets/logo.png";

import { useGetUploadQuery } from "../../../components/profile/profileApiSlice";
import { useSendLogoutMutation } from "../../auth/authApi";
import { voteState, setVoteRoute } from "../voteSlice";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "react-tooltip";
import { motion } from "framer-motion";

import { RxHamburgerMenu } from "react-icons/rx";
import { MdHowToVote } from "react-icons/md";
import { IoReceipt } from "react-icons/io5";

import Voting from "../components/Voting";
import Result from "../../result/Result";
import VoteReceipt from "../components/VoteReceipt";
import { useSingleVotedMutation } from "../voteApiSlice";

const VoteDashboard = () => {
  const [singleVoted] = useSingleVotedMutation();
  const { electionData, voteRoute, voterData } = useSelector(voteState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [voted, setVoted] = useState();

  useEffect(() => {
    const asyncer = async () => {
      const ifVoted = await singleVoted({
        voterId: voterData._id,
        voterName: voterData.name,
      }).unwrap();
      setVoted(ifVoted);
    };
    asyncer();
  }, []);

  const asideLinks = [
    ...(voted !== "alreadyVoted"
      ? [
          {
            name: "Vote",
            Logo: MdHowToVote,
            action: () => {
              dispatch(setVoteRoute("Vote"));
            },
          },
        ]
      : []),
    {
      name: "Receipt",
      Logo: IoReceipt,
      action: () => {
        dispatch(setVoteRoute("Receipt"));
      },
    },
    {
      name: "Live Result",
      Logo: IoReceipt,
      action: () => {
        dispatch(setVoteRoute("Live Result"));
      },
    },
  ];

  const { data: uploadData } = useGetUploadQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [logOut] = useSendLogoutMutation();
  const handleLogout = async () => {
    const response = await logOut().unwrap();
    if (response === "logged out") {
      navigate("/");
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className="admin__container">
      {/* ASIDE MOBILE */}
      <div
        className={`${
          isMobile ? "aside__mobile aside__mobile--active" : "aside__mobile"
        }`}
        onClick={() => setIsMobile(false)}
      >
        {/* <GrClose
          className="aside__mobile__close"
          onClick={() => setIsMobile(false)}
        /> */}
        <div className="admin__aside__logo">
          <img src={imgLogo} alt="logo" />
          <h2>Votify</h2>
        </div>
        <div className="admin__aside__links">
          {asideLinks.map(({ name, Logo, action }) => {
            return (
              <div
                key={name}
                className={
                  voteRoute === name
                    ? "admin__aside__link admin__aside__link__active"
                    : "admin__aside__link"
                }
                onClick={action}
              >
                <div className="admin__aside__link__logo">
                  <Logo style={{ color: "white", fontSize: "18px" }} />
                </div>
                <div className="admin__aside__link__name">{name}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* ASIDE MOBILE END */}

      {/* ASIDE MAIN */}
      <aside className="admin__aside">
        <div className="admin__aside__logo">
          <img src={imgLogo} alt="logo" />
          <h2>Votify</h2>
        </div>
        <div className="admin__aside__links">
          {asideLinks.map(({ name, Logo, action }) => {
            return (
              <div
                key={name}
                className={
                  voteRoute === name
                    ? "admin__aside__link admin__aside__link__active"
                    : "admin__aside__link"
                }
                onClick={action}
              >
                <div className="admin__aside__link__logo">
                  <Logo style={{ color: "white", fontSize: "18px" }} />
                </div>
                <div className="admin__aside__link__name">{name}</div>
              </div>
            );
          })}
        </div>
      </aside>
      {/* aside ends */}
      <main className="admin__main">
        <motion.header
          className="admin__main__header"
          whileInView={{ opacity: [0, 1] }}
          transition={{ duration: 1.5 }}
        >
          <div className="admin__main__header__section1">
            <RxHamburgerMenu
              className="admin__main__header__menu"
              onClick={() => setIsMobile(true)}
            />
            <h3 className="admin__main__header__name">
              {electionData?.title ?? "loading.."}
            </h3>
          </div>
          <div className="admin__main__header__section2">
            {/* add voter , ballot */}
            <div className="admin__main__header__section2__profile">
              <img
                className="navbar__profile"
                alt="pic"
                src={uploadData}
                id="profile-tooltip"
                style={{ display: uploadData ? "block" : "none" }}
              />
              <div
                id="profile-tooltip2"
                className="navbar__profile__admin__icon"
                style={{ display: !uploadData ? "block" : "none" }}
              ></div>
              <Tooltip
                anchorId={uploadData ? "profile-tooltip" : "profile-tooltip2"}
                place="left"
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
                    onClick={() => navigate("/dash/profile")}
                  >
                    Profile
                  </div>
                  <div
                    className="admin__main__header__profile__tooltip__data"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </>
              </Tooltip>
            </div>
          </div>
        </motion.header>
        {voteRoute === "Vote" &&
          voted !== "alreadyVoted" &&
          voted !== "serverError" && <Voting />}
        {voteRoute === "Live Result" && <Result />}
        {voteRoute === "Receipt" && <VoteReceipt />}
      </main>
      {/* main ends */}
    </div>
  );
};

export default VoteDashboard;
