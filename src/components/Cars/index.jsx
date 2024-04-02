import {Clone, useGLTF} from "@react-three/drei";
import {degToRad} from "three/src/math/MathUtils.js";
import {useEffect} from "react";
import {MeshStandardMaterial} from "three";

export const CAR_MODELS = [
    "police",
    "raceFuture",
    "sedanSports",
    "suvLuxury",
    "truck",
    "van"
]

export const Cars = ({
                         model = CAR_MODELS[0],
                         ...props
                     }) => {
    const {scene} = useGLTF(`/models/cars/${model}.glb`);
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                if (child.material.name === "window") {
                    child.material.transparent = true;
                    child.material.opacity = 0.5;
                }
                if (child.material.name.startsWith("paint") || child.material.name === "wheelInside") {
                    child.material = new MeshStandardMaterial({
                        color: child.material.color,
                        metalness: 0.5,
                        roughness: 0.1
                    })
                }
                if (child.material.name.startsWith("light")) {
                    child.material.emissive = child.material.color;
                    child.material.emissiveIntensity = 2.5;
                    child.material.toneMapped = false;
                }
            }
        })
    }, []);
    return (
        <group {...props}>
            <Clone object={scene} rotation-y={degToRad(200)} castShadow/>
        </group>
    )
}

CAR_MODELS.forEach((model) => {
    useGLTF.preload(`/models/cars/${model}.glb`);
})
export default Cars;
