import {isHost, myPlayer, usePlayerState} from "playroomkit";
import Cars from "../Cars/index.jsx";
import {Html, PerspectiveCamera} from "@react-three/drei";
import {euler, quat, RigidBody, vec3} from "@react-three/rapier";
import {useEffect, useRef} from "react";
import {useControls} from "leva";
import {useFrame} from "@react-three/fiber";
import {Vector3} from "three";
import "./index.css";
import {randInt} from "three/src/math/MathUtils.js";

export const CAR_SPEED = {
    police: 2,
    raceFuture: 5,
    sedanSports: 5,
    suvLuxury: 5,
    truck: 5,
    van: 5
}

// eslint-disable-next-line react/prop-types
const CarController = ({state, controls}) => {
    const [carModel] = usePlayerState(state, "car");
    const me = myPlayer();
    const car = useRef();
    const {rotationSpeed, carSpeed} = useControls({
        rotationSpeed: {
            value: 3,
            min: 0,
            max: 10,
            step: 0.1
        },
        carSpeed: {
            value: 3,
            min: 0,
            max: 100,
            step: 0.01
        }
    });

    const lookAt = useRef(new Vector3(0, 0, 0));
    useFrame(({camera}, delta) => {
        if (!car.current) {
            return;
        }

        if (me.id === state?.id) {
            const targetLookAt = vec3(car.current.translation());
            lookAt.current.lerp(targetLookAt, 0.1);
            camera.lookAt(lookAt.current);
        }
        const currentRotationVelocity = car.current.angvel();
        if (controls.isJoystickPressed()) {
            const angle = controls.angle();
            const direction = angle > Math.PI / 2 ? 1 : -1;
            currentRotationVelocity.y = -direction * Math.sin(angle) * rotationSpeed;

            const impulse = vec3({
                x: 0,
                y: 0,
                z: (CAR_SPEED[carModel] || carSpeed) * 2 * direction
            });

            const eulerRotation = euler().setFromQuaternion(quat(car.current.rotation()));
            impulse.applyEuler(eulerRotation);
            car.current.applyImpulse(impulse, true);
        }
        car.current.setAngvel(currentRotationVelocity, true);
        // S'assurer de calculer une seule fois, donc passer par l'host
        if (isHost()) {
            state.setState("position", car.current.translation());
            state.setState("rotation", car.current.rotation());
        } else {
            const position = state.getState("position");
            if (position) {
                car.current.setTranslation(position);
                car.current.setRotation(state.getState("rotation"));
            }
        }
        if (controls.isPressed("Respawn")) {
            respawn();
        }
    }, []);

    const respawn = () => {
        if (isHost()) {
            car.current.setTranslation({
                x: randInt(-2, 2) * 4,
                y: 0.25,
                z: randInt(-2, 2) * 4,
            });
            car.current.setLinvel({x: 0, y: 0, z: 0});
            car.current.setRotation({x: 0, y: 0, z: 0, w: 1});
            car.current.setAngvel({x: 0, y: 0, z: 0});
        }
    };
    useEffect(() => {
        respawn();
        console.log(state);
    }, []);
    return (
        <group position-y={5}>
            <RigidBody
                colliders={"hull"}
                ref={car}
                position={vec3(state.getState("position"))}
                rotation={euler().setFromQuaternion(quat(state.getState("rotation")))}
                onIntersectionEnter={(e) => {
                    if (e.other.rigidBodyObject.name === "void") {
                        respawn();
                    }
                }}
            >
                <Html>
                    <div className={"game-profile"}>
                        <img className={"profile-picture"} src={state.state.profile.photo}/>
                        <h1 className={"nickname"} style={{color: state.state.profile.color || "white"}}>
                            {state.state.name || state.state.profile.name}
                        </h1>
                    </div>
                </Html>
                <Cars model={carModel} scale={1.3}/>
                {
                    me.id === state.id && (
                        <PerspectiveCamera makeDefault position={[-2, 3, -5]} fov={70}/>
                    )
                }
            </RigidBody>
        </group>
    )
}

export default CarController;
