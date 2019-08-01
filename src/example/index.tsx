import React from "react";
import ReactDOM from "react-dom";
import { ShadowView, attachShadow } from "../";
import { Dialog } from "./Dialog";

export class App extends React.Component {
  state = { show: false };

  onClick = () => {
    this.setState({ show: true });
  };

  render() {
    const { show } = this.state;
    return (
      <div>
        <ShadowView scoped={{ imports: [] }}>
          <button onClick={this.onClick}>Click me</button>
        </ShadowView>
        {show ? <Dialog>demo</Dialog> : null}
      </div>
    );
  }

  async componentDidMount() {
    await this.createPortal();
  }

  async componentWillMount() {
    await this.removePortal();
  }

  portalRoot: HTMLElement;
  portalStyle: HTMLElement;

  async createPortal() {
    const root = document.createElement("div");
    document.body.appendChild(root);
    const shadowRoot = attachShadow(root, { delegatesFocus: true });
    const portalStyle = document.createElement("style");
    portalStyle.setAttribute("scoped", "");
    shadowRoot.appendChild(portalStyle);
    const portalRoot = document.createElement("div");
    shadowRoot.appendChild(portalRoot);
    document.body.appendChild = (...args) => {
      return portalRoot.appendChild(...args);
    };
    document.body.append = (...args) => {
      return portalRoot.append(...args);
    };
    this.portalStyle = portalStyle;
    this.portalRoot = portalRoot;
  }

  async removePortal() {
    if (!this.portalRoot) return;
    if (this.portalRoot.remove) return this.portalRoot.remove();
    this.portalRoot.parentNode.removeChild(this.portalRoot);
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
