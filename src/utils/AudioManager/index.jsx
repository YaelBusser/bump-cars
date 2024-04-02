export const audios = {
    starting_engine: new Audio("/audios/starting-engine.mp3")
}

const AudioManager = (audio) => {
    audio.currentTime = 0;
    audio.play();
}

export default AudioManager;
