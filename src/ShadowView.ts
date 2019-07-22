import * as React from "react";

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
  tagName?: string;

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
  /**
   * 渲染组件内容
   */
  public render() {
    const { tagName = "shadow-view", children } = this.props;
    const styleElement = this.renderStyle();
    const props = { ref: this.attachShadow };
    return React.createElement(tagName, props, styleElement, children);
  }

  /**
   * 渲染局部作用域的样式
   */
  private renderStyle() {
    const { style = "", imports = [] } = this.props.scoped || {};
    const buffer = style ? [style] : [];
    imports.forEach(url => buffer.unshift(`@import url("${url}")`));
    const tag = "style";
    const key = tag;
    return React.createElement(tag, { key }, buffer.join(";"));
  }

  /**
   * 启用 Shadow DOM
   */
  private attachShadow = (root: HTMLElement) => {
    if (!root || !root.attachShadow) return;
    const originVisibility = this.hideRoot(root);
    const shadowRoot: ShadowRoot = root.attachShadow({ mode: "open" });
    [].slice.call(root.children).forEach((child: HTMLElement) => {
      shadowRoot.appendChild(child);
    });
    this.checkStyleState(root, originVisibility);
  };

  /**
   * 隐藏根元素
   * @param root 根元素
   */
  private hideRoot(root: HTMLElement): string {
    const originVisibility = root.style.visibility;
    root.style.visibility = "hidden";
    return originVisibility;
  }

  /**
   * 显示根元素
   * @param root 根元素
   * @param visibility 对应的 css 的值
   */
  private showRoot(root: HTMLElement, visibility: string): void {
    root.style.visibility = visibility;
  }

  /**
   * 检查样式加载状态
   * @param root 根元素
   * @param visibility 对应的 css 的值
   */
  private checkStyleState(root: HTMLElement, visibility: string): any {
    const style = root.shadowRoot.styleSheets[0] as any;
    if (!style) return this.showRoot(root, visibility);
    const rules = [].slice.call(style.rules || style.cssRules || []);
    if (rules.length < 1) return this.showRoot(root, visibility);
    if (rules.some((rule: any) => !rule.styleSheet && !rule.style)) {
      return setTimeout(() => this.checkStyleState(root, visibility), 16);
    }
    return this.showRoot(root, visibility);
  }
}
