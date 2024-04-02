import Lobby from "../../components/Lobby/index.jsx";
import {OrbitControls} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import "./index.css"

const Game = () => {
    return (
        <div className={"game"}>
            <Canvas shadows camera={{position: [5,2, 2], fov: 75}}>
                <ambientLight color={"white"}/>
                <OrbitControls enableZoom={false}/>
                <Lobby/>
            </Canvas>
        </div>
    )
}

export default Game;
