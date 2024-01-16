import React from "react";
import "./input.scss";

const Input = ({ onChange, placeholder, Icon, value, type }) => {
  return (
    <div className="input__container">
      {Icon && type !== "date" && (
        <Icon
          className="input__icon"
          style={{
            padding: type !== "date" ? "1em" : "",
          }}
        />
      )}
      <input
        type={type}
        className="input__input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          paddingLeft: type === "date" ? "2em" : "0px",
        }}
      />
    </div>
  );
};

export default Input;
