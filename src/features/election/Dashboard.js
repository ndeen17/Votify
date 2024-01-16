import React, { useState, useRef } from "react";
import "./dashboard.css";

import {
  useGetElectionsQuery,
  useDeleteAllElectionMutation,
  useSingleElectionMutation,
} from "./electionApiSlice";
import { setElectionData, setElectionRoute } from "./electionSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { ThreeDots } from "react-loader-spinner";

// COMPONENT IMPORT
import SearchBar from "../../components/searchBar/SearchBar";
import Navbar from "../../components/navbar/Navbar";

import { HiDotsHorizontal } from "react-icons/hi";

import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // STATE

  const [dropDown, setDropDown] = useState("title");
  const [search, setSearch] = useState("");
  const [mountElection, setMountElection] = useState(true);
  const selectRef = useRef();

  const [singleElection] = useSingleElectionMutation();
  const [deleteAllElection] = useDeleteAllElectionMutation();
  let electionList = {};
  let entitiesList = {};
  const { data: electionData } = useGetElectionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  if (electionData === "serverError") {
    toast.error("server error, try again later");
    return;
  }
  if (electionData) {
    electionList = electionData;
  }
  const { entities } = electionList;
  if (entities) {
    entitiesList = entities;
  }

  // FUNCTIONS
  const handleElection = async (electionData) => {
    setMountElection(false);
    const fetchedElectionData = await singleElection(electionData).unwrap();
    if (fetchedElectionData === "serverError") {
      toast.error("server error, try again later");
      return;
    }
    if (!fetchedElectionData) {
      toast.error("server error, try again later");
    }
    if (fetchedElectionData) {
      toast.success("Successful!!");
    }
    dispatch(setElectionData(fetchedElectionData));
    dispatch(setElectionRoute("overview"));
    setMountElection(true);
    navigate("/dash/election");
  };
  const handleDeleteAllElection = async () => {
    const id = toast.loading("Please wait...");
    const data = await deleteAllElection().unwrap();
    if (data === "serverError") {
      setTimeout(() => {
        toast.update(id, {
          render: "Server Error, try again later",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          draggable: true,
        });
      }, 1000);
      return;
    }
    if (data) {
      setTimeout(() => {
        toast.update(id, {
          render: "Sucessfull!!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          draggable: true,
        });
      }, 1000);
      navigate("/dash");
      return;
    } else {
      setTimeout(() => {
        toast.update(id, {
          render: "Error",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          draggable: true,
        });
      }, 1000);
      return;
    }
  };

  // This code turns an object to an Array in order for us to enumerate through the object in form of an array
  const asEntitiesArray = Object.entries(entitiesList);

  const filtered = asEntitiesArray.filter(([keyId, value]) =>
    value[dropDown]?.toLowerCase()?.includes(search?.toLowerCase())
  );

  const filteredEntities = Object.fromEntries(filtered);
  // This code is use to store the ids form the filtered entities to newIds array
  let newIds = [];
  for (const keyId in filteredEntities) {
    newIds.push(keyId);
  }

  const MappedElection = newIds?.map((electionId, index) => {
    const currentELection = filteredEntities[electionId];
    const createdAt = new Date(currentELection?.createdAt).toLocaleDateString(
      "en-US"
    );
    const endDate = new Date(currentELection?.endDate).toLocaleDateString(
      "en-US"
    );
    return (
      <motion.div
        whileHover={{ scale: [1, 1.02] }}
        whileInView={{
          opacity: [0, 1],
          x: [100, 0],
          transition: {
            duration: 0.2,
            delay: index * 0.1,
          },
        }}
        className="ElectionDashboardContentElection"
        key={currentELection?.id}
        onClick={() =>
          handleElection({
            _id: currentELection?.id,
            createdBy: currentELection?.createdBy,
          })
        }
      >
        <div className="ElectionDashboardContentElectionDiv--modifier1">
          <b>{currentELection?.title}</b>
          <div>{currentELection?.status}</div>
        </div>
        <div className="ElectionDashboardContentElectionDiv--modifier2">
          <div className="ElectionDashboardContentElectionDiv--modifier2__1">
            <b>Date Created</b>
            <span>{createdAt}</span>
          </div>
          <div>
            <b>End Date</b>
            <span>{endDate}</span>
          </div>
        </div>
      </motion.div>
    );
  });

  return (
    <div className="ElectionDashboardWrapper">
      <Navbar />
      <div className="ElectionDashboardContentHeader">
        <b>These are all your elections</b>

        <div className="ElectionDashboardContentHeaderSide">
          <HiDotsHorizontal
            className="ElectionDashboardContentHeaderSideIcon"
            id="ElectionDashboardContentHeaderSideIcon"
          />
          <Tooltip
            anchorId="ElectionDashboardContentHeaderSideIcon"
            place="bottom"
            clickable
            className="admin__main__header__profile__tooltip"
            style={{
              color: "white",
              backgroundColor: "grey",
              zIndex: 10,
            }}
          >
            <>
              <div
                className="ElectionDashboardContentHeaderSideIconData"
                onClick={() => navigate("/dash/createElectionForm")}
              >
                Add New Election
              </div>
              <div
                className="ElectionDashboardContentHeaderSideIconData"
                onClick={handleDeleteAllElection}
              >
                Clear all Election
              </div>
            </>
          </Tooltip>
        </div>
      </div>
      <div className="ElectionDashboardContent">
        <div className="ElectionDashboardContentInput">
          <div className="ElectionDashboardContentInput1">
            <SearchBar
              searchState={[search, setSearch]}
              placeholder={`search by ${dropDown}`}
            />
          </div>
          <div className="ElectionDashboardContentInput2">
            <select
              ref={selectRef}
              onChange={() => setDropDown(selectRef.current.value)}
            >
              <option value="title">search by title</option>
              <option value="status">Search by status</option>
            </select>
          </div>
        </div>
        {mountElection && MappedElection}
        {!mountElection && (
          <div style={{ position: "absolute", top: "45vh", right: "45vw" }}>
            <ThreeDots
              height={100}
              width={100}
              radius={50}
              color={"var(--color-primary)"}
              ariaLabel="three-dots-loading"
              wrapperStyle={{ marginLeft: "5px", marginTop: "20px" }}
              wrapperClassName=""
              visible={true}
            />
          </div>
        )}
        <p>
          showing {newIds.length || 0} of {electionData?.ids?.length || 0}
        </p>
      </div>
    </div>
  );
}
