import React, { useState } from "react";
import "./style.css";

export default function DropDown({ toggler, menuList, padding }) {
  const options = menuList;
  // STATES
  const [open, setOpen] = useState(false);
  const [CurrentLogo, setCurrentLogo] = useState(options[0].logo);
  const [currentText, setCurrentText] = toggler;
  // FUNCTIONS
  const handleOption = (text, logo) => {
    setOpen(false);
    setCurrentText(text);
    setCurrentLogo(logo);
  };
  return (
    <div className="dropdowm">
      <div
        className={open ? "select select-clicked" : "select"}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          padding: padding,
        }}
      >
        {/* <span className="selected">
          {<CurrentLogo />}
          <p>{currentText}</p>
        </span> */}
        <div className={open ? "caret caret-rotate" : "caret"}></div>
      </div>
      <ul className={open ? "menu menu-open" : "menu"}>
        {options.map((List) => {
          return (
            <div
              className="dropdown-list"
              key={List.name}
              onClick={() => handleOption(List.name, List.logo)}
            >
              {
                {
                  /* <List.logo
                  className={currentText === List.name ? "dropdown-active" : ""}
                /> */
                }
              }
              <li
                className={currentText === List.name ? "dropdown-active" : ""}
              >
                {List.name}
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
