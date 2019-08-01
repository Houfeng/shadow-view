import React from "react";
import ReactDOM from "react-dom";
import { ShadowView } from "../";

export class App extends React.Component {
  render() {
    return (
      <div>
        <ShadowView scoped={{ imports: ["css/index.css"] }}>
          <button>...</button>
        </ShadowView>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
