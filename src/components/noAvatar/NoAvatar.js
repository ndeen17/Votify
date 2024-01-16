import React from "react";

import no_avater from "../../assets/noAvatar.png";

const NoAvatar = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "var(--bg-grey-300)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={no_avater}
        alt="noAvatar"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default NoAvatar;
