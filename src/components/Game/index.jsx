import {Gltf} from "@react-three/drei";
import {Physics} from "@react-three/rapier";

const Game = () => {
    return (
        <group>
            <Physics>
                <Gltf src={"/models/map.glb"}/>
            </Physics>
            <ambientLight color={"white"}/>
        </group>
    )
}

export default Game;
