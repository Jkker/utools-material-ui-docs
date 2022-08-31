const DEFAULT_CONFIG = {
  cn: false,
  openExternal: true,
};

const CONFIG_ID = "config";

const getConfig = () =>
  window.utools.db.get(CONFIG_ID) ?? { data: DEFAULT_CONFIG };

const searchParams = new URLSearchParams({
  "x-algolia-agent":
    "Algolia for JavaScript (4.9.2); Browser (lite); docsearch (3.1.0); docsearch-react (3.1.0)",
  "x-algolia-application-id": "KNPXZI5B0M",
  "x-algolia-api-key": "5fc87cef58bb80203d2207578309fab6",
});
const url = `https://knpxzi5b0m-dsn.algolia.net/1/indexes/*/queries?${searchParams.toString()}`;
const cache = new Map();

const createPostData = (query) => {
  return {
    requests: [
      {
        attributesToHighlight: ["hierarchy.lvl0", "hierarchy.lvl1"],
        attributesToRetrieve: [
          "hierarchy.lvl0",
          "hierarchy.lvl1",
          "hierarchy.lvl2",
          "hierarchy.lvl3",
          "hierarchy.lvl4",
          "hierarchy.lvl5",
          "hierarchy.lvl6",
          "content",
          "type",
          "url",
        ],
        indexName: "tailwindcss",
        params:
          "attributesToRetrieve=%5B%22hierarchy.lvl0%22%2C%22hierarchy.lvl1%22%2C%22hierarchy.lvl2%22%2C%22hierarchy.lvl3%22%2C%22hierarchy.lvl4%22%2C%22hierarchy.lvl5%22%2C%22hierarchy.lvl6%22%2C%22content%22%2C%22type%22%2C%22url%22%5D&attributesToSnippet=%5B%22hierarchy.lvl1%3A10%22%2C%22hierarchy.lvl2%3A10%22%2C%22hierarchy.lvl3%3A10%22%2C%22hierarchy.lvl4%3A10%22%2C%22hierarchy.lvl5%3A10%22%2C%22hierarchy.lvl6%3A10%22%2C%22content%3A10%22%5D&snippetEllipsisText=%E2%80%A6&highlightPreTag=%3Cmark%3E&highlightPostTag=%3C%2Fmark%3E&hitsPerPage=20&facetFilters=version%3Av3&distinct=1",
        query,
      },
    ],
  };
};

const getResultList = (list = []) =>
  list.map(({ hierarchy, url, type }) => {
    const title = hierarchy[type];
    const description =
      hierarchy["lvl1"] === title ? hierarchy["lvl0"] : hierarchy["lvl1"];

    return {
      title,
      description,
      url,
    };
  });

const plugin = {
  mode: "list",
  args: {
    search: (action, query, callbackSetList) => {
      const cached = cache.get(query);
      if (cached) {
        callbackSetList(cached);
        return;
      }

      fetch(url, {
        method: "POST",
        body: JSON.stringify(createPostData(query)),
      })
        .then(async (response) => {
          const json = await response.json();
          const resultList = getResultList(json.results[0].hits);
          cache.set(query, resultList);
          callbackSetList(resultList);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 用户选择列表中某个条目时被调用
    select: (action, items) => {
      window.utools.hideMainWindow();
      const data = getConfig().data;
      console.log(`🚀 ~ file: preload.js ~ line 87 ~ data`, data);
      const url = data.cn
        ? items.url.replace("tailwindcss.com", "www.tailwindcss.cn")
        : items.url;

      if (data.openExternal) {
        utools.shellOpenExternal(url);
      } else {
        utools.ubrowser.goto(url).run();
      }

      window.utools.outPlugin();
    },
    placeholder: "更改 uTools TailwindCSS 插件设置",
  },
};

const setting = {
  mode: "list",
  args: {
    // 进入插件时调用（可选）
    enter: (action, callbackSetList) => {
      // 如果进入插件就要显示列表数据
      const config = getConfig();
      const data = config.data;
      console.log(`🚀 get config`, config);
      callbackSetList([
        {
          title: !data.cn ? "切换到中文文档" : "Switch to English Docs",
          description: !data.cn
            ? "替换文档域名为 www.tailwindcss.cn"
            : "Switch to tailwindcss.com",
          icon: "./lang.svg", // 图标(可选)
          data: {
            ...data,
            cn: !data.cn,
          },
          _rev: config._rev,
        },
        {
          title: !data.openExternal
            ? "使用系统默认浏览器打开"
            : "使用 uTools 内置浏览器打开",
          description: !data.openExternal
            ? "当前为使用 uTools 内置浏览器打开"
            : "当前为使用系统默认浏览器打开",
          icon: "./browser.svg", // 图标(可选)
          data: {
            ...data,
            openExternal: !data.openExternal,
          },
          _rev: config._rev,
        },
      ]);
    },
    select: (action, { data, _rev }) => {
      window.utools.db.put({
        _id: CONFIG_ID,
        data: data,
        _rev,
      });
      console.log(`🚀 put config `, {
        _id: CONFIG_ID,
        data: data,
        _rev,
      });
      window.utools.outPlugin();
    },
  },
};

window.exports = {
  TailwindCSS: plugin,
  TailwindCSSSetting: setting,
};
