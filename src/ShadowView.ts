import * as React from "react";
import { attachShadow, supportShadow } from "./ShadowRoot";
import { IShadowViewProps } from "./IShadowViewProps";

/**
 * ShadowView 创建一个启用了 Shadow DOM 的容器
 */
export class ShadowView extends React.Component<IShadowViewProps> {
  /**
   * ShadowRoot
   */
  public shadowRoot: ShadowRoot;

  /**
   * DOM Root
   */
  public root: HTMLElement;

  /**
   * 原始的  visibility 属性值
   */
  private originVisibility: string;

  /**
   * 渲染组件内容
   */
  public render() {
    const { tagName = "shadow-view", children, className, style } = this.props;
    const props = { className, style, ref: this.onRef };
    const styleElement = this.renderStyle();
    return React.createElement(tagName, props, children, styleElement);
  }

  /**
   * 在执行 ref 函数时
   */
  private onRef = (root: HTMLElement) => {
    const { ref } = this.props;
    this.root = root;
    this.hideRoot();
    this.attachShadow();
    if (typeof ref === "function") ref(root);
    else if (typeof ref === "string") (<any>this)[ref] = root;
  };

  /**
   * 渲染局部作用域的样式
   */
  private renderStyle() {
    const { style = "", imports = [] } = { ...this.props.scoped };
    const buffer = [
      ...imports.map(url => `@import url("${url}")`),
      ...(style ? [style] : [])
    ];
    const tag = "style";
    const key = tag;
    const scoped = true;
    return React.createElement(tag, { key, scoped }, buffer.join(";"));
  }

  /**
   * 在组件挂载时
   */
  componentDidMount() {
    const { showDelay = 16 } = this.props;
    setTimeout(this.checkRootVisibility, showDelay);
  }

  /**
   * 启用 Shadow DOM
   */
  private attachShadow = () => {
    if (!supportShadow || !this.root || !this.root.children) return;
    const children = [].slice.call(this.root.children);
    const { mode = "open", delegatesFocus } = this.props;
    this.shadowRoot = attachShadow(this.root, { mode, delegatesFocus });
    children.forEach((child: HTMLElement) => {
      this.shadowRoot.appendChild(child);
    });
  };

  /**
   * 隐藏根元素
   */
  private hideRoot = () => {
    if (!this.root || !this.root.style) return;
    this.originVisibility = this.root.style.opacity;
    this.root.style.opacity = "0";
  };

  /**
   * 显示根元素
   */
  private showRoot = () => {
    if (!this.root || !this.root.style) return;
    const { transitionDuration } = this.props;
    this.root.style.transitionDuration = transitionDuration || ".3s";
    this.root.style.opacity = this.originVisibility;
  };

  /**
   * 检查样式加载状态
   */
  private checkRootVisibility = () => {
    if (!this.shadowRoot.styleSheets) return this.showRoot();
    const style = this.shadowRoot.styleSheets[0] as any;
    if (!style) return this.showRoot();
    const rules = [].slice.call(style.rules || style.cssRules || []);
    if (rules.length < 1) return this.showRoot();
    const pending = rules.some((rule: any) => {
      return !(rule.styleSheet || rule.href === "") && !rule.style;
    });
    return pending ? setTimeout(this.checkRootVisibility, 16) : this.showRoot();
  };
}
