import React, { useState, useEffect, useRef } from 'react';
import { get, some, values, sortBy, orderBy, isEmpty, round } from 'lodash';
import { Howl } from 'howler';
import { AiOutlineDisconnect } from 'react-icons/ai';
import { Container } from 'react-bootstrap';
import Header from '../components/Header';

export default function Table(game) {
  const [loaded, setLoaded] = useState(false);
  const [buzzed, setBuzzer] = useState(
    some(game.G.queue, (o) => o.id === game.playerID)
  );
  const [sound, setSound] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const buzzButton = useRef(null);

  const buzzSound = new Howl({
    src: [
      `${process.env.PUBLIC_URL}/shortBuzz.webm`,
      `${process.env.PUBLIC_URL}/shortBuzz.mp3`,
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

  const attemptBuzz = () => {
    if (!buzzed) {
      playSound();
      game.moves.buzz(game.playerID);
      setBuzzer(true);
    }
  };

  const attemptBuzzRock = () => {
    if (!buzzed) {
      playSound();
      game.moves.buzz(game.playerID, 'Rock');
      setBuzzer(true);
    }
  };

  const attemptBuzzPaper = () => {
    if (!buzzed) {
      playSound();
      game.moves.buzz(game.playerID, 'Paper');
      setBuzzer(true);
    }
  };

  const attemptBuzzScissor = () => {
    if (!buzzed) {
      playSound();
      game.moves.buzz(game.playerID, 'Scissors');
      setBuzzer(true);
    }
  };

  // spacebar will buzz
  useEffect(() => {
    function onKeydown(e) {
      if (e.keyCode === 32 && !e.repeat) {
        buzzButton.current.click();
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
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
      '0'
    ) || null;
  const isHost = get(firstPlayer, 'id') === game.playerID;

  const queue = sortBy(values(game.G.queue), ['timestamp']);

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
    ['connected', 'name'],
    ['desc', 'asc']
  );

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
              Status: {game.G.locked ? 'Locked' : buzzed ? 'Buzzed' : 'Ready'}
            </h3>
            <br></br>
            <button
              name="Rock"
              value="Rock"
              class="button"
              disabled={buzzed || game.G.locked}
              onClick={() => {
                if (!buzzed && !game.G.locked) {
                  attemptBuzzRock();
                }
              }}
            >
              Rock
            </button>{' '}
            &nbsp;&nbsp;&nbsp;
            <button
              name="Paper"
              value="Paper"
              class="button"
              disabled={buzzed || game.G.locked}
              onClick={() => {
                if (!buzzed && !game.G.locked) {
                  attemptBuzzPaper();
                }
              }}
            >
              Paper
            </button>{' '}
            &nbsp;&nbsp;&nbsp;
            <button
              name="Scissors"
              value="Scissors"
              class="button"
              disabled={buzzed || game.G.locked}
              onClick={() => {
                if (!buzzed && !game.G.locked) {
                  attemptBuzzScissor();
                }
              }}
            >
              Scissors
            </button>{' '}
            &nbsp;&nbsp;&nbsp;
          </div>

          {/* 
          <div id="buzzer">
            <button
              ref={buzzButton}
              disabled={buzzed || game.G.locked}
              onClick={() => {
                if (!buzzed && !game.G.locked) {
                  attemptBuzz();
                }
              }}
            >
              {game.G.locked ? 'Locked' : buzzed ? 'Buzzed' : 'Buzz'}
            </button>
          </div> */}

          {isHost ? (
            <div className="settings">
              <div className="button-container">
                <button
                  className="text-button"
                  onClick={() => game.moves.toggleLock()}
                >
                  {game.G.locked ? 'Unlock buzzers' : 'Lock buzzers'}
                </button>
              </div>
              <div className="button-container">
                <button
                  disabled={isEmpty(game.G.queue)}
                  onClick={() => game.moves.resetBuzzers()}
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
              <li key={id} className={isHost ? 'resettable' : null}>
                <div
                  className="player-sign"
                  onClick={() => {
                    if (isHost) {
                      game.moves.resetBuzzer(id);
                    }
                  }}
                >
                  <div className={`name ${!connected ? 'dim' : ''}`}>
                    {name}
                    {isHost ? (
                      <span className="demo">
                        : {queue[i].rps}
                      </span>
                    ) : null}

                    {!connected ? (
                      <AiOutlineDisconnect className="disconnected" />
                    ) : (
                      ''
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
                <div className={`name ${!connected ? 'dim' : ''}`}>
                  {name}
                  {!connected ? (
                    <AiOutlineDisconnect className="disconnected" />
                  ) : (
                    ''
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
