import React, { useRef, useState, useEffect } from "react";
import "./email.scss";

import { FcInvite } from "react-icons/fc";
import { MdEmail } from "react-icons/md";

import { BsInfoCircle } from "react-icons/bs";

import LoadButton from "../../../../components/buttonLoad/LoadButton";

import {
  useGetTemplateQuery,
  usePostTemplateMutation,
  useSendAllMailMutation,
  useUpdateTemplateMutation,
} from "./emailApiSlice";
import { toast } from "react-toastify";

const Email = () => {
  const [pending, setPending] = useState("");
  const { data: emailTemplateData } = useGetTemplateQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [postTemplate] = usePostTemplateMutation();
  const [updateTemplate] = useUpdateTemplateMutation();

  const fromNameInvite = useRef();
  const subjectInvite = useRef();
  const bodyInvite = useRef();
  const fromNameRemind = useRef();
  const subjectRemind = useRef();
  const bodyRemind = useRef();

  const [tempData, setTempData] = useState({});
  useEffect(() => {
    setTempData(emailTemplateData);
  }, [emailTemplateData]);

  const [sendAllMail] = useSendAllMailMutation();

  const handleTemplate = async (action) => {
    if (action === "invite") {
      setPending("inviteLoad");
    }
    if (action === "remind") {
      setPending("remindLoad");
    }
    if (!emailTemplateData) {
      const data = await postTemplate({
        inviteFromName: fromNameInvite.current.value,
        inviteSubject: subjectInvite.current.value,
        inviteBody: bodyInvite.current.value,
        remindBody: bodyRemind.current.value,
        remindSubject: subjectRemind.current.value,
        remindFromName: fromNameRemind.current.value,
      }).unwrap();
      setPending("");
      if (data === "serverError") {
        toast.error("server error, try again later");
        return;
      }
      if (!data) {
        toast.error("server error, try again later");
        return;
      }
      toast.success("Successful!!");
      setTempData(data);
      return;
    }
    if (emailTemplateData) {
      const data = await updateTemplate({
        inviteFromName: fromNameInvite.current.value,
        inviteSubject: subjectInvite.current.value,
        inviteBody: bodyInvite.current.value,
        remindBody: bodyRemind.current.value,
        remindSubject: subjectRemind.current.value,
        remindFromName: fromNameRemind.current.value,
        action,
      }).unwrap();
      setPending("");
      if (data === "serverError") {
        toast.error("server error, try again later");
        return;
      }
      if (!data) {
        toast.error("server error, try again later");
        return;
      }
      toast.success("Successful!!");
      setTempData(data);
      return;
    }
  };

  return (
    <div className="settings__email__container">
      <div className="settings__email">
        <div className="settings__email__header">
          <div>
            <MdEmail className="settings__email__header__logo" />
          </div>
          <div className="settings__email__header__name">
            Voting Invite Template
          </div>
        </div>
        <div className="settings__email__info">
          <div>
            <BsInfoCircle className="settings__email__info__logo" />
          </div>
          <div className="settings__email__info__name">
            This is the email that is sent out to voters when the election
            starts.
          </div>
        </div>

        <div className="settings__email__form">
          <div className="settings__email__form__input">
            <p>From Name</p>
            <input
              className="settings__email__form__input__input"
              ref={fromNameInvite}
              placeholder={tempData?.inviteFromName}
            />
          </div>
          <div className="settings__email__form__input">
            <p>Subject</p>
            <input
              className="settings__email__form__input__input"
              ref={subjectInvite}
              placeholder={tempData?.inviteSubject}
            />
          </div>
          <div className="settings__email__form__input">
            <p>Body</p>
            <textarea
              className="settings__email__form__input__body"
              ref={bodyInvite}
              placeholder={tempData?.inviteBody}
            />
          </div>
          <div className="settings__email__form__submit">
            {pending !== "inviteLoad" && (
              <button
                onClick={() => {
                  handleTemplate("invite");
                }}
              >
                Save
              </button>
            )}
            {pending === "inviteLoad" && <LoadButton />}
          </div>
        </div>
      </div>

      <div className="settings__email">
        <div className="settings__email__header">
          <div>
            <FcInvite className="settings__email__header__logo" />
          </div>
          <div className="settings__email__header__name">
            Voting Reminder Template
          </div>
        </div>
        <div className="settings__email__info">
          <div>
            <BsInfoCircle className="settings__email__info__logo" />
          </div>
          <div className="settings__email__info__name">
            This is the email that is delivered to the voters when the election
            administrator sends out a voting reminder to voters that have not
            voted.
          </div>
        </div>

        <div className="settings__email__form">
          <div className="settings__email__form__input">
            <p>From Name</p>
            <input
              className="settings__email__form__input__input"
              ref={fromNameRemind}
              placeholder={tempData?.remindFromName}
            />
          </div>
          <div className="settings__email__form__input">
            <p>Subject</p>
            <input
              className="settings__email__form__input__input"
              ref={subjectRemind}
              placeholder={tempData?.remindSubject}
            />
          </div>
          <div className="settings__email__form__input">
            <p>Body</p>
            <textarea
              className="settings__email__form__input__body"
              placeholder={tempData?.remindBody}
              ref={bodyRemind}
            />
          </div>
          <div className="settings__email__form__submit">
            {pending !== "remindLoad" && (
              <button
                onClick={() => {
                  handleTemplate("remind");
                }}
              >
                Save
              </button>
            )}
            {pending === "remindLoad" && <LoadButton />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;
