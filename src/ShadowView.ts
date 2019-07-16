import * as React from "react";
import * as ReactDOM from "react-dom";
import { isArray } from "util";

/**
 * 针对容器作用域的一些设定
 */
export interface IScoped {
  /**
   * 作用于容器内的内联样式
   */
  style?: string;

  /**
   * 作用于容器内的外部样式表
   */
  imports?: string[];
}

/**
 * ShadowView 属性
 */
export interface IShadowViewProps {
  /**
   * 根元素的 tagName
   * 默认为 `shadow-view`
   */
  rootTag?: string;

  /**
   * 内容包裹元素的 tagName（存在的意义为了兼容 React 15.x 及之前的版本）
   * 默认为 `shadow-content`
   */
  contentTag?: string;

  /**
   * Shadow 容器中的子元素
   */
  children?: React.ReactNode;

  /**
   * 针对容器作用域的一些设定
   */
  scoped?: IScoped;
}

/**
 * ShadowView 创建一个启用了 Shadow DOM 的容器
 */
export class ShadowView extends React.Component<IShadowViewProps> {
  public render() {
    const { rootTag = "shadow-view" } = this.props;
    return React.createElement(rootTag, { ref: this.attachShadow });
  }

  private renderStyle() {
    const { scoped } = this.props;
    if (!scoped) return;
    const { style = "", imports = [] } = scoped;
    const buffer = style ? [style] : [];
    imports.forEach(url => buffer.unshift(`@import url("${url}")`));
    if (buffer.length < 1) return;
    const tag = "style";
    const key = tag;
    return React.createElement(tag, { key }, buffer.join(";"));
  }

  private convertChildren(children: React.ReactNode) {
    const elements = [].slice.call(isArray(children) ? children : [children]);
    const style = this.renderStyle();
    if (style) elements.unshift(style);
    return elements;
  }

  private attachShadow = (root: Element) => {
    if (!root) return;
    const shadowRoot: any = root.attachShadow
      ? root.attachShadow({ mode: "open" })
      : root;
    const { children, contentTag = "shadow-content" } = this.props;
    const content: any = React.createElement(
      contentTag,
      null,
      ...this.convertChildren(children)
    );
    ReactDOM.render(content, shadowRoot);
  };
}
