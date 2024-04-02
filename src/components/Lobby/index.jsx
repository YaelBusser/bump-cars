import {useGLTF} from "@react-three/drei";

const Lobby = () => {
    const {scene} = useGLTF("/models/lobby.glb");
    return (
        <>
            <primitive object={scene}/>
        </>
    )
}

useGLTF.preload("/models/lobby.glb");

export default Lobby;
