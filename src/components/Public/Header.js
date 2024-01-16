import React from "react";
import voting_banner from "../../assets/voting-banner.svg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="public__header__container">
      <motion.div
        className="public__header__text"
        whileInView={{ x: [-100, 0], opacity: [0, 1] }}
        transition={{ duration: 0.5 }}
      >
        <h1>Secure, Cloud-based Elections</h1>
        <p>
          Create an election for your school or organization in seconds.
          <br></br>
          your voters can vote from any location on any device.
        </p>
        <button className="button" onClick={() => navigate("/form")}>
          Get Started
        </button>
      </motion.div>
      <motion.div
        className="public__header__img"
        whileInView={{ x: [100, 0], opacity: [0, 1] }}
        transition={{ duration: 0.5 }}
      >
        <img src={voting_banner} alt="voting.svg" />
      </motion.div>
    </div>
  );
}
