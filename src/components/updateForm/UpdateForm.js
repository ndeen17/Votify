import React, { useState } from "react";
import "./style.scss";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { setBallotRoute } from "../../features/ballot/ballotSlice";
import { ballotState as bState } from "../../features/ballot/ballotSlice";
import { stateData, setImgUrl } from "../../stateSlice";

import {
  useAddNewBallotMutation,
  useUpdateBallotMutation,
  useUpdateBallotOptionsMutation,
  useAddBallotOptionsMutation,
} from "../../features/ballot/ballotApiSlice";

import Upload from "../../components/upload/Upload";
import { toast } from "react-toastify";

export default function General() {
  const { currentOption, imgUrl, optionImgId } = useSelector(stateData);
  const { ballotData, ballotRoute } = useSelector(bState);

  const [addBallot] = useAddNewBallotMutation();
  const [updateBallot] = useUpdateBallotMutation();
  const [updateBallotOptions] = useUpdateBallotOptionsMutation();
  const [addBallotOptions] = useAddBallotOptionsMutation();

  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [textarea, setTextArea] = useState("");
  const [imgLink, setImgLink] = useState("");

  // FUNCTIONS
  const randomId = () => {
    return nanoid() + Date.now().toString();
  };

  const handleOptionCreate = async () => {
    if (title.length < 3 || textarea.length < 3) {
      toast.warn("Fill in the fields properly");
      return;
    }
    const optionId = randomId();
    const toastId = toast.loading("Processing");
    const newValue = [
      ...ballotData.options,
      {
        name: title,
        description: textarea,
        choosen: false,
        count: 0,
        _id: optionId,
        imgUrl: imgLink,
      },
    ];

    const data = await addBallotOptions({
      _id: ballotData._id,
      imgUrl,
      optionId,
      options: newValue,
    }).unwrap();
    dispatch(setImgUrl({ path: null }));
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
      dispatch(setBallotRoute("home"));
    } else {
      toast.update(toastId, {
        type: "error",
        render: "server error, try again later",
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  const handleOptionEdit = async () => {
    const toastId = toast.loading("Processing...");
    const newValue = ballotData.options.map((option) => {
      if (option?._id === currentOption) {
        return {
          ...option,
          ...(title !== "" && { name: title }),
          ...(textarea !== "" && { description: textarea }),
          ...(imgLink !== "" && { imgUrl: imgLink }),
        };
      } else {
        return option;
      }
    });
    const data = await updateBallotOptions({
      _id: ballotData._id,
      options: newValue,
      imgUrl,
      _imgId: optionImgId,
      optionId: currentOption,
    }).unwrap();
    dispatch(setImgUrl({ path: null }));
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
      dispatch(setBallotRoute("home"));
    } else {
      toast.update(toastId, {
        type: "error",
        render: "server error, try again later",
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  const handleBallotCreate = async () => {
    const toastId = toast.loading("Processing...");
    const data = await addBallot({
      title: title,
      description: textarea,
      options: [],
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
    if (data === "cantCreateTwoBallotsWithDesameTitle") {
      toast.update(toastId, {
        type: "error",
        render: "This ballot already exist",
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
    if (data === "checkCredentials") {
      toast.update(toastId, {
        type: "error",
        render: "fill in the fields correctly",
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
      dispatch(setBallotRoute("home"));
    } else {
      toast.update(toastId, {
        type: "error",
        render: "server error, try again later",
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  const handleBallotEdit = async () => {
    const toastId = toast.loading("Processing...");
    const data = await updateBallot({
      title: title,
      description: textarea,
      options: [],
      _id: ballotData._id,
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
    if (data === "cantCreateTwoBallotsWithDesameTitle") {
      toast.update(toastId, {
        type: "error",
        render: "This ballot already exist",
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
    if (data === "checkCredentials") {
      toast.update(toastId, {
        type: "error",
        render: "fill in the fields correctly",
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
      dispatch(setBallotRoute("home"));
    } else {
      toast.update(toastId, {
        type: "error",
        render: "Server error, try again later",
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  const handleBallot = () => {
    if (ballotRoute === "createBallot") {
      handleBallotCreate();
    }
    if (ballotRoute === "createOption") {
      handleOptionCreate();
    }
    if (ballotRoute === "editOption") {
      handleOptionEdit();
    }
    if (ballotRoute === "editBallot") {
      handleBallotEdit();
    }
  };

  return (
    <div className="modal__form__input">
      {/* <p className="">Title</p> */}
      <input
        id="Esgtc"
        placeholder="title"
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* <p>Textarea</p> */}
      {(ballotRoute === "createOption" || ballotRoute === "editOption") && (
        <div className="modal__form__img">
          <input
            placeholder="Image url"
            onChange={(e) => setImgLink(e.target.value)}
          />
          {imgLink === "" && <h3>OR</h3>}
          {imgLink === "" && <Upload />}
        </div>
      )}
      <textarea
        id="Esgcd"
        placeholder="description"
        onChange={(e) => setTextArea(e.target.value)}
      />
      <button onClick={handleBallot}>Save</button>
    </div>
  );
}
