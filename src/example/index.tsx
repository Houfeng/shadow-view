import React from "react";
import ReactDOM from "react-dom";
import { ShadowView } from "../";

const css = "https://cdn.bootcss.com/twitter-bootstrap/4.3.1/css/bootstrap.css";

export class Button extends React.Component<any> {
  onClick = () => {
    const { onClick, name = "default" } = this.props;
    if (onClick) onClick(name);
  };
  render() {
    const { children } = this.props;
    return (
      <button className="btn btn-primary" onClick={this.onClick}>
        <span onClick={() => console.log("inner click")}>{children}</span>
      </button>
    );
  }
}

export class App extends React.Component {
  state = { message: "", css: "" };
  setMessage = (name: any = Date.now()) => {
    const message = "time: " + name;
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
          <div className="btn-area" onClick={() => console.log("outer click")}>
            <Button name="test" onClick={this.setMessage}>
              测试
            </Button>
          </div>
        </ShadowView>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
