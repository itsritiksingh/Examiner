import React from "react";

export const TestNavbar = ({children}) => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "5px 0px",
        alignItems: "center",
        backgroundColor: "#9031e7",
        width:"100%",
        color:"white"
      }}
    >
        {children}
    </nav>
  );
};
