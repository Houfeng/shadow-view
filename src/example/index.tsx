import React from "react";
import ReactDOM from "react-dom";
import { ShadowView } from "../";

function App() {
  return (
    <ShadowView
      scoped={{
        style: `*{color:red;}`,
        imports: ["aaa.css"]
      }}
    >
      <div>这是一个测试</div>
      <div>这是一个测试</div>
    </ShadowView>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
