import { useState, useEffect } from "react";
import "./countDown.scss";
import { getRemainingTimeUntilMsTimestamp } from "./countDownUtil";

const defaultRemainingTime = {
  seconds: "00",
  minutes: "00",
  hours: "00",
  days: "00",
};

const CountdownTimer = ({ countdownTimestampMs }) => {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime(countdownTimestampMs);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdownTimestampMs]);

  function updateRemainingTime(countdown) {
    setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
  }

  return (
    <div className="countdown-timer">
      <div className="countdown-timer_1">
        <b className="countdown-timer_1_1">{remainingTime.days}</b>
        <p>days</p>
      </div>
      <div className="countdown-timer_2">
        <div></div>
        <div></div>
      </div>
      <div className="countdown-timer_1">
        <b className="countdown-timer_1_1">{remainingTime.hours}</b>
        <p>hours</p>
      </div>
      <div className="countdown-timer_2">
        <div></div>
        <div></div>
      </div>
      <div className="countdown-timer_1">
        <b className="countdown-timer_1_1">{remainingTime.minutes}</b>
        <p>minutes</p>
      </div>
      <div className="countdown-timer_2">
        <div></div>
        <div></div>
      </div>
      <div className="countdown-timer_1">
        <b className="countdown-timer_1_1">{remainingTime.seconds}</b>
        <p>seconds</p>
      </div>
    </div>
  );
};

export default CountdownTimer;
