import React, { useState } from "react";
import "./admin-panel.scss";

import { motion } from "framer-motion";
import { electionState, setElectionRoute } from "../electionSlice";

import { ballotState, setBallotRoute } from "../../ballot/ballotSlice";
import { setAddVoterRoute } from "../../addVoters/addVoterSlice";
import { useDispatch, useSelector } from "react-redux";

import AddVoterForm from "../../../features/addVoters/AddVoters";
import Overview from "../../../features/overview/Overview";
import BallotComp from "../../../features/ballot/Ballot";
import ResultComp from "../../result/Result";
import LaunchComp from "../../launch/Launch";
import PreviewComp from "../../preview/Preview";
import SettingsComp from "../../settings/Settings";

import { useGetUploadQuery } from "../../../components/profile/profileApiSlice";
import { useSendLogoutMutation } from "../../auth/authApi";
import { useDeleteElectionMutation } from "../electionApiSlice";

import { stateData, setIsMobile } from "../../../stateSlice";

import "react-tooltip/dist/react-tooltip.css";

import { Tooltip } from "react-tooltip";

import { AiFillHome } from "react-icons/ai";
import { FaAddressCard } from "react-icons/fa";
import { CgMediaLive } from "react-icons/cg";
import { IoAnalyticsSharp } from "react-icons/io5";
import { MdBallot } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdSettings } from "react-icons/io";
import { MdPreview } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoRocketSharp } from "react-icons/io5";

import imgLogo from "../../../assets/logo.png";

import { useNavigate } from "react-router-dom";
import AnalyticsComp from "../../analytics/Analytics";
import { toast } from "react-toastify";
import { Oval, ThreeDots } from "react-loader-spinner";
import { BsThreeDots } from "react-icons/bs";

