import React from "react";
import ReactDOM from "react-dom";

export class ShadowView extends React.Component {
  attachShadow = (host: Element) => {
    const shadowRoot = host.attachShadow({ mode: "open" });
    [].slice.call(host.children).forEach((child: any) => {
      shadowRoot.appendChild(child);
    });
  }
  render() {
    const { children } = this.props;
    return <div ref={this.attachShadow}>
      {children}
    </div>;
  }
}

export class App extends React.Component {
  state = { message: '...' };
  onBtnClick = () => {
    this.setState({ message: 'haha' });
  }
  render() {
    const { message } = this.state;
    return <div>
      <ShadowView>
        <div>{message}</div>
        <button onClick={this.onBtnClick}>内部单击</button>
      </ShadowView>
      <button onClick={this.onBtnClick}>外部单击</button>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById("root"));