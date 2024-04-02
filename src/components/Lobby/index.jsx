import {Box, CameraControls, OrbitControls, PerspectiveCamera, useGLTF} from "@react-three/drei";
import {useEffect, useRef} from "react";
import {usePlayersList} from "playroomkit";
import {useThree} from "@react-three/fiber";
import {Vector3} from "three";
import Cars from "../Cars";

const Lobby = () => {
    const {scene} = useGLTF("/models/lobby.glb");
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, []);
    const shadowBias = -0.005;
    const shadowMapSize = 2048;

    const players = usePlayersList(true);

    const controls = useRef();
    const viewport = useThree((state) => state.viewport);
    const cameraRef = useRef();
    const cameraPlayer = () => {
        const factor = 10 / viewport.getCurrentViewport(cameraRef.current, new Vector3(0, 0, 0)).width;
        controls.current.setLookAt(5 * factor, 3 * factor, 2 * factor, 0, 0.15, 0, true);
    }

    useEffect(() => {
        const responsive = () => {
            cameraPlayer();
        }
        window.addEventListener("resize", responsive);
        return () => window.addEventListener("resize", responsive);
    }, []);

    return (
        <>
            <PerspectiveCamera ref={cameraRef} position={[0, 1, 10]}/>
            <CameraControls ref={controls} enableZoom={false}/>
            <group>
                <pointLight
                    intensity={20}
                    decay={2}
                    distance={10}
                    castShadow
                    color={"white"}
                    position={[0, 3, 0]}
                    shadow-bias={shadowBias}
                    shadow-mapSize-width={shadowMapSize}
                    shadow-mapSize-height={shadowMapSize}
                />
            </group>
            <group position={[-3,0,0]}>
            {
                players.map((player, index) => (
                    <group key={player.id} position={[index * 2, 0, 0]}>
                        <Cars model={player.getState("car")}/>
                    </group>
                ))
            }
            </group>
            <primitive object={scene}/>
        </>
    )
}

useGLTF.preload("/models/lobby.glb");

export default Lobby;