const AdminPanel = () => {
  const [pending, setPending] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logOut] = useSendLogoutMutation();
  const handleLogout = async () => {
    const id = toast.loading("Loading...");
    const response = await logOut().unwrap();
    if (!response) {
      setTimeout(() => {
        toast.update(id, {
          render: "Server error, try again later",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          draggable: true,
        });
      }, 1000);
      return;
    }
    if (response === "serverError") {
      setTimeout(() => {
        toast.update(id, {
          render: "Server error, try again later",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          draggable: true,
        });
      }, 1000);
      return;
    }
    if (response === "logged out") {
      setTimeout(() => {
        toast.update(id, {
          render: "Sucessfull!!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          draggable: true,
        });
        navigate("/");
      }, 1000);
      return;
    }
  };
  const { data: uploadData } = useGetUploadQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const { electionData, electionRoute } = useSelector(electionState);
  let electionTitle = electionData?.title;
  let electionStatus = electionData?.status;

  const { ballotRoute } = useSelector(ballotState);

  const asideLinks = [
    {
      name: "overview",
      Logo: AiFillHome,
      active: "all",
      action: () => {
        dispatch(setElectionRoute("overview"));
      },
    },
    {
      name: "Settings",
      active: "all",
      Logo: IoMdSettings,
      action: () => {
        dispatch(setElectionRoute("Settings"));
      },
    },
    {
      name: "Ballots",
      Logo: MdBallot,
      active: "all",
      action: () => {
        dispatch(setElectionRoute("Ballots"));
      },
    },
    {
      name: "Add Voters",
      Logo: FaAddressCard,
      active: "all",
      action: () => {
        dispatch(setElectionRoute("Add Voters"));
      },
    },
    {
      name: "Preview",
      Logo: MdPreview,
      active: "building",
      action: () => {
        dispatch(setElectionRoute("Preview"));
      },
    },
    {
      name: "Live Results",
      Logo: CgMediaLive,
      active: "running",
      action: () => {
        dispatch(setElectionRoute("Live Results"));
      },
    },
    {
      name: "Analytics",
      Logo: IoAnalyticsSharp,
      active: "running",
      action: () => {
        dispatch(setElectionRoute("Analytics"));
      },
    },
    {
      name: "Launch",
      Logo: IoRocketSharp,
      active: "building",
      action: () => {
        dispatch(setElectionRoute("Launch"));
      },
    },
  ];

  const filteredAside = asideLinks.filter((link) => {
    if (electionData?.status === "building") {
      return link.active === "all" || link.active === "building";
    } else {
      return link.active !== "building";
    }
  });

  const { isMobile } = useSelector(stateData);

  const [deleteElection] = useDeleteElectionMutation();

  const handleElectionDelete = async () => {
    setPending("electDelete");
    const data = await deleteElection().unwrap();
    setPending("");
    if (data === "cantEdit") {
      toast.error("Changes cannot be made after election has been launched");
      return;
    }
    if (data === "deleted") {
      toast.success("Successful!!");
      navigate("/dash/dashboard");
    } else {
      toast.error("failed");
    }
  };

  return (
    <div
      className="admin__container"
      onClick={() => {
        if (isMobile) {
          dispatch(setIsMobile(false));
        }
        return;
      }}
    >
      {/* ASIDE MOBILE */}
      <div
        className={`${
          isMobile ? "aside__mobile aside__mobile--active" : "aside__mobile"
        }`}
      >
        <div className="admin__aside__logo">
          <img src={imgLogo} alt="logo" />
          <h2>Votify</h2>
        </div>
        <div className="admin__aside__links">
          {filteredAside.map(({ name, Logo, action }) => {
            return (
              <div
                key={name}
                className={
                  electionRoute === name
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
        {pending !== "electDelete" && (
          <div
            style={{ position: "absolute", bottom: "10px" }}
            className="admin__aside__delete"
          >
            <button onClick={handleElectionDelete}>
              <MdDelete
                style={{
                  color: "white",
                  fontSize: "1.5em",
                  marginRight: "5px",
                  marginBottom: "5px",
                }}
              />
              Delete Election
            </button>
          </div>
        )}
        {pending === "electDelete" && (
          <button
            style={{
              position: "absolute",
              bottom: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "red",
            }}
            className="admin__aside__delete"
          >
            <Oval
              height={25}
              width={25}
              color="white"
              wrapperStyle={{ marginRight: "5px" }}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="white"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
            <div>Loading</div>
            <div>
              <ThreeDots
                height="20"
                width="20"
                radius="2"
                color="white"
                ariaLabel="three-dots-loading"
                wrapperStyle={{ marginLeft: "5px", marginTop: "5px" }}
                wrapperClassName=""
                visible={true}
              />
            </div>
          </button>
        )}
      </div>
      {/* ASIDE MOBILE END */}

      {/* ASIDE MOBILE */}
      <aside className="admin__aside">
        <div className="admin__aside__logo">
          <img src={imgLogo} alt="logo" />
          <h2>Votify</h2>
        </div>
        <div className="admin__aside__links">
          {filteredAside.map(({ name, Logo, action }) => {
            return (
              <div
                key={name}
                className={
                  electionRoute === name
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
        <div
          style={{ position: "absolute", bottom: "10px" }}
          className="admin__aside__delete"
        >
          {pending !== "electDelete" && (
            <div
              style={{ position: "absolute", bottom: "10px" }}
              className="admin__aside__delete"
            >
              <button onClick={handleElectionDelete}>
                <MdDelete
                  style={{
                    color: "white",
                    fontSize: "1.5em",
                    marginRight: "5px",
                    marginBottom: "5px",
                  }}
                />
                Delete Election
              </button>
            </div>
          )}
          {pending === "electDelete" && (
            <button
              style={{
                position: "absolute",
                bottom: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "red",
              }}
              className="admin__aside__delete"
            >
              <Oval
                height={25}
                width={25}
                color="white"
                wrapperStyle={{ marginRight: "5px" }}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="white"
                strokeWidth={4}
                strokeWidthSecondary={4}
              />
              <div>Loading</div>
              <div>
                <ThreeDots
                  height="20"
                  width="20"
                  radius="2"
                  color="white"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{ marginLeft: "5px", marginTop: "5px" }}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            </button>
          )}
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
              onClick={() => dispatch(setIsMobile(true))}
            />
            <h3
              className="admin__main__header__name"
              style={{ textTransform: "uppercase" }}
            >
              {electionTitle ?? "loading.."}
            </h3>
            <div className="admin__main__header__status">{electionStatus}</div>
          </div>
          <div className="admin__main__header__section2">
            <BsThreeDots id="headerMenu" />
            <Tooltip
              delayHide={1500}
              anchorId="headerMenu"
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
                {ballotRoute === "home" && electionRoute === "Ballots" && (
                  <div
                    className="admin__main__header__profile__tooltip__data"
                    onClick={() => dispatch(setBallotRoute("createBallot"))}
                  >
                    Add Ballot
                  </div>
                )}
                {electionRoute === "Add Voters" && (
                  <div
                    className="admin__main__header__profile__tooltip__data"
                    onClick={() => dispatch(setAddVoterRoute("addVoter"))}
                  >
                    Add Voters
                  </div>
                )}
              </>
            </Tooltip>
            <div className="admin__main__header__section2__profile">
              <img
                className="navbar__profile"
                alt="pic"
                src={uploadData}
                id="profile-tooltip"
                style={{
                  display: uploadData ? "block" : "none",
                  objectFit: "cover",
                }}
              />
              <div
                id="profile-tooltip2"
                className="navbar__profile__admin__icon"
                style={{ display: !uploadData ? "block" : "none" }}
              ></div>
              <Tooltip
                delayHide={1500}
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
        {electionRoute === "overview" && <Overview />}
        {electionRoute === "Ballots" && <BallotComp />}
        {electionRoute === "Add Voters" && <AddVoterForm />}
        {electionRoute === "Live Results" && <ResultComp />}
        {electionRoute === "Analytics" && <AnalyticsComp />}
        {electionRoute === "Launch" && <LaunchComp />}
        {electionRoute === "Preview" && <PreviewComp />}
        {electionRoute === "Settings" && <SettingsComp />}
      </main>
      {/* inspiration from ====> https://demos.creative-tim.com/soft-ui-dashboard/pages/dashboard.html */}
      {/* main ends */}
    </div>
  );
};

export default AdminPanel;
