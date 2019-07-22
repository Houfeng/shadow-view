import React from "react";
import ReactDOM from "react-dom";
import { ShadowView } from "../";

const css = "https://cdn.bootcss.com/twitter-bootstrap/4.3.1/css/bootstrap.css";

export class App extends React.Component {
  state = { message: "", css: "" };
  setMessage = () => {
    const message = "This is a warning alert—check it out!";
    this.setState({ message, css });
  };
  render() {
    const { message, css } = this.state;
    return (
      <div>
        <button className="btn btn-primary" onClick={this.setMessage}>
          显示
        </button>
        {message ? (
          <ShadowView scoped={{ imports: [css] }}>
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
            <button className="btn btn-primary" onClick={this.setMessage}>
              测试
            </button>
          </ShadowView>
        ) : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
