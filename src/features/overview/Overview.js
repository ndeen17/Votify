import React, { useEffect, useState } from "react";
import "./overview.scss";
import welcomeBanner from "../../assets/welcomeBanner.svg";

import { useGetUserQuery } from "../user/userApiSlice";
import { useGetBallotsQuery } from "../ballot/ballotApiSlice";
import { useGetSingleElectionQuery } from "../election/electionApiSlice";
import { useGetResultsQuery } from "../result/resultApiSlice";
import { useGetTemplateQuery } from "../settings/component/email/emailApiSlice";
import { useSendAllMailMutation } from "../settings/component/email/emailApiSlice";

import { MdWhereToVote } from "react-icons/md";
import { FaDatabase } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdBallot } from "react-icons/md";
import { HiClipboardDocument } from "react-icons/hi2";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Confetti from "react-confetti";

import CountdownTimer from "../../components/countDown/countDown";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function Launch() {
  const [confetti, setConfetti] = useState(false);
  const { data: electionResult } = useGetResultsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: ballotData } = useGetBallotsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: userData } = useGetUserQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: singleElectionData } = useGetSingleElectionQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [copied, setCopied] = useState("");

  useEffect(() => {
    const endElection = async () => {
      const nowResponse = await fetch(
        `${process.env.REACT_APP_DOMAIN}/election/single/get`,
        {
          credentials: "include",
        }
      );
      const nowElectionData = await nowResponse.json();
      const timestampDayjs = dayjs(nowElectionData?.endDate);
      const nowDayjs = dayjs();

      if (
        nowElectionData?.status !== "completed" &&
        nowElectionData?.endDate &&
        timestampDayjs.isBefore(nowDayjs)
      ) {
        await fetch(`${process.env.REACT_APP_DOMAIN}/elect/update`, {
          method: "PATCH",
          credentials: "include",
          headers: { "content-Type": "application/json" },
          body: JSON.stringify({
            status: "completed",
          }),
        }).then(() => {
          setConfetti(true);
          setTimeout(() => {
            window.location.reload();
          }, 10000);
          toast.success("This election has ended!!");
        });
      }
    };
    endElection();
  }, []);

  const ballotEntities = ballotData?.entities;
  const ballotId = ballotData?.ids;

  const ballotLength = ballotData?.ids?.length;
  let optionsLength = 0;
  let voterLength = singleElectionData?.voters?.length;

  let voted = `${
    typeof electionResult === "object" ? electionResult?.length : 0
  } / ${voterLength ?? 0}`;
  ballotId?.forEach((id) => {
    optionsLength = optionsLength + ballotEntities[id]?.options?.length;
  });

  const cardsData = [
    {
      count: ballotLength ?? 0,
      name: "Ballots",
      Logo: MdBallot,
    },
    {
      count: optionsLength ?? 0,
      name: "Options",
      Logo: FaDatabase,
    },
    {
      count: voterLength ?? 0,
      name: "Voters",
      Logo: BsFillPeopleFill,
    },
    {
      count: voted ?? 0,
      name: "Voted",
      Logo: MdWhereToVote,
    },
  ];

  const [sendAllMail] = useSendAllMailMutation();

  const { data: emailTemplateData } = useGetTemplateQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const handleSendAllMail = async (emailTo) => {
    return await sendAllMail({
      emailTo,
      subject: emailTemplateData.remindSubject,
      fromName: emailTemplateData.remindFromName,
      body: emailTemplateData.remindBody,
      electionId: singleElectionData?._id,
      electionTitle: singleElectionData?.title,
    }).unwrap();
  };

  const remindVoters = () => {
    if (singleElectionData?.status === "running") {
      let toastId = toast.loading("Processing...");
      Promise.all(
        singleElectionData?.voters.map((voter) => {
          return handleSendAllMail(voter?.email);
        })
      ).then((data) => {
        if (data[0] === "sent") {
          setTimeout(() => {
            toast.update(toastId, {
              render: "Successful!!!",
              type: "success",
              isLoading: false,
              autoClose: 5000,
            });
          }, 1000);
        } else {
          setTimeout(() => {
            toast.update(toastId, {
              render: "Something went wrong, try again later",
              type: "error",
              isLoading: false,
              autoClose: 5000,
            });
          }, 1000);
        }
      });
    } else {
      toast.warn("This election is not running");
      return;
    }
  };

  const changeElectionState = async (state, message) => {
    await fetch(`${process.env.REACT_APP_DOMAIN}/elect/update`, {
      method: "PATCH",
      credentials: "include",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        status: state,
        ...(state === "completed" && { endDate: 1680134400000 }),
      }),
    }).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      toast.info(`This election has been ${message}!!`);
    });
  };

  return (
    <>
      {confetti && <Confetti />}
      <section className="admin__main__section2">
        <div className="admin__main__section2__card1">
          <div className="admin__main__section2__card1__info">
            <h3 style={{ fontSize: "1.5rem", fontFamily: "Acme" }}>
              Welcome {userData?.name}!
            </h3>
            <p style={{ fontSize: "1.2rem" }}>We are glad to see you back!!</p>
          </div>
          <img
            src={welcomeBanner}
            alt="welccomeBanner"
            className="admin__main__section2__card1__logo"
          />
        </div>
        <div className="admin__main__section2__card2">
          <h1 style={{ fontFamily: "Acme", textTransform: "uppercase" }}>
            Election ends in
          </h1>
          <CountdownTimer countdownTimestampMs={singleElectionData?.endDate} />
        </div>
      </section>

      <section className="admin__main__section1">
        {cardsData.map(({ name, count, Logo }) => {
          return (
            <div key={name} className="admin__main__section1__card">
              <div className="admin__main__section1__card__info">
                <p>{name}</p>
                <p style={{ color: "grey" }}>{count}</p>
              </div>
              <div className="admin__main__section1__card__logo">
                <Logo style={{ fontSize: "1.5em", color: "white" }} />
              </div>
            </div>
          );
        })}
      </section>
      <section className="admin__main__section3">
        <div className="admin__main__section3__utilities"></div>
        <div className="admin__main__section3__copy">
          <div className="admin__main__section3__copy1">
            <b
              style={{
                fontSize: "1.5rem",
                fontFamily: "Acme",
                marginRight: "0.2rem",
              }}
            >
              Copy Election's Name
            </b>
            <CopyToClipboard
              text={singleElectionData?.title}
              onCopy={() => {
                setCopied("electName");
                setTimeout(() => {
                  setCopied("");
                }, 1500);
              }}
            >
              <HiClipboardDocument
                style={{
                  fontSize: "2rem",
                  fontFamily: "Acme",
                  cursor: "pointer",
                  color: copied === "electName" ? "green" : "",
                }}
              />
            </CopyToClipboard>
          </div>
          <div className="admin__main__section3__copy2">
            <b
              style={{
                fontSize: "1.5rem",
                fontFamily: "Acme",
                marginRight: "0.2rem",
              }}
            >
              Copy Election's Id
            </b>
            <CopyToClipboard
              text={singleElectionData?._id}
              onCopy={() => {
                setCopied("electId");
                setTimeout(() => {
                  setCopied("");
                }, 1000);
              }}
            >
              <HiClipboardDocument
                style={{
                  fontSize: "2rem",
                  fontFamily: "Acme",
                  cursor: "pointer",
                  color: copied === "electId" ? "green" : "",
                }}
              />
            </CopyToClipboard>
          </div>
        </div>
      </section>
      <section className="admin__main__section4">
        <button onClick={remindVoters}>Remind Voters</button>
        {singleElectionData?.status === "running" && (
          <button
            style={{ backgroundColor: "red" }}
            onClick={() => changeElectionState("paused", "paused")}
          >
            Pause Election
          </button>
        )}
        {singleElectionData?.status === "running" && (
          <button
            style={{ backgroundColor: "red" }}
            onClick={() => changeElectionState("completed", "stopped")}
          >
            End Election
          </button>
        )}
        {singleElectionData?.status === "paused" && (
          <button
            style={{ backgroundColor: "green" }}
            onClick={() => changeElectionState("running", "started")}
          >
            Start Election
          </button>
        )}
      </section>
    </>
  );
}
