import React from "react";
import "./formButton.css";

export default function formButton({ name }) {
  return <button className="clickable FormBtn">{name}</button>;
}
