import React from "react";
import "./niceCard.css";

import { motion } from "framer-motion";

const niceCard = ({ banner, title, desc, onClick, index }) => {
  return (
    <motion.li
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.2, delay: index * 0.2 }}
    >
      <div href="" className="card">
        <img src={banner} className="card__image" alt="" />
        <div className="card__overlay">
          <div className="card__header">
            <div className="card__header-text">
              <h3 className="card__title">{title}</h3>
            </div>
          </div>
          <p className="card__description">{desc}</p>
          <button className="card__button" onClick={onClick}>
            Proceed
          </button>
        </div>
      </div>
    </motion.li>
  );
};

export default niceCard;
