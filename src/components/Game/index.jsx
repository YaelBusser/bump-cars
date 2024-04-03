import {Environment, Gltf, Html, Lightformer, OrbitControls, Sphere} from "@react-three/drei";
import {CuboidCollider, Physics, RigidBody, BallCollider} from "@react-three/rapier";
import {useEffect, useRef, useState} from "react";
import {Joystick, onPlayerJoin} from "playroomkit";
import CarController from "../CarController/index.jsx";
import {useFrame} from "@react-three/fiber";

const Game = () => {
    const [players, setPlayers] = useState([]);
    useEffect(() => {
        onPlayerJoin((state) => {
            const controls = new Joystick(state, {
                type: "angular",
                buttons: [{id: "Respawn", label: "Respawn"}]
            });
            const newPlayer = {state, controls};
            setPlayers((players) => [...players, newPlayer]);
            state.onQuit(() => {
                setPlayers((players) => players.filter((player) => player.id !== state.id))
            });
        }, []);
    }, []);
    const ballRef = useRef();
    const [ballPosition, setBallPosition] = useState([0, 0, 0]);
    useFrame(() => {
        // Vérifier si la référence à la balle existe
        console.log(ballRef.current.position.x)
        if (ballRef.current) {
            const position = ballRef.current.position;
            // Mettre à jour l'état avec la nouvelle position
            setBallPosition(position);
        }
        //console.log(ballRef.current);
    });
    useEffect(() => {
        console.log(ballRef);
    }, []);
    const scaleMap = 5;
    return (
        <group>
            <Environment>
                <Lightformer
                    position={[5, 5, 5]}
                    form="rect" // circle | ring | rect (optional, default = rect)
                    intensity={1} // power level (optional = 1)
                    color="white" // (optional = white)
                    scale={[10, 10]} // Scale it any way you prefer (optional = [1, 1])
                    target={[0, 0, 0]} // Target position (optional = undefined)
                />
            </Environment>
            <pointLight position={[0, 5, 0]} intensity={2.5} distance={10}/>
            <pointLight
                position={[5, 5, 0]}
                intensity={10.5}
                distance={10}
                color="pink"
            />
            <pointLight
                position={[-5, 5, 0]}
                intensity={10.5}
                distance={15}
                color="blue"
            />
            <directionalLight position={[10, 10, 10]} intensity={0.4}/>
            <Physics>
                {
                    players.map(({state, controls}, index) => (
                        <CarController key={state.id} state={state} controls={controls}/>
                    ))
                }
                <RigidBody type={"fixed"} colliders={"trimesh"}>
                    <Gltf src={"/models/map.glb"} scale={[scaleMap, scaleMap, scaleMap]}/>
                </RigidBody>
                <RigidBody
                    type={"fixed"}
                    sensor
                    colliders={false}
                    position-y={-5}
                    name={"void"}
                >
                    <CuboidCollider args={[100, 3, 100]}/>
                </RigidBody>
                <RigidBody
                    type={"dynamic"}
                    colliders={"ball"}
                    gravityScale={1}
                    position={[0,0.5,0]}
                >
                    <Sphere ref={ballRef} args={[0.5,50,50]}>
                        <meshNormalMaterial />
                    </Sphere>
                </RigidBody>
            </Physics>
            <ambientLight intensity={0.5}/>
            <Html position={[0, 2, 0]}>{`Position de la balle : ${ballPosition.x}`}</Html>
        </group>
    )
}

export default Game;
