<div align="center">
  <a href="https://github.com/Jkker/utools-tailwindcss-docs">
    <img src="https://github.com/Jkker/utools-tailwindcss-docs/raw/master/src/tailwindcss.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">uTools TailwindCSS Documentation</h3>
  <p align="center">
    一键查询 TailwindCSS 文档
    <br />
    <br />
    <a href="https://github.com/Jkker/utools-tailwindcss-docs/issues">Report Bug</a>
    ·
    <a href="https://github.com/Jkker/utools-tailwindcss-docs/issues">Request Feature</a>
  </p>
</div>

## 功能预览
![Preview](https://raw.githubusercontent.com/Jkker/images/master/utools-tailwindcss-docs.webp)


## 实现原理

通过调用 TailwindCSS 的官方 algolia API 查询文档

```json
{
  "x-algolia-application-id": "KNPXZI5B0M",
  "x-algolia-api-key": "5fc87cef58bb80203d2207578309fab6",
  "url": "https://knpxzi5b0m-dsn.algolia.net/1/indexes/*/queries"
}
```

