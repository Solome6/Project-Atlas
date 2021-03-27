import * as React from "react";

export const WelcomeModal = React.memo(() => (
    <div>
        <div>
            <img
                style={{ display: "block", margin: "auto" }}
                src={window.staticAssets["logo"]}
            ></img>
        </div>
        <div style={{ textAlign: "center", marginTop: "25px" }}>
            Welcome to Project Atlas. Press the X to begin exploring.
        </div>
        <div style={{ marginTop: "1000px" }}>I hope whoever is reading this has a great day :)</div>
    </div>
));
