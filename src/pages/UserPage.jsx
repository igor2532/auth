import React from "react";
import Header from "./Header";
import { NavLink, useLocation } from "react-router-dom";

export default function UserPage() {
  const location = useLocation();
  return (
    <>
      <Header />
      <div className="App_userPage">UserPage {location.state.userEmail}</div>

      <div className="App_div_chat">
        <NavLink
          state={{
            userId: location.state.userId,
            userEmail: location.state.userEmail,
          }}
          to="/chat"
        >
          Открыть чат с пользователем
        </NavLink>
      </div>
    </>
  );
}
