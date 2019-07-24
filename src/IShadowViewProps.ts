import { IScoped } from "./IScoped";
import { IShadowRootOptions } from "./IShadowRootOptions";

/**
 * ShadowView 属性
 */
export interface IShadowViewProps extends IShadowRootOptions {
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
}
