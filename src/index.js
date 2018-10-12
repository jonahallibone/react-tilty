import React from 'react';
import { render } from "react-dom";
import { Tilty } from "./lib";

const App = () => (
  <div style={{ width: 640, margin: "15px auto" }}>
    <h1>Hello React</h1>
     <Tilty>
         <div style={{height: "400px", width: "500px", backgroundColor: "#F69"}}></div>
     </Tilty>
  </div>
);

render(<App />, document.getElementById("root"));
