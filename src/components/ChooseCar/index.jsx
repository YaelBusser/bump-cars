import {getState, myPlayer, usePlayersList} from "playroomkit";
import "./index.css";
import {CAR_MODELS} from "../Cars/index.jsx";

const ChooseCar = () => {
    const me = myPlayer();
    usePlayersList(true);
    return (
        <div className={"choose-car"}>
            <div className={"choose-car-content"}>
                {
                    CAR_MODELS.map((model, index) => (
                        <div
                            className={`car ${(me?.getState("car") === model || (!me?.getState("car") && index === 0)) ? "my-car" : ""}`}
                            key={model}
                            onClick={() => me?.setState("car", model)}
                        >
                            <img src={`/images/cars/${model}.png`}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
export default ChooseCar;
