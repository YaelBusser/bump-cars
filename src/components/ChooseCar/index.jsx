import {getState, isHost, myPlayer, startMatchmaking, useMultiplayerState, usePlayersList} from "playroomkit";
import "./index.css";
import {CAR_MODELS} from "../Cars/index.jsx";
import AudioManager, {audios} from "../../utils/AudioManager/index.jsx";
import {useEffect, useState} from "react";

const ChooseCar = () => {
    const me = myPlayer();
    usePlayersList(true);
    const [gameState, setGameState] = useMultiplayerState("gameState", "lobby");
    const [loading, setLoading] = useState(true);
    const [loadingContent, setLoadingContent] = useState(0);
    useEffect(() => {
        setLoading(true);
        if (gameState !== "loading") {
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 1000);
            return () => clearTimeout(timeout);
        }

    }, [gameState]);
    useEffect(() => {
        let currentIndex = 0;
        let interval;

        if (loading) {
            interval = setInterval(() => {
                setLoadingContent((prev) => {
                    currentIndex = (prev + 1) % CAR_MODELS.length;
                    return currentIndex;
                });
            }, 250);
        }

        return () => {
            clearInterval(interval);
        };
    }, [loading]);

    return (
        <>
            <div className={`loading ${!loading ? "hide-loading" : "show-loading"}`}>
                <p className={"text"}>VROOM, VROOM</p> <img src={`/images/cars/${CAR_MODELS[loadingContent]}.png`} alt={"images cars"}/>
            </div>
            <div className={`choose-car ${gameState === "game" ? "hide-choose-car" : ""}`}>
                <div className={"choose-car-content"}>
                    {
                        CAR_MODELS.map((model, index) => (
                            <div
                                className={`car ${(me?.getState("car") === model || (!me?.getState("car") && index === 0)) ? "my-car" : ""}`}
                                key={model}
                                onClick={() => {
                                    me?.setState("car", model);
                                    AudioManager(audios.starting_engine);
                                }}
                            >
                                <img src={`/images/cars/${model}.png`}/>
                            </div>
                        ))
                    }
                </div>
                {
                    gameState === "lobby" && isHost() && (
                        <div className={"start-game"}>
                            <button onClick={() => {
                                setGameState("loading");
                                setTimeout(async () => {
                                    setGameState("loading");
                                    await startMatchmaking();
                                    setGameState("game");
                                }, 500)
                            }}>start
                            </button>
                        </div>
                    )
                }
            </div>
        </>
    )
}
export default ChooseCar;
