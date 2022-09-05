<div align="center">
  <a href="https://github.com/Jkker/utools-material-ui-docs">
    <img src="https://github.com/Jkker/utools-material-ui-docs/raw/master/src/material-ui.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">uTools Material UI Documentation</h3>
  <p align="center">
    一键查询 Material UI 文档
    <br />
    <br />
    <a href="https://github.com/Jkker/utools-material-ui-docs/issues">Report Bug</a>
    ·
    <a href="https://github.com/Jkker/utools-material-ui-docs/issues">Request Feature</a>
  </p>
</div>

## 功能预览
![Preview](https://raw.githubusercontent.com/Jkker/utools-material-ui-docs/main/docs/utools-material-ui-docs.webp)


## 选项设置

通过 `Material UI Setting` 指令打开设置页面，可以设置以下选项：

![Setting](https://raw.githubusercontent.com/Jkker/utools-material-ui-docs/main/docs/utools-material-ui-docs-settings.webp)

- 文档语言: 中文 / 英文
- 打开方式: 使用系统默认浏览器打开 / 使用 uTools 内置浏览器打开


## 实现原理

通过调用 Material UI 的官方 algolia API 查询文档

```json
{
  "x-algolia-application-id": "TZGZ85B9TB",
  "x-algolia-api-key": "8177dfb3e2be72b241ffb8c5abafa899",
  "url": "https://tzgz85b9tb-dsn.algolia.net/1/indexes/*/queries"
}
```

