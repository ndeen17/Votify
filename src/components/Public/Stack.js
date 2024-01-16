import React from "react";
import { motion } from "framer-motion";

export default function Stack({ item }) {
  return (
    <motion.div
      className="public_stack_container"
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="public_stack_text">
        <h3>{item.name}</h3>
        <p className="HomeStackName">{item.data}</p>
      </div>
      <div className="public_stack_img">
        <img alt={item.name} src={item.img} className="HomeStackImg" />
      </div>
    </motion.div>
  );
}
