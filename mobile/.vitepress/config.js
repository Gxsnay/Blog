module.exports = {
  title: "Gxsnay",
  base: "/",
  description: "Keep on going never give up",
  head: [
    // 添加图标
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ],
  searchMaxSuggestions: 10,
  lastUpdated: true,
  themeConfig: {
    logo: "avatar.jpg",
    smoothScroll: true,
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "引导",
        items: [
          {
            text: "JS",
            link: "/docs/JS/",
          },
          {
            text: "LeetCode",
            link: "/docs/LeetCode/",
          },
          {
            text: "Node",
            link: "/docs/Node/",
          },
          {
            text: "Note",
            link: "/docs/Note/",
          },
          {
            text: "React",
            link: "/docs/React/",
          },
          {
            text: "TS",
            link: "/docs/TS/",
          },
          {
            text: "Vue",
            link: "/docs/Vue/",
          },
        ],
      },
      {
        text: "Github",
        link: "https://github.com/gxsnay",
        target: "_blank",
      },
      {
        text: "Gitee(码云)",
        link: "https://gitee.com/gxsnay",
        target: "_blank",
      },
    ],
    sidebar: [
      {
        text: "首页",
        link: "/",
        collapsable: false,
      },
      {
        text: "JS",
        link: "/docs/JS/index",
        children: [
          {
            text: "Array",
            link: "/docs/JS/Array",
          },
          {
            text: "Axios",
            link: "/docs/JS/Axios",
          },
          {
            text: "Class",
            link: "/docs/JS/Class",
          },
          {
            text: "Code",
            link: "/docs/JS/Code",
          },
          {
            text: "Code_Promise",
            link: "/docs/JS/Code_Promise",
          },
          {
            text: "EventLoop",
            link: "/docs/JS/EventLoop",
          },
          {
            text: "Function",
            link: "/docs/JS/Function",
          },
          {
            text: "Map-Set",
            link: "/docs/JS/Map-Set",
          },
          {
            text: "Object",
            link: "/docs/JS/Object",
          },
          {
            text: "Promise",
            link: "/docs/JS/Promise",
          },
          {
            text: "RegExp",
            link: "/docs/JS/RegExp",
          },
          {
            text: "Sub",
            link: "/docs/JS/Sub",
          },
          {
            text: "Symbol",
            link: "/docs/JS/Symbol",
          },
          {
            text: "Underscore",
            link: "/docs/JS/Underscore",
          },
          {
            text: "Cache",
            link: "/docs/JS/cache",
          },
          {
            text: "Clone",
            link: "/docs/JS/clone",
          },
          {
            text: "Closure",
            link: "/docs/JS/closure",
          },
          {
            text: "Code-quality",
            link: "/docs/JS/code-quality",
          },
          {
            text: "Common-fn",
            link: "/docs/JS/common-fn",
          },
          {
            text: "Common-methods",
            link: "/docs/JS/common-methods",
          },
          {
            text: "Module",
            link: "/docs/JS/module",
          },
          {
            text: "Prototype-inherit",
            link: "/docs/JS/prototype-inherit",
          },
          {
            text: "Type",
            link: "/docs/JS/type",
          },
        ],
      },
      {
        text: "LeetCode",
        link: "/docs/LeetCode/index",
        children: [
          {
            text: "Link",
            link: "/docs/LeetCode/link",
          },
          {
            text: "Remove-element",
            link: "/docs/LeetCode/remove-element",
          },
          {
            text: "X-number-sum",
            link: "/docs/LeetCode/x-number-sum",
          },
        ],
      },
      {
        text: "Node",
        link: "/docs/Node/index",
        children: [],
      },
      {
        text: "Note",
        link: "/docs/Note/index",
        children: [
          {
            text: "Set-forEach",
            link: "/docs/Note/Set-forEach",
          },
        ],
      },
      {
        text: "React",
        link: "/docs/React/index",
        children: [],
      },
      {
        text: "TS",
        link: "/docs/TS/index",
        children: [
          {
            text: "Class",
            link: "/docs/TS/Class",
          },
          {
            text: "TypeAsserts-Guard",
            link: "/docs/TS/TypeAsserts-Guard",
          },
        ],
      },
      {
        text: "Vue",
        link: "/docs/Vue/index",
        children: [
          {
            text: "Base",
            link: "/docs/Vue/Base",
          },
          {
            text: "Component",
            link: "/docs/Vue/Component",
          },
        ],
      },
    ],
  },
};
