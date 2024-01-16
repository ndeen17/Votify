import React from "react";
import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";

import { useGetUploadQuery } from "../profile/profileApiSlice";
import { useSendLogoutMutation } from "../../features/auth/authApi";

import { Tooltip } from "react-tooltip";

import logo from "../../assets/logo.png";

import { BiUserCircle } from "react-icons/bi";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const [logOut] = useSendLogoutMutation();
  const handleLogout = async () => {
    const id = toast.loading("Loading...");
    const response = await logOut().unwrap();
    if (!response) {
      setTimeout(() => {
        toast.update(id, {
          render: "Server error, try again later",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          draggable: true,
        });
      }, 1000);
      return;
    }
    if (response === "serverError") {
      setTimeout(() => {
        toast.update(id, {
          render: "Server error, try again later",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          draggable: true,
        });
      }, 1000);
      return;
    }
    if (response === "logged out") {
      setTimeout(() => {
        toast.update(id, {
          render: "Sucessfull!!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          draggable: true,
        });
        navigate("/");
      }, 1000);
      return;
    }
  };
  const { data: uploadData } = useGetUploadQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const location = useLocation();
  return (
    <nav className="NavBar">
      <div className="NavBarLogo">
        <img alt="logo" src={logo} />
        <h1>Votify</h1>
      </div>
      <div className="NavBarRoute">
        {location.pathname === "/" && (
          <a href="https://www.youtube.com/watch?v=k7kbAyOHRdE&t=169s&pp=ygURaG93IHRvIHVzZSB2b3RpZnk%3D">
            <button className="button">How it Works</button>
          </a>
        )}
        {(location.pathname === "/dash" ||
          location.pathname === "/dash/vote" ||
          location.pathname === "/dash/vote/login-vote" ||
          location.pathname === "/dash/dashboard") && (
          <div>
            <img
              className="navbar__profile"
              alt="pic"
              src={uploadData}
              id="profile-tooltip"
              style={{
                display: uploadData ? "block" : "none",
                objectFit: "cover",
              }}
            />
            <BiUserCircle
              id="profile-tooltip2"
              className="navbar__profile__icon"
              style={{ display: !uploadData ? "block" : "none" }}
            />
            <Tooltip
              anchorId={uploadData ? "profile-tooltip" : "profile-tooltip2"}
              place="bottom"
              clickable
              className="admin__main__header__profile__tooltip"
              style={{ color: "#5520b7", backgroundColor: "white" }}
            >
              <>
                <div
                  className="admin__main__header__profile__tooltip__data"
                  onClick={() => navigate("/dash/profile")}
                >
                  Profile
                </div>
                <div
                  className="admin__main__header__profile__tooltip__data"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </>
            </Tooltip>
          </div>
        )}
      </div>
    </nav>
  );
}
