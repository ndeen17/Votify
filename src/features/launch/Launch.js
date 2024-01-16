import React, { useState } from "react";
import "./launch.scss";
import startup from "../../assets/startup.png";

import { useGetTemplateQuery } from "../settings/component/email/emailApiSlice";
import {
  useElectUpdateMutation,
  useGetSingleElectionQuery,
} from "../election/electionApiSlice";
import { useSendAllMailMutation } from "../settings/component/email/emailApiSlice";
import { useGetBallotsQuery } from "../ballot/ballotApiSlice";

import { toast } from "react-toastify";

import Loader from "../../components/loader/Loader";

export default function Launch() {
  const [pending, setPending] = useState("");
  const { data: emailTemplateData } = useGetTemplateQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const { data: electionData } = useGetSingleElectionQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: ballotData } = useGetBallotsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [sendAllMail] = useSendAllMailMutation();
  const [updateElection] = useElectUpdateMutation();

  const ballotLength = ballotData?.ids?.length;
  let optionsLength = 0;
  const voterLength = electionData?.voters?.length;

  ballotData?.ids?.forEach((id) => {
    optionsLength = optionsLength + ballotData?.entities[id]?.options?.length;
  });

  const handleLaunch = async () => {
    if (ballotLength < 1) {
      return toast.warn("No ballot detected!!");
    }
    if (voterLength < 1) {
      return toast.warn("No voter detected!!");
    }
    if (optionsLength < 2) {
      return toast.warn("provide at least two options!!");
    }
    if (!emailTemplateData) {
      return toast.warn("Fill in Your Invite Template");
    }
    if (
      emailTemplateData?.inviteBody?.length < 1 ||
      emailTemplateData?.inviteFromName?.length < 1 ||
      emailTemplateData?.inviteSubject?.length < 1
    ) {
      return toast.warn("Fill in Your Invite Template");
    }
    setPending("launching");
    const statusUpdate = await updateElection({ status: "running" }).unwrap();
    setPending("");
    if (!statusUpdate) {
      return;
    }
    if (statusUpdate === "serverError") {
      toast.error("server error, try again later");
      return;
    }
    const handleSendAllMail = async (emailTo) => {
      await sendAllMail({
        emailTo,
        subject: emailTemplateData.inviteSubject,
        fromName: emailTemplateData.inviteFromName,
        body: emailTemplateData.inviteBody,
        electionId: electionData?._id,
        electionTitle: electionData?.title,
      }).unwrap();
    };
    electionData.voters.forEach((voter) => {
      handleSendAllMail(voter?.email);
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    toast.success("Your Election is Live!!!");
  };

  return (
    <div className="LaunchWrapper1">
      <img src={startup} alt="rocket" />
      {pending !== "launching" && (
        <button onClick={handleLaunch}>Launch Election!!!</button>
      )}
      {pending === "launching" && (
        <div className="launchLoader">
          <Loader
            container={{ bgColor: "red", borderRadius: "15px" }}
            oval={{ color: "white", width: 25, height: 25 }}
            threeDots={{ color: "white" }}
            text={{ color: "white", value: "Launching", fontSize: "1em" }}
          />
        </div>
      )}
    </div>
  );
}
