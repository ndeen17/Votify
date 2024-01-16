import React, { useState } from "react";

import "./general.scss";

import { FaAddressBook } from "react-icons/fa";

import Input from "../../../../components/input/Input";

import { useUpdateElectionMutation } from "../../../election/electionApiSlice";
import LoadButton from "../../../../components/buttonLoad/LoadButton";
import { toast } from "react-toastify";

const General = () => {
  const [pending, setPending] = useState("");
  const [date, setDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const endDate = new Date(date).getTime();

  const [updateElection] = useUpdateElectionMutation();

  const handleElectionUpdate = async () => {
    if (newTitle.length < 3 || newDesc.length < 3 || !date) {
      toast.warn("Fill in the fields properly");
      return;
    }
    setPending("electLoad");
    const data = await updateElection({
      title: newTitle,
      description: newDesc,
      endDate,
    }).unwrap();
    setPending("");
    if (data === "cantEdit") {
      toast.error("Changes cannot be made after election has been launched");
      return;
    }
    if (data === "alreadyExist") {
      toast.error("This election already exist");
      return;
    }
    if (data === "updated") {
      toast.success("Successful!!");
      window.location.reload();
      return;
    } else {
      toast.error("server error, try again later");
      return;
    }
  };

  return (
    <div className="settings__general__cont">
      <div className="settings__general">
        <div className="settings__general__header">
          <FaAddressBook className="settings__general__header__logo" />
          <p className="settings__general__header__text">General</p>
        </div>
        <div className="settings__general__form">
          <div className="settings__general__form__input">
            <p>Election Title</p>
            <input type="text" onChange={(e) => setNewTitle(e.target.value)} />
          </div>
          <div className="settings__general__form__date">
            <p>End Date</p>
            <div>
              <Input
                value={date}
                type="date"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="settings__general__form__textarea">
            <p>Description</p>
            <textarea onChange={(e) => setNewDesc(e.target.value)} />
          </div>
          <div className="settings__general__form__submit">
            {pending !== "electLoad" && (
              <button onClick={handleElectionUpdate}>Save</button>
            )}
            {pending === "electLoad" && <LoadButton />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
