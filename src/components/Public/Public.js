import React from "react";
import Header from "./Header";
import Stack from "./Stack";
import "./public.scss";
import { stacksData } from "../../data/data";
import Navbar from "../navbar/Navbar";

// Third Party Import

export default function Home() {
  const stackedElemet = stacksData.map((item) => {
    return <Stack key={item.name} item={item} />;
  });
  return (
    <>
      <Navbar />
      <div className="HomeWrapper">
        <Header />
        {stackedElemet}
      </div>
    </>
  );
}
