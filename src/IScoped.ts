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
