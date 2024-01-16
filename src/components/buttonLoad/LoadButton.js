import React from "react";
import { Oval, ThreeDots } from "react-loader-spinner";

const LoadButton = () => {
  return (
    <button
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="button btn solid"
    >
      <Oval
        height={25}
        width={25}
        color="white"
        wrapperStyle={{ marginRight: "5px" }}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="white"
        strokeWidth={4}
        strokeWidthSecondary={4}
      />
      <div>Loading</div>
      <div>
        <ThreeDots
          height="20"
          width="20"
          radius="2"
          color="white"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ marginLeft: "5px", marginTop: "5px" }}
          wrapperClassName=""
          visible={true}
        />
      </div>
    </button>
  );
};

export default LoadButton;
