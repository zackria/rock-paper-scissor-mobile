import React from "react";
import { Navbar } from "react-bootstrap";
import { isNil } from "lodash";
import { useHistory } from "react-router";
import { leaveRoom } from "../lib/endpoints";
import { BsTrophy } from "react-icons/bs";
import { GoUnmute, GoMute } from "react-icons/go";

export default function Header({
  auth = {},
  clearAuth,
  sound = null,
  setSound,
}) {
  const history = useHistory();

  // leave current game
  async function leave() {
    try {
      await leaveRoom(auth.roomID, auth.playerID, auth.credentials);
      clearAuth();
      history.push("/");
    } catch (error) {
      console.log("leave error", error);
      clearAuth();
      history.push("/");
    }
  }

  return (
    <header>
      <Navbar>
        <Navbar.Brand>
          <BsTrophy /> Rock Paper Scissors
        </Navbar.Brand>
        <div className="nav-buttons">
          {!isNil(sound) ? (
            <button className="text-button" onClick={() => setSound()}>
              {sound ? <GoUnmute size={20} /> : <GoMute size={20} />}
            </button>
          ) : null}
          {clearAuth ? (
            <button className="text-button" onClick={() => leave()}>
              Leave game
            </button>
          ) : null}
        </div>
      </Navbar>
    </header>
  );
}
