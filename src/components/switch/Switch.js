import React from "react";
import "./switch.css";

export default function Switch({ toggler }) {
  const [active, setActive] = toggler;
  return (
    <div
      onClick={() =>
        setActive((prevState) => {
          return !prevState;
        })
      }
      className={active ? "Switch active" : "Switch"}
      style={{
        backgroundColor: active ? "green" : null,
      }}
    >
      <i className="SwitchSlider"></i>
    </div>
  );
}
