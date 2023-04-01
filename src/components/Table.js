import React, { useState, useEffect, useRef } from "react";
import { get, some, values, sortBy, orderBy, isEmpty, round } from "lodash";
import { Howl } from "howler";
import { AiOutlineDisconnect } from "react-icons/ai";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import { FaHandPaper, FaHandPeace, FaHandRock } from "react-icons/fa";
import { BsController, BsFillPersonFill } from "react-icons/bs";
import { BiError } from "react-icons/bi";
import { GiTabletopPlayers } from "react-icons/gi";
import { IoMdSync } from "react-icons/io";

export default function Table(game) {
  const [loaded, setLoaded] = useState(false);
  const [buzzed, setBuzzer] = useState(
    some(game.G.queue, (o) => o.id === game.playerID)
  );
  const [sound, setSound] = useState(true);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const buzzButton = useRef(null);

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [bestofValue, setbestofValue] = useState("");
  const [isPlayersSet, setisPlayersSet] = useState(false);
  const [isError, setisError] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [scoreBoard, setscoreBoard] = useState("");
  const [isShowScoreBoard, setisShowScoreBoard] = useState(false);
  const [isGameOver, setisGameOver] = useState(false);
  const [isShowThrow, setisShowThrow] = useState(false);
  const [gameOverMessage, setgameOverMessage] = useState("");

  const changePlayer1 = (e) => {
    setPlayer1(e.target.value);
  };

  const changePlayer2 = (e) => {
    setPlayer2(e.target.value);
  };

  const changeBestOfDD = (e) => {
    setbestofValue(e.target.value);
  };

  const setPlayers = (e) => {
    if (player1 === "" || player2 === "") {
      seterrorMessage("Please select the players");
      setisPlayersSet(false);
      setisError(true);
    } else if (player1 === player2) {
      seterrorMessage("Player1 & Player2 cannot be same");
      setisPlayersSet(false);
      setisError(true);
    } else if (bestofValue === "") {
      seterrorMessage("Please select the best of value");
      setisPlayersSet(false);
      setisError(true);
    } else {
      setisError(false);
      setisPlayersSet(true);
      sessionStorage.setItem("POneScore", 0);
      sessionStorage.setItem("PTwoScore", 0);
    }
  };

  const getPlayersSelection = () => {
    var player1Temp = "";
    var player2Temp = "";
    for (let value of buzzedPlayers.values()) {
      if (value.name === player1) {
        player1Temp = value.rps;
      } else if (value.name === player2) {
        player2Temp = value.rps;
      }
    }
    score(player1Temp, player2Temp);
  };

  const score = (player1Temp, player2Temp) => {
    var tempPlayer1Score = 0;
    var tempPlayer2Score = 0;
    if (!isPlayersSet) {
      seterrorMessage("Please set players before game start");
      setisError(true);
    } else if (player1Temp === null || player1Temp === "") {
      seterrorMessage("Not all players have selected the option");
      setisError(true);
    } else if (player2Temp === null || player2Temp === "") {
      seterrorMessage("Not all players have selected the option");
      setisError(true);
    } else if (player1Temp === player2Temp) {
      //TODO Check if both player picked same option
      seterrorMessage("Its a Tie, Please reset and throw again");
      setisError(true);
    } else {
      setisError(false);
      if (sound) {
        throwSound.play();
      }
      if (isWinner(player1Temp, player2Temp)) {
        tempPlayer1Score = parseInt(sessionStorage.getItem("POneScore")) + 1;

        sessionStorage.setItem("POneScore", tempPlayer1Score);

        console.log(
          "IsWinner block tempPlayer1Score: " +
            tempPlayer1Score +
            " player1Score: " +
            sessionStorage.getItem("POneScore")
        );
        console.log(
          "Local Storage Player1: " +
            player1Temp +
            " " +
            sessionStorage.getItem("POneScore") +
            " Local Storage Player2: " +
            player2Temp +
            " " +
            sessionStorage.getItem("PTwoScore")
        );
      } else {
        tempPlayer2Score = parseInt(sessionStorage.getItem("PTwoScore")) + 1;

        sessionStorage.setItem("PTwoScore", tempPlayer2Score);

        console.log(
          "IsWinner block tempPlayer2Score: " +
            tempPlayer2Score +
            " player2Score: " +
            sessionStorage.getItem("PTwoScore")
        );
        console.log(
          "Local Storage Player1: " +
            player1Temp +
            " " +
            sessionStorage.getItem("POneScore") +
            " Local Storage Player2: " +
            player2Temp +
            " " +
            sessionStorage.getItem("PTwoScore")
        );
      }

      setscoreBoard(
        "Player 1 Score: " +
          sessionStorage.getItem("POneScore") +
          "  || Player 2 Score: " +
          sessionStorage.getItem("PTwoScore")
      );

      setisShowScoreBoard(true);
      setisShowThrow(true);

      if (tempPlayer1Score === bestofValue || tempPlayer1Score >= bestofValue) {
        setgameOverMessage(
          "Player 1 Won the Game with Score: " + tempPlayer1Score
        );
        setisShowScoreBoard(true);
        setisGameOver(true);
        winnerSound.play();
      } else if (
        tempPlayer2Score === bestofValue ||
        tempPlayer2Score >= bestofValue
      ) {
        setgameOverMessage(
          "Player 2 Won the Game with Score: " + tempPlayer2Score
        );
        setisShowScoreBoard(true);
        setisGameOver(true);
        winnerSound.play();
      }
    }
  };

  const isWinner = (p1Option, p2Option) => {
    let selectionBeat = new Map();
    selectionBeat.set("Rock", "Scissors");
    selectionBeat.set("Paper", "Rock");
    selectionBeat.set("Scissors", "Paper");

    return selectionBeat.get(p1Option) === p2Option;
  };

  const resetScores = () => {
    sessionStorage.setItem("POneScore", 0);
    sessionStorage.setItem("PTwoScore", 0);

    setisShowScoreBoard(false);
    setisGameOver(false);
  };

  const buzzSound = new Howl({
    src: [
      `${process.env.PUBLIC_URL}/shortBuzz.webm`,
      `${process.env.PUBLIC_URL}/shortBuzz.mp3`,
    ],
    volume: 0.5,
    rate: 1.5,
  });

  const winnerSound = new Howl({
    src: [
      `${process.env.PUBLIC_URL}/game_show_winner.webm`,
      `${process.env.PUBLIC_URL}/game_show_winner.mp3`,
    ],
    volume: 0.5,
    rate: 1.5,
  });

  const throwSound = new Howl({
    src: [
      `${process.env.PUBLIC_URL}/boxing_bell_start.webm`,
      `${process.env.PUBLIC_URL}/boxing_bell_start.mp3`,
    ],
    volume: 0.5,
    rate: 1.5,
  });

  const playSound = () => {
    if (sound && !soundPlayed) {
      buzzSound.play();
      setSoundPlayed(true);
    }
  };

  useEffect(() => {
    // reset buzzer based on game
    if (!game.G.queue[game.playerID]) {
      setBuzzer(false);
    }

    // reset ability to play sound if there is no pending buzzer
    if (isEmpty(game.G.queue)) {
      setSoundPlayed(false);
    } else if (loaded) {
      playSound();
    }

    if (!loaded) {
      setLoaded(true);
    }
  }, [game.G.queue]);

  const attemptBuzzRock = () => {
    if (!buzzed) {
      playSound();
      game.moves.buzz(game.playerID, "Rock");
      setBuzzer(true);
    }
  };

  const attemptBuzzPaper = () => {
    if (!buzzed) {
      playSound();
      game.moves.buzz(game.playerID, "Paper");
      setBuzzer(true);
    }
  };

  const attemptBuzzScissor = () => {
    if (!buzzed) {
      playSound();
      game.moves.buzz(game.playerID, "Scissors");
      setBuzzer(true);
    }
  };

  const resetBuzzersFunc = () => {
    setisShowThrow(false);
    game.moves.resetBuzzers();
  };

  // spacebar will buzz
  useEffect(() => {
    function onKeydown(e) {
      if (e.keyCode === 32 && !e.repeat) {
        buzzButton.current.click();
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  const players = !game.gameMetadata
    ? []
    : game.gameMetadata
        .filter((p) => p.name)
        .map((p) => ({ ...p, id: String(p.id) }));
  // host is lowest active user
  const firstPlayer =
    get(
      sortBy(players, (p) => parseInt(p.id, 10)).filter((p) => p.connected),
      "0"
    ) || null;
  const isHost = get(firstPlayer, "id") === game.playerID;

  const queue = sortBy(values(game.G.queue), ["timestamp"]);

  const buzzedPlayers = queue
    .map((p) => {
      const player = players.find((player) => player.id === p.id);
      if (!player) {
        return {};
      }
      return {
        ...p,
        name: player.name,
        connected: player.connected,
      };
    })
    .filter((p) => p.name);
  // active players who haven't buzzed
  const activePlayers = orderBy(
    players.filter((p) => !some(queue, (q) => q.id === p.id)),
    ["connected", "name"],
    ["desc", "asc"]
  );

  const listOfPlayers = players;

  const timeDisplay = (delta) => {
    if (delta > 1000) {
      return `+${round(delta / 1000, 2)} s`;
    }
    return `+${delta} ms`;
  };

  return (
    <div>
      <Header
        auth={game.headerData}
        clearAuth={() =>
          game.headerData.setAuth({
            playerID: null,
            credentials: null,
            roomID: null,
          })
        }
        sound={sound}
        setSound={() => setSound(!sound)}
      />
      <Container>
        <section>
          <h3 id="room-title">Room ID: {game.gameID}</h3>
          {!game.isConnected ? (
            <p className="warning">Disconnected - attempting to reconnect...</p>
          ) : null}

          <div id="buzzerid">
            <br></br>
            <h3 id="label-title">
              Status: {game.G.locked ? "Locked" : buzzed ? "Buzzed" : "Ready"}
            </h3>
            <br></br>
            {isHost ? (
              <span
                className="hostplayers-dp1"
                id="hostplayers-dp1"
                key="hostplayers-dp1"
              >
                Player One&nbsp;
                <select
                  name="player1"
                  id="player1-select"
                  value={player1}
                  onChange={changePlayer1}
                >
                  <option value="" name="" id="dummyval1"></option>
                  {listOfPlayers.map(({ id, name, connected }) => (
                    <option
                      value={name}
                      id={"p1drop" + name}
                      key={"p1drop" + name}
                    >
                      {name}
                    </option>
                  ))}
                </select>
                &nbsp; PlayerTwo&nbsp;
                <select
                  name="player2"
                  id="player2-select"
                  value={player2}
                  onChange={changePlayer2}
                >
                  <option value="" name="" id="dummyval2"></option>
                  {listOfPlayers.map(({ id, name, connected }) => (
                    <option
                      value={name}
                      id={"p2drop" + name}
                      key={"p2drop" + name}
                    >
                      {name}
                    </option>
                  ))}
                </select>
                &nbsp; &nbsp;
                <button
                  name="SetPlayers"
                  value="SetPlayers"
                  className="button"
                  id="setplayers-button"
                  onClick={setPlayers}
                >
                  <GiTabletopPlayers style={{ color: "#f1db39" }} /> SetPlayers
                </button>
                <br></br>
                <br></br>
                Best of{" "}
                <select
                  name="bestof"
                  id="bestof-select"
                  onChange={changeBestOfDD}
                >
                  <option value="" name="" id="dummyval3"></option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="7">7</option>
                  <option value="9">9</option>
                </select>
                <br></br>
                <br></br>
                {isError ? (
                  <span>
                    <h3 style={{ color: "red" }}>
                      <BiError /> {errorMessage}
                    </h3>
                  </span>
                ) : null}
                {isPlayersSet ? (
                  <span>
                    <h3 id="label-players">
                      {" "}
                      <BsFillPersonFill /> One : {player1} vs.{" "}
                      <BsFillPersonFill /> Two: {player2}{" "}
                    </h3>
                    <br />
                  </span>
                ) : null}
                {isGameOver ? (
                  <span className="shakeeffect">
                    <h3>
                      Game Over
                      <br />
                      <br />
                      {gameOverMessage}
                    </h3>
                  </span>
                ) : null}
                {isShowScoreBoard ? (
                  <span>
                    <br />
                    <h3> Score Board </h3>
                    <p>{scoreBoard} </p>
                  </span>
                ) : null}
                <br />
                <button
                  name="Throw"
                  value="Throw"
                  className="button"
                  id="throw-button"
                  onClick={getPlayersSelection}
                  disabled={isGameOver}
                >
                  <BsController style={{ color: "#f1db39" }} /> Throw
                </button>
                &nbsp;&nbsp;
                <button
                  name="ResetScores"
                  value="ResetScores"
                  className="button"
                  id="throw-button"
                  onClick={resetScores}
                >
                  <IoMdSync style={{ color: "#f1db39" }} /> Reset Scores
                </button>
                <br></br>
                <br></br>
              </span>
            ) : null}
            <button
              name="Rock"
              value="Rock"
              id="rock-button"
              className="button"
              disabled={buzzed || game.G.locked}
              onClick={() => {
                if (!buzzed && !game.G.locked) {
                  attemptBuzzRock();
                }
              }}
            >
              <FaHandRock style={{ color: "#f1db39" }} /> Rock
            </button>{" "}
            &nbsp;&nbsp;&nbsp;
            <button
              name="Paper"
              value="Paper"
              className="button"
              id="paper-button"
              disabled={buzzed || game.G.locked}
              onClick={() => {
                if (!buzzed && !game.G.locked) {
                  attemptBuzzPaper();
                }
              }}
            >
              <FaHandPaper style={{ color: "#f1db39" }} /> Paper
            </button>{" "}
            &nbsp;&nbsp;&nbsp;
            <button
              name="Scissors"
              value="Scissors"
              className="button"
              id="scissor-button"
              disabled={buzzed || game.G.locked}
              onClick={() => {
                if (!buzzed && !game.G.locked) {
                  attemptBuzzScissor();
                }
              }}
            >
              <FaHandPeace style={{ color: "#f1db39" }} /> Scissors
            </button>{" "}
            &nbsp;&nbsp;&nbsp;
          </div>

          {isHost ? (
            <div className="settings">
              <div className="button-container">
                <button
                  className="text-button"
                  onClick={() => game.moves.toggleLock()}
                >
                  {game.G.locked ? "Unlock buzzers" : "Lock buzzers"}
                </button>
              </div>
              <div className="button-container">
                <button
                  disabled={isEmpty(game.G.queue)}
                  onClick={() => resetBuzzersFunc()}
                >
                  Reset all buzzers
                </button>
              </div>

              <div className="divider" />
            </div>
          ) : null}
        </section>

        <div className="queue">
          <p>Players Buzzed</p>
          <ul>
            {buzzedPlayers.map(({ id, name, timestamp, connected }, i) => (
              <li key={id} className={isHost ? "resettable" : null}>
                <div
                  className="player-sign"
                  onClick={() => {
                    if (isHost) {
                      game.moves.resetBuzzer(id);
                    }
                  }}
                >
                  <div className={`name ${!connected ? "dim" : ""}`}>
                    {name}

                    {isHost && isShowThrow ? (
                      <span className="demo">: {queue[i].rps}</span>
                    ) : null}

                    {!connected ? (
                      <AiOutlineDisconnect className="disconnected" />
                    ) : (
                      ""
                    )}
                  </div>
                  {i > 0 ? (
                    <span className="mini">
                      {timeDisplay(timestamp - queue[0].timestamp)}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="queue">
          <p>Other Players</p>
          <ul>
            {activePlayers.map(({ id, name, connected }) => (
              <li key={id}>
                <div className={`name ${!connected ? "dim" : ""}`}>
                  {name}
                  {!connected ? (
                    <AiOutlineDisconnect className="disconnected" />
                  ) : (
                    ""
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
