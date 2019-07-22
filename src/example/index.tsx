import React from "react";
import ReactDOM from "react-dom";
import { ShadowView } from "../";

const css = "https://cdn.bootcss.com/twitter-bootstrap/4.3.1/css/bootstrap.css";

export class App extends React.Component {
  state = { message: "", css: "" };
  setMessage = () => {
    const message = "time: " + Date.now();
    this.setState({ message, css });
  };
  render() {
    const { message, css } = this.state;
    return (
      <div>
        <button className="btn btn-primary" onClick={this.setMessage}>
          显示
        </button>
        <ShadowView key={css} scoped={{ imports: [css] }} showDelay={100}>
          <div className="alert alert-warning" role="alert">
            {message}
          </div>
          <button className="btn btn-primary" onClick={this.setMessage}>
            测试
          </button>
        </ShadowView>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
