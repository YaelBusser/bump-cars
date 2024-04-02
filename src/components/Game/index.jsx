import {Gltf} from "@react-three/drei";
import {Physics, RigidBody} from "@react-three/rapier";

const Game = () => {
    return (
        <group>
            <Physics debug>
                <RigidBody colliders={"trimesh"}>
                    <Gltf src={"/models/map.glb"}/>
                </RigidBody>
            </Physics>
            <ambientLight color={"white"}/>
        </group>
    )
}

export default Game;
