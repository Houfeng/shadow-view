# ShadowView

ShadowView 是一个写好的可开箱即用的面向 React 的 Shadow DOM 容器组件，利用 ShadowView 可以像普通组件一样方便的在 React 应用中创建启用 Shadow DOM 的容器元素。

ShadowView 目前完整兼容支持 React 15/16，组件的「事件处理、组件渲染更新」等行为在两个版中都是一致的。

<a name="Dw1SA"></a>
## 安装组件

```bash
npm i shadow-view --save
```

<a name="uwOxQ"></a>
## 使用组件

```javascript
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ShadowView } from "shadow-view";

function App() {
  return (
    <ShadowView 
    	styleContent={`*{color:red;}`} 
			styleSheets={[
    		'your_style1_url.css',
      	'your_style2_url.css'
    	]}
    >
      <style>{`在这儿也可写内部样式`}</style>
      <div>这是一个测试</div>
    </ShadowView>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

<a name="ZMGXF"></a>
## 组件属性

| **属性名** | **类型** | **说明** |
| :--- | :--- | :--- |
| className | string | 组件自身 className |
| style | any | 组件自身的内联样式 |
| styleContent | string | 作用于 ShadowView 内部的样式 |
| styleSheets | string[] | 作用于 ShadowView 内部的外联样式表 |
| scoped | boolean | 是否开始隔离，默认为 true |
| tagName | string | 外层容器 tagName，默认为 shadow-view |
