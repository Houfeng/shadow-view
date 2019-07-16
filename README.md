# ShadowView

一个针对 React 的 Shadow DOM 容器组件，利用 ShadowView 可更方便的在 React 应用中创建启用 Shadow DOM 的容器元素。

# 安装

```bash
npm i shadow-view --save
```

# 使用

```tsx
function App() {
  return (
    <ShadowView
      scoped={{
        style: `*{color:red;}`,
        imports: ["aaa.css"]
      }}
    >
      <div>这是一个测试</div>
    </ShadowView>
  );
}
```