module.exports = {
  title: 'Gxsnay',
  base: '/',
  description: 'Keep on going never give up',
  head: [
    // 添加图标
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  searchMaxSuggestions: 10,
  lastUpdated: true,
  themeConfig: {
    logo: 'avatar.jpg',
    smoothScroll: true,
    nav: [
  {
    "text": "首页",
    "link": "/"
  },
  {
    "text": "引导",
    "items": [
      {
        "text": ".DS_Store",
        "link": "/docs/.DS_Store/"
      },
      {
        "text": "JS",
        "link": "/docs/JS/"
      },
      {
        "text": "LeetCode",
        "link": "/docs/LeetCode/"
      },
      {
        "text": "Node",
        "link": "/docs/Node/"
      },
      {
        "text": "React",
        "link": "/docs/React/"
      },
      {
        "text": "TS",
        "link": "/docs/TS/"
      },
      {
        "text": "Vue",
        "link": "/docs/Vue/"
      },
      {
        "text": "随笔",
        "link": "/docs/随笔/"
      }
    ]
  },
  {
    "text": "Github",
    "link": "https://github.com/gxsnay",
    "target": "_blank"
  },
  {
    "text": "Gitee(码云)",
    "link": "https://gitee.com/gxsnay",
    "target": "_blank"
  }
],
    sidebar: [
  {
    "text": "首页",
    "link": "/",
    "collapsable": false
  },
  {
    "text": "JS",
    "link": "/docs/JS/index",
    "children": [
      {
        "text": "Class",
        "link": "/docs/JS/Class"
      },
      {
        "text": "Code",
        "link": "/docs/JS/Code"
      },
      {
        "text": "Code_Promise",
        "link": "/docs/JS/Code_Promise"
      },
      {
        "text": "EventLoop",
        "link": "/docs/JS/EventLoop"
      },
      {
        "text": "Map-Set",
        "link": "/docs/JS/Map-Set"
      },
      {
        "text": "Object",
        "link": "/docs/JS/Object"
      },
      {
        "text": "Promise",
        "link": "/docs/JS/Promise"
      },
      {
        "text": "Sub",
        "link": "/docs/JS/Sub"
      },
      {
        "text": "Symbol",
        "link": "/docs/JS/Symbol"
      },
      {
        "text": "Underscore",
        "link": "/docs/JS/Underscore"
      },
      {
        "text": "代码质量",
        "link": "/docs/JS/代码质量"
      },
      {
        "text": "内存",
        "link": "/docs/JS/内存"
      },
      {
        "text": "函数",
        "link": "/docs/JS/函数"
      },
      {
        "text": "原型与继承",
        "link": "/docs/JS/原型与继承"
      },
      {
        "text": "常用函数",
        "link": "/docs/JS/常用函数"
      },
      {
        "text": "常用方法",
        "link": "/docs/JS/常用方法"
      },
      {
        "text": "数组",
        "link": "/docs/JS/数组"
      },
      {
        "text": "模块化",
        "link": "/docs/JS/模块化"
      },
      {
        "text": "正则",
        "link": "/docs/JS/正则"
      },
      {
        "text": "深浅拷贝",
        "link": "/docs/JS/深浅拷贝"
      },
      {
        "text": "类型",
        "link": "/docs/JS/类型"
      },
      {
        "text": "闭包",
        "link": "/docs/JS/闭包"
      }
    ]
  },
  {
    "text": "LeetCode",
    "link": "/docs/LeetCode/index",
    "children": [
      {
        "text": "X数之和",
        "link": "/docs/LeetCode/x数之和"
      },
      {
        "text": "移除元素",
        "link": "/docs/LeetCode/移除元素"
      },
      {
        "text": "链表",
        "link": "/docs/LeetCode/链表"
      }
    ]
  },
  {
    "text": "Node",
    "link": "/docs/Node/index",
    "children": []
  },
  {
    "text": "React",
    "link": "/docs/React/index",
    "children": []
  },
  {
    "text": "TS",
    "link": "/docs/TS/index",
    "children": [
      {
        "text": "Class",
        "link": "/docs/TS/Class"
      },
      {
        "text": "类型[断言-守卫]",
        "link": "/docs/TS/类型[断言-守卫]"
      }
    ]
  },
  {
    "text": "Vue",
    "link": "/docs/Vue/index",
    "children": [
      {
        "text": "Base",
        "link": "/docs/Vue/Base"
      },
      {
        "text": "组件",
        "link": "/docs/Vue/组件"
      }
    ]
  },
  {
    "text": "随笔",
    "link": "/docs/随笔/index",
    "children": []
  }
],
  }
}