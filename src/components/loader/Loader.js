import React from "react";
import { Oval, ThreeDots } from "react-loader-spinner";

const Loader = ({ container, oval, threeDots, text }) => {
  return (
    <div
      style={{
        width: container?.width ?? "100%",
        height: container?.height ?? "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: container?.bgColor ?? "white",
        borderRadius: container.borderRadius ?? "",
      }}
    >
      <Oval
        height={oval?.height ?? 45}
        width={oval?.width ?? 45}
        color={oval?.color ?? "var(--color-primary)"}
        wrapperStyle={{ marginRight: "5px" }}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor={oval?.color ?? "var(--color-primary)"}
        strokeWidth={4}
        strokeWidthSecondary={4}
      />
      <div
        style={{
          fontSize: `${text?.fontSize ?? "2em"}`,
          fontFamily: "Acme",
          color: `${text?.color ?? "var(--color-primary)"}`,
          marginTop: "10px",
        }}
      >
        {text?.value ?? "Loading"}
      </div>

      <ThreeDots
        height={threeDots?.height ?? 30}
        width={threeDots?.height ?? 30}
        radius={threeDots?.height ?? 5}
        color={threeDots?.color ?? "var(--color-primary)"}
        ariaLabel="three-dots-loading"
        wrapperStyle={{ marginLeft: "5px", marginTop: "20px" }}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
};

export default Loader;
