import Lobby from "../../components/Lobby/index.jsx";
import {Canvas} from "@react-three/fiber";
import "./index.css"
import {useEffect} from "react";
import Stats from "stats.js";
import {Bloom, EffectComposer} from "@react-three/postprocessing";
import ChooseCar from "../../components/ChooseCar/index.jsx";
import GameScene from "../../components/Game"
const Game = () => {
    useEffect(() => {
        const stats = new Stats();
        stats.showPanel(0);
        stats.dom.style.position = 'absolute';
        stats.dom.style.top = '0';
        stats.dom.style.right = '0';
        document.body.appendChild(stats.dom);
        const updateStats = () => {
            stats.update();
            requestAnimationFrame(updateStats);
        };

        updateStats();

        return () => {
            document.body.removeChild(stats.dom);
        };
    }, []);


    return (
        <div className={"game"}>
            <Canvas shadows camera={{position: [5, 2, 5], fov: 70}}>
                {
                    /*
                <Lobby/>
                <EffectComposer>
                    <Bloom luminanceThreshold={1} intensity={0.2}/>
                </EffectComposer>
                     */
                }
                <GameScene />
            </Canvas>
            <ChooseCar/>
        </div>
    )
}

export default Game;
