import React, { useState } from "react";
import ReactDOM from "react-dom";
import { SampleApp } from "./sample-app/react-js-sample.js";
const BasicComponent = () => {
  const [stepPagar, setStepPagar] = useState(0);

  return (
    <div>
      {stepPagar !== 0 && (
        <img
          className="wrapping-steps"
          src={`./images/step${stepPagar}.png`}
          onClick={() => {
            if (stepPagar === 3) {
              setStepPagar(0);
              SampleApp.onLivenessCheckPressed();
            } else {
              setStepPagar(stepPagar + 1);
            }
          }}
        />
      )}
      <div className="wrapping-box-container">
        <img id="facetec-logo" src="./images/factormodo.png" />
        <p id="status">Cargando...</p>
        <div className="wrapping-box-background">
          <div id="controls" className="controls">
            <button
              id="liveness-button"
              className="big-button"
              onClick={() => setStepPagar(stepPagar + 1)}
            >
              Pagar
            </button>
            <button
              id="liveness-button"
              className="big-button"
              onClick={() => SampleApp.onLivenessCheckPressed()}
            >
              Prueba de vida
            </button>
            <button
              id="liveness-button"
              className="big-button"
              onClick={() => SampleApp.onPhotoIDScanPressed()}
            >
              Onboarding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<BasicComponent />, document.getElementById("root"));
