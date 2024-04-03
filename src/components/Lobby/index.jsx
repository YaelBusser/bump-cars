import {Billboard, Box, CameraControls, Html, OrbitControls, PerspectiveCamera, Text, useGLTF} from "@react-three/drei";
import {useEffect, useRef, useState} from "react";
import {myPlayer, usePlayersList} from "playroomkit";
import {useFrame, useThree} from "@react-three/fiber";
import {Vector3} from "three";
import Cars from "../Cars";
import {degToRad} from "three/src/math/MathUtils.js";
import "./index.css";
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

    const me = myPlayer();
    const scale = 1.5;
    const lightAnimation = useRef();
    useFrame(({clock}) => {
        lightAnimation.current.position.x = Math.sin(clock.getElapsedTime() * 0.5) * 2;
        controls.current.camera.position.x += Math.cos(clock.getElapsedTime() * 0.5) * 0.25;
        controls.current.camera.position.y += Math.sin(clock.getElapsedTime() * 0.5) * 0.125;
    }, []);
    return (
        <>
            <PerspectiveCamera ref={cameraRef} position={[0, 1, 10]}/>
            <CameraControls ref={controls} enableZoom={false}/>
            <group ref={lightAnimation}>
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
            <group position={[-3, 0, 0]}>
                {
                    players.map((player, index) => (
                        <group key={player.id} position={[index * 3 - ((players.length - 1) * 0.8), 0, 0]}>
                            <group position-y={player.id === me?.id ? 0.2 : 0}>
                                <Cars model={player.getState("car")}/>
                                <Billboard position-y={2}>
                                    <Html>
                                        <div className={"lobby-profile"}>
                                            <img src={player.state.profile.photo}/>
                                            <p style={{color: player.state.profile.color || "white"}}>{player.state.profile.name || player.state.name || "Unknown"}</p>
                                        </div>
                                    </Html>
                                    <meshBasicMaterial color={"white"}/>
                                </Billboard>
                            </group>
                            {
                                player.id === me?.id && (
                                    <>
                                        <pointLight
                                            position={[0, 2, 0]}
                                            intensity={10}
                                            distance={0}
                                            color={"pink"}
                                        />
                                        <pointLight
                                            position={[-1, 2, 0]}
                                            intensity={5}
                                            distance={0}
                                            color={"pink"}
                                        />
                                        <pointLight
                                            position={[1, 2, 0]}
                                            intensity={5}
                                            distance={0}
                                            color={"pink"}
                                        />
                                        <pointLight
                                            position={[0, 2, 2]}
                                            intensity={5}
                                            distance={0}
                                            color={"pink"}
                                        />
                                        <pointLight
                                            position={[0, 2, -2]}
                                            intensity={5}
                                            distance={0}
                                            color={"pink"}
                                        />
                                        <group>
                                            <mesh receiveShadow rotation-x={degToRad(-90)}>
                                                <circleGeometry args={[2.1, 100]}/>
                                                <meshStandardMaterial color={"red"}/>
                                            </mesh>
                                            <mesh receiveShadow position-y={-0.05}>
                                                <cylinderGeometry args={[2, 2, 0.5, 50]}/>
                                                <meshStandardMaterial color={"white"}/>
                                            </mesh>
                                        </group>
                                    </>
                                )
                            }
                        </group>
                    ))
                }
            </group>
            <primitive scale={[scale, scale, scale]} object={scene}/>
        </>
    )
}

useGLTF.preload("/models/lobby.glb");

export default Lobby;
