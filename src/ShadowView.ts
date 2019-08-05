import * as React from "react";
import { attachShadow, supportShadow } from "./ShadowRoot";
import { IScoped } from "./IScoped";
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
   * 渲染组件内容
   */
  public render() {
    const { tagName = "shadow-view", children, scoped, ...others } = this.props;
    const styleElement = this.renderScopedStyle(scoped);
    const props = { ...others, ref: this.onRef };
    return React.createElement(tagName, props, styleElement, children);
  }

  private originVisibility: string;

  /**
   * 在执行 ref 函数时
   */
  private onRef = (root: HTMLElement) => {
    const { ref } = this.props;
    this.root = root;
    this.hideRoot();
    if (typeof ref === "function") ref(root);
    else if (typeof ref === "string") (<any>this)[ref] = root;
  };

  /**
   * 渲染局部作用域的样式
   */
  private renderScopedStyle(scoped: IScoped) {
    const { style = "", imports = [] } = { ...scoped };
    const buffer = [
      ...imports.map(url => `@import url("${url}")`),
      ...(style ? [style] : [])
    ];
    const tag = "style";
    const key = tag;
    return React.createElement(tag, { key, scoped: true }, buffer.join(";"));
  }

  /**
   * 在组件挂载时
   */
  componentDidMount() {
    this.attachShadow();
    const { showDelay = 16 } = this.props;
    setTimeout(() => {
      this.transportChildren();
      this.checkRootVisibility();
    }, showDelay);
  }

  /**
   * 在组件更新时
   */
  componentDidUpdate() {
    this.transportChildren();
  }

  /**
   * 启用 Shadow DOM
   */
  private attachShadow = () => {
    if (!this.root || !supportShadow) return;
    const { mode = "open", delegatesFocus } = this.props;
    this.shadowRoot = attachShadow(this.root, { mode, delegatesFocus });
  };

  /**
   * 传递子元素
   */
  private transportChildren = () => {
    if (!this.root || !this.root.children) return;
    [].slice.call(this.root.children).forEach((child: HTMLElement) => {
      this.shadowRoot.appendChild(child);
    });
  };

  /**
   * 隐藏根元素
   * @param root 根元素
   */
  private hideRoot = () => {
    if (!this.root || !this.root.style) return;
    this.originVisibility = this.root.style.visibility;
    this.root.style.visibility = "hidden";
  };

  /**
   * 显示根元素
   * @param root 根元素
   * @param visibility 对应的 css 的值
   */
  private showRoot = () => {
    if (!this.root || !this.root.style) return;
    this.root.style.visibility = this.originVisibility;
  };

  /**
   * 检查样式加载状态
   * @param root 根元素
   * @param visibility 对应的 css 的值
   */
  private checkRootVisibility = () => {
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
