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
  "x-algolia-application-id": "TZGZ85B9TB",
  "x-algolia-api-key": "8177dfb3e2be72b241ffb8c5abafa899",
});
const url = `https://tzgz85b9tb-dsn.algolia.net/1/indexes/*/queries?${searchParams.toString()}`;
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
        indexName: "material-ui",
        params:
          "attributesToRetrieve=%5B%22hierarchy.lvl0%22%2C%22hierarchy.lvl1%22%2C%22hierarchy.lvl2%22%2C%22hierarchy.lvl3%22%2C%22hierarchy.lvl4%22%2C%22hierarchy.lvl5%22%2C%22hierarchy.lvl6%22%2C%22content%22%2C%22type%22%2C%22url%22%5D&attributesToSnippet=%5B%22hierarchy.lvl1%3A10%22%2C%22hierarchy.lvl2%3A10%22%2C%22hierarchy.lvl3%3A10%22%2C%22hierarchy.lvl4%3A10%22%2C%22hierarchy.lvl5%3A10%22%2C%22hierarchy.lvl6%3A10%22%2C%22content%3A10%22%5D&snippetEllipsisText=%E2%80%A6&highlightPreTag=%3Cmark%3E&highlightPostTag=%3C%2Fmark%3E&hitsPerPage=40&facetFilters=%5B%22version%3Amaster%22%2C%22language%3Aen%22%5D&optionalFilters=%5B%22product%3Amaterial-ui%22%5D",
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
    // ?????????????????????????????????????????????
    select: (action, items) => {
      window.utools.hideMainWindow();
      const data = getConfig().data;
      const url = data.cn
        ? items.url.replace("mui.com/", "mui.com/zh/")
        : items.url;

      if (data.openExternal) {
        utools.shellOpenExternal(url);
      } else {
        utools.ubrowser.goto(url).run();
      }

      window.utools.outPlugin();
    },
    placeholder: "?????? Material UI ??????",
  },
};

const setting = {
  mode: "list",
  args: {
    // ?????????????????????????????????
    enter: (action, callbackSetList) => {
      // ??????????????????????????????????????????
      const config = getConfig();
      const data = config.data;
      callbackSetList([
        {
          title: !data.cn ? "?????????????????????" : "Switch to English Docs",
          description: !data.cn
            ? "????????????????????? mui.com/zh"
            : "Switch to mui.com",
          icon: "./lang.svg", // ??????(??????)
          data: {
            ...data,
            cn: !data.cn,
          },
          _rev: config._rev,
        },
        {
          title: !data.openExternal
            ? "?????????????????????????????????"
            : "?????? uTools ?????????????????????",
          description: !data.openExternal
            ? "??????????????? uTools ?????????????????????"
            : "??????????????????????????????????????????",
          icon: "./browser.svg", // ??????(??????)
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
      window.utools.outPlugin();
    },
  },
};

window.exports = {
  "Material UI": plugin,
  "Material UI Doc Setting": setting,
};
