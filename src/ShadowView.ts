import * as React from "react";
import { attachShadow, supportShadow } from "./ShadowRoot";

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

  /**
   * 显示延时
   */
  showDelay?: number;

  delegatesFocus?: boolean;
  mode?: ShadowRootMode;
}

/**
 * ShadowView 创建一个启用了 Shadow DOM 的容器
 */
export class ShadowView extends React.Component<IShadowViewProps> {
  /**
   * ShadowRoot
   */
  public shadowRoot: ShadowRoot;

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
    const scoped = true;
    return React.createElement(tag, { key, scoped }, buffer.join(";"));
  }

  /**
   * 启用 Shadow DOM
   */
  private attachShadow = (root: HTMLElement) => {
    if (!root || !supportShadow) return;
    const originVisibility = this.hideRoot(root);
    const { mode = "open", delegatesFocus } = this.props;
    this.shadowRoot = attachShadow(root, { mode, delegatesFocus });
    [].slice.call(root.children).forEach((child: HTMLElement) => {
      this.shadowRoot.appendChild(child);
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
    const { showDelay } = this.props;
    if (showDelay) {
      setTimeout(() => {
        root.style.visibility = visibility;
      }, showDelay);
    } else {
      root.style.visibility = visibility;
    }
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
    const pending = rules.some((rule: any) => {
      return !(rule.styleSheet || rule.href === "") && !rule.style;
    });
    return pending
      ? setTimeout(() => this.checkStyleState(root, visibility), 16)
      : this.showRoot(root, visibility);
  }
}
