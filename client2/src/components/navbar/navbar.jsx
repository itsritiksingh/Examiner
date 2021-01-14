import React from "react";
import { UploadOutlined, PieChartOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "5px 0px",
        alignItems: "center",
        backgroundColor: "#9031e7",
      }}
    >
      <div className="flex" style={{ flex: 1 }}>
        <Link to="/">
          <p
            style={{
              margin: "2px",
              paddingLeft: "5px",
              fontSize: "larger",
              color: "whitesmoke",
            }}
          >
            Examiner
          </p>
        </Link>
      </div>
      <Link to="/contribute">
        <Button type="primary" danger>
          Contribute <UploadOutlined />
        </Button>
      </Link>
      <Link to="/result">
        <Button type="primary">
          Report <PieChartOutlined />
        </Button>
      </Link>
    </nav>
  );
};
