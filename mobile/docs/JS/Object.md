# `JS` - 对象`Object`

> `JavaScript` 中的所有事物都是对象：字符串、数值、数组、函数...
>
> 此外，`JavaScript` 允许自定义对象。

## 基本了解

```js
let user = {
  name: "gl",
  grade: [
    { name: "js", score: 99 },
    { name: "css", score: 87 },
  ],
  average() {
    let total = this.grade.reduce((t, l) => t + l.score, 0);
    return `${this.name}的平均成绩是: ${total / this.grade.length}`;
  },
};

console.log(user.average());
```

### 属性的基本操作

```js
user.name; // 通常推荐 点 语法~
user["name"]; // 'my age' 或者 变量 这些属性 使用[]来调用
user.name; // get
user.name = "fxl"; // set
delete user.name; // del
```

## 对象的引用传值

- 基础数据类型就是赋值操作没有引用地址一说。
- 具体可见 **深浅拷贝 章节**

```js
let user = {},
  a = user;
user.name = "gl";
console.log(a.name); // gl - 公用一块地址~
// 传值类型
function change(a) {
  a = a + 100;
  console.log(a); // 101
}
let a = 1;
change(a);
console.log(a); // 1
// 引用类型
function change(a) {
  // 这里 传值 复制来引用地址 所以是一块地址
  a.age = 18;
  console.log(a); // {name: "gl", age: 18}
}
let a = { name: "gl" };
change(a);
console.log(a); // {name: "gl", age: 18}
```

## 展开语法完成参数合并

- `🍓get` -- **合并默认值的时候可以使用，因为同属性下 后面的会覆盖前面的属性。**

```js
function upload(params) {
  let baseConfig = {
    // 基础参数
    type: "*.png",
    size: 10000,
  };
  // 如果有 params 的 就先使用 params 的参数 然后在使用默认配置
  let config = { ...baseConfig, ...params };
  return config;
}
console.log(upload({ size: 99 }));
```

## 解构

**解构: 结构的分解处理**

```js
let user = { name: "gl", age: 18 };
const { name, age } = user;

function gl() {
  return { name: "gl", age: 18 };
}
const { name, age } = gl();
console.log(name); // gl

function gl({ name }) {
  console.log(name);
}
gl({ name: "gl", age: 18 });

const { random } = Math;
console.log(random(1));
```

### 解构 - 严格模式

- 严格模式下变量的定义需要声明才可以。

```js
// 正常来讲
let user = { name: "gl", age: 18 };
({ name, age } = user);
console.log(name); // gl 这样也是可以的

("use strict");
// name 就打印不出来 没有声明
let { name, age } = user;
// ⚠️ 平常最好是使用 严格模式 来声明
```

### 解构 - 操作的简写和变量解构

```js
let user = { name: "gl", age: 18 };
let { name } = user; // name: name
let { age } = user; // age: age

let arr = ["gl", "123"];
let [a] = arr;
console.log(a); // gl
let [, b] = arr;
console.log(b); // 123
```

### 多层对象的解构操作

```js
let hd = {
  name: "gl",
  obj: {
    title: "js",
  },
};
let {
  name,
  obj: { title }, // 就相当于 let { title } = { title: 'js' }
} = hd;
console.log(name, title); // gl js
```

### 解构默认值实现配置项合并

- 默认值设置之后 **没有传递或者没有属性就使用默认值，传递了值就使用传递的**

```js
let arr = ["gl", "123"];
let [a, b, c = "666"] = arr;
console.log(a, b, c); // gl 123 666
let user = { name: "gl", age: 18 };
let { age, name, title = "title" } = user; // 如果没有title值 那就是默认 如果有 那就是真正的值了
console.log(name, age, title); // gl 18 title
// 参数合并
function createElement(opts = {}) {
  let { width = 200, height = 100, bgc = "red" } = opts;
  // 如果传递参数就是传递进来的 如果没有就使用默认值~
}
createElement();
```

### 函数参数的解构特性使用技巧

- `obj('gl', {sex: '男', age: 18})` **传递对象就需要指定属性 不然就是 默认值或者 `undefined`**

```js
function arr([name, age]) {
  console.log(name); // gl
}
arr(["gl", 18]);
function obj(name, { sex, age }) {
  console.log(name, age, sex); // gl 18 男
}
obj("gl", { sex: "男", age: 18 }); // 传递对象就需要指定属性 不然就是 默认值或者 undefined
```

## 对象属性 的 添加删除 操作

- **`对象与原型链` 属性检测实例**

  **`hasOwnProperty` 只看自己 不看父级**

  **`in ` 看自己也看父级**

```js
let user = {};
// 添加
user.a = 123;
user["b"] = 666;
// 删除
delete user.a;
// 对象的属性检测
console.log(user.hasOwnProperty("b")); // true
```

## 计算属性和`assign`的使用

- 参与计算

  ```js
  let gl = {};
  let name = "title";
  gl[name] = "郭霖";
  console.log(gl.title); // 郭霖
  let arr = [
    {
      a: 1,
      b: "gl",
    },
    {
      a: 11,
      b: "gl",
    },
  ];
  let res = arr.reduce((obj, cur, index) => {
    // 归并
    obj[`${cur.b}-${index}`] = cur;
    return obj;
  }, {});
  console.log(res); // { gl-0: {a: 1, b: "gl"}, gl-1: {a: 11, b: "gl"} }
  console.log(JSON.stringify(res, null, 2)); // 2-tab键位
  ```

- **`Object.assign` - 对象合并**

  **属性相同 后面的会覆盖前面的**

  ```js
  // 遍历操作
  let gl = {name: 'gl',age: 18};
  console.log(Object.keys(gl)); // ["name", "age"]
  console.log(Object.values(gl)); // ["gl", 18]
  console.log(Object.entries(gl)); // [["name", "gl"], ["age", 18]]
  for (const key in gl) {
    console.log(key); // name age
    console.log(gl[key]); // 'gl' 18
  }
  for (const [key, value] of Object.entries(gl)) { // for...of 操作迭代对象的
       const key of [1, 2] --- key: 1 key: 2
    console.log(key); // name age
    console.log(value); // 'gl' 18
  }
  ```

## 对象的深浅拷贝

### 浅拷贝 的多种操作方法

**浅拷贝的意思就是 我们不能深层次的进行赋值，如果 里面还有个对象结构，就只能拿到引用地址了**

```js
let a = (b = { name: "gl" }); // 这样就是每个都共用了一块内存空间 这个就是 浅拷贝
```

- 赋值

  ```js
  let b1 = { name: "haha" };
  let a1 = {
    name: b1.name,
  }; // 这样就是每个都开辟了一个自己的内存空间
  b1.name = "555";
  console.log(a1.name); // haha
  ```

- 进阶 - 对 **第一层级** 的循环赋值

  ```js
  let gl = { name: "gl", age: 18 };
  let obj = {};
  for (const key in gl) {
    obj[key] = gl[key];
  }
  console.log(obj); // {name: "gl", age: 18}
  gl.name = "666";
  console.log(obj); // {name: "gl", age: 18}
  ```

- **`Object.assign`**

  ```js
  let gl = { name: "gl", age: 18 };
  let obj = Object.assign({}, gl);
  gl.name = "999";
  console.log(obj); // {name: "gl", age: 18}
  ```

- **`展开运算符`**

  ```js
  let gl = { name: "gl", age: 18 };
  let obj = { ...gl };
  gl.name = "999";
  console.log(obj); // {name: "gl", age: 18}
  ```

### 深拷贝的多层次分析

- 深层次的赋值 就是 **深拷贝 - 递归**

```js
let obj = {
  name: "gl",
  user: {
    name: "fxl",
  },
};
function copy(object) {
  let res = {};
  for (const key in object) {
    res[key] =
      typeof object[key] === "object" ? copy(object[key]) : object[key];
  }
  return res;
}
let gl = copy(obj);
```

- **深拷贝 代码**

  ```js
  function deepClone(obj) {
    let objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key]);
        } else {
          objClone[key] = obj[key]
        }
      } else {
        return false;
      }
    } else {
      return null;
    }
    return objClone;
  }
  ```

## 使用工厂函数创建对象

- 在工厂函数当中呢，对于同一动作进行定制~

  ```js
  function user(name) {
    return {
      name,
      show: function () {
        console.log(this.name + "-guolin");
      },
    };
  }
  let gl = user("GGG");
  gl.show(); // GGG-guolin
  ```

## 构造函数创建对象的方式

```js
function User(name) {
  this.name = name;
  this.show = function () {
    console.log(this);
    console.log(this.name);
  };
  // 🍓🍓🍓 一般情况下 return this 是默认自带的~
  // 🍓🍓🍓 return this;
  // 🍓🍓🍓 构造函数的时候不需要返回 任何值~
}
let gl = new User("gl").show(); // gl
let gl = new User("gl");
let func = gl.show; // 在这里 gl.show - this是User, func调用是外面的this - window
func();
```

## 数据也可以使用构造函数 构建

```js
let o = {};
console.log(o); // new Object();
let n = new Number(1);
console.log(n + 3); // 4
let User = new Function(
  "name",
  `
  this.name = name;
  this.show = function() {
    console.log('66665')
  }
`
);
let gl = new User();
gl.show(); // 66665
```

## 面向对象的封装与抽象

**封装方法让外界不能改变在构造函数里面 定义的属性和方法。**

```js
function User(name, age) {
  // this.name = name;
  // this.age = age;
  let data = { name, age }; // 定义在 对象里面 防止外部通过 new 实例来该改变属性值
  this.show = function () {
    console.log(data.name + info());
  };
  // 对方法进行 抽象的私有处理~
  // this.info = function() {
  //   return data.age > 20 ? '老年' : '青年';
  // }
  let info = function () {
    // 调用的时候 直接 info 就可以
    return data.age > 20 ? "老年" : "青年";
  };
}
let xj = new User("gl", 18);
xj.name = "哈哈哈"; // 并不会改变 处理结果~
xj.show(); // gl青年
```

## 什么是 `对象` 的属性特征

- `Object.getOwnPropertyDescriptor` - **查找特定属性的 特征**

- `Object.getOwnPropertyDescriptors` - **这个返回的就是 对象所有属性的特征**

- `defineProperty` - **对特定属性 进行设置**

  - `configurable` - **是否可以被删除 或者 重新被配置.**
  - `enumerable` - **是否可以遍历 枚举**
  - `value` - **值**
  - `writable` - **是否可以修改**

- `defineProperties` - **一次对多个属性进行设置**

  ```js
  let user = {
    name: "gl",
    age: 18,
  };
  console.log(Object.getOwnPropertyDescriptor(user, "name")); // 查找特定属性的 特征
  // configurable: true 是否可以被删除 或者 重新被配置.
  // enumerable: true 是否可以遍历 枚举...
  // value: "gl"  值
  // writable: true 是否可以修改
  console.log(Object.getOwnPropertyDescriptors(user)); // 这个返回的就是 对象所有属性的特征
  ```

### 灵活的控制 属性的特征

```js
// 没有name属性就是设置，有就是更改属性值。
Object.defineProperty(user, "name", {
  value: "郭霖",
  writable: false, // 属性不可以修改~ 严格模式下就会有提示
  enumerable: false, // Object.keys for...in 啥的遍历
  configurable: false, // 不可以被删除 或者不可以被 重新配置(defineProperty)~ 严格模式下就会有提示
});
console.log(user.name); // 郭霖
delete user.name;
Object.defineProperties(user, {
  // 一次对多个属性进行设置  就用这个~
  name: {},
  age: {},
});
```

**不允许向对象中添加`属性API`。🍓🍓**

## 禁止向对象当中添加属性

**`Object.preventExtensions` - `Object.isExtensible()`**

```js
let user = { name: "gl" };
Object.preventExtensions(user); // 禁止向对象中添加属性了
// 判断方法
if (Object.isExtensible(user)) {
  // 如果为 true 那就可以添加属性了
  user.age = 18;
  console.log(user); // {name: "gl"}
}
```

### 封闭对象 的 API 操作

**`Object.seal` - `Object.isSealed`**

- **封闭了之后是不可以添加属性了**

  **不可以删除对象**

  **也不可以配置 枚举 配置(`configurable`) 这些了**

```js
const user = { name: "gl" };
Object.seal(user); // 封闭对象 就是将 configurable 设置成了 false;
user.name = "zq";
user.age = 18;
console.log(user); // {name: "zq"}
// 判断
if (Object.isSealed(user)) {
  // 处于封闭状态
} // 所以默认取反 然后做操作~
```

### 冻结对象 的 API 操作~

**`Object.freeze` - `Object.isFrozen`**

- **不可修改 不能添加 不能删除 不能配置 枚举呀 config 这些属性了**

  **可以遍历~ 可以读取~ 🍓**

```js
const user = { name: "gl" };
Object.freeze(user); // 冻结对象 就是将 configurable writable 设置成 false;
user.addPro = 1;
user.name = "hahaha";
console.log(user); // {name: "gl"}
// 不可修改 不能添加 不能删除 不能配置 枚举呀 config 这些属性了   --- 可以遍历~ 可以读取~
if (Object.isFrozen(user)) {
} // 冻结判断 冻结了 就是true
```

## 使用 访问器 保护数据 - 对象就有`get/set`🍓

```js
const user = {
  data: {
    name: "gl",
    age: 18,
  },
  set age(value) {
    if (typeof value !== "number" || value < 10 || value > 100) {
      throw new Error("年龄格式错误");
    }
    this.data.age = value;
  },
  get age() {
    return this.data.age;
  },
};
user.age = 999; // throw new Error('年龄格式错误');

user.age = 99;
console.log(user.age); // 99
```

## 访问器 伪造属性操作 🍓

```js
let Lesson = {
  lists: [
    { name: "js", price: 100 },
    { name: "mysql", price: 212 },
  ],
  get total() {
    // 这个就是 相当于计算属性
    return this.lists.reduce((t, c, i) => {
      return t + c.price;
    }, 0);
  },
};
console.log(Lesson.total); // 312
// 因为 只有 get, 没有 set 所以伪造属性操作 这样最合适~
```

## 使用 `访问器` 批量设置属性 🍓

```js
const web = {
  name: "gl",
  url: "vxecho.cn",
  set site(value) {
    [this.name, this.url] = value.split(",");
  },
  get site() {
    return `${this.name}的网址是${this.url}`;
  },
};
web.site = "开源产品,www.Vxechi.cn";
console.log(web.url); // www.Vxechi.cn
console.log(web.site); // 开源产品的网址是www.Vxechi.cn
```

## `访问器` 的优先级

```js
const DATA = Symbol(); // Symbol 是唯一的 Symbol != Symbol
let user = {
  // name: 'hhh',
  [DATA]: { name },
  age: 10,
  set name(value) {
    this[DATA].name = value;
    console.log("访问器的优先级 比 user.name 要高");
  },
  get name() {
    return this[DATA].name;
  },
};
user.name = "gl";
console.log(user.name); // gl
```

## `TOKEN`的读写处理

```js
let Request = {
  set token(content) {
    localStorage.setItem("token", content);
  },
  get token() {
    let token = localStorage.getItem("token");
    if (!token) {
      console.log("跳转到 登录页面");
    } else {
      return token;
    }
  },
};
Request.token = "alssidmqwenhqw";
console.log(Request.token); // alssidmqwenhqw
```

## 构造函数 与 `class`语法糖 中使用访问器 🍓

### 构造函数

- **如果没有定义访问器 - 在外部可以随意修改这里的属性**
- **定义了访问器 - 设置完访问器之后，就看不到属性了，但是读取 是可以读到的~**

```js
function User(name, age) {
  // this.name = name;
  // this.age = age;
  let data = { name, age };
  Object.defineProperties(this, {
    name: {
      get() {
        return data.name;
      },
      set(value) {
        if (!value.trim() || value.length > 20)
          throw new Error("名称设置的不符合。");
        data.name = value;
      },
    },
  });
}
let gl = new User("gl", 18);
// 如果没有定义访问器
gl.name = "郭霖"; // 在外部可以随意修改这里的属性
console.log(gl); // User {name: "郭霖", age: 18}
// 定义了访问器
gl.name = "郭霖";
console.log(gl.name); // 郭霖
gl.name = ""; // Uncaught Error: 名称设置的不符合。
console.log(gl); // 设置完访问器之后 就看不到属性了 User {}
console.log(gl.name); // gl 但是读取 是可以读到的~
```

### 类`Class`

```js
const DATA = Symbol();
class User {
  constructor(name, age) {
    this[DATA] = { name, age }; // 除了这样设置 类里面有私有属性 什么的也可以设置
  }
  get name() {
    return this[DATA].name;
  }
  set name(value) {
    if (!value.trim() || value.length > 20)
      throw new Error("名称设置的不符合。");
    this[DATA].name = value;
  }
}
let gl = new User("gl", 18);
console.log(gl); // User {Symbol(): {…}}
console.log(gl.name); // gl
```

## Proxy

**[proxy 官网介绍](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)**

**[Reflect 官网介绍](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)**

### 什么是 `Proxy` 代理拦截

**`defineProperty` 是对原有对象的一个劫持 本身的意义是定义属性标签 它会污染原对象**

**`proxy` 也会省去一个` for in` 循环 (很省空间)**

- `get` - `return obj[property]` 这样不太优雅

  **可以转换成** `return Reflect.get(target, key);`

- `set` - `return target[key] = value`

  **可以转换成** `return Reflect.set(target, key, value)`

  **这个是和 `proxy` 相辅相成的 可以直接进行设置**

```js
const gl = { name: "gl" };
const proxy = new Proxy(gl, {
  get(obj, property) {
    // return obj[property];
    return Reflect.get(obj, property); // 可以换成这个
  },
  set(obj, property, value) {
    obj[property] = value;
    return Reflect.set(target, key, value);
    return true; // 这个是在严格模式下 需要设置的~
  },
});
console.log(proxy.name); // gl
proxy.name = "555";
console.log(proxy.name); // 555
console.log(proxy); // Proxy {name: "555"}
```

### 使用 代理`Proxy` 控制函数

**使用代理来作为 中间桥梁 来对其中对一些事件 做一些处理~**

```js
function factorial(num) {
  return num == 1 ? 1 : num * factorial(num - 1);
}
let proxy = new Proxy(factorial, {
  // params1 - 原函数
  // params2 - 代理对象 this 当前上下文...
  // params3 - 行参
  apply(fun, obj, args) {
    // agrs 因为是 apply 那就是 数组 [5]
    // console.log('obj', obj); // obj {}
    // 查看 阶乘 执行的时间
    console.time("run"); // time 和 timeEnd 标示需要一样的
    fun.apply(this, args); // run: 0.023193359375ms
    console.timeEnd("run");
  },
});
proxy.apply({}, [5]);
```

### 使用 代理`Proxy` 操作数组~

```js
const list = [1, 2, 3];
const proxy = new Proxy(list, {
  get(array, key) {
    // console.log(array); // [1, 2, 3] - 原数组~
    // console.log(key); // 0 - 下标
    let content = array[key];
    content = content > 10 ? "true" : "false";
    return content;
  },
});
console.log(proxy[0]); // false
```

### 实现`VueJs` 数组绑定的容器更新

```html
<input type="text" v-model="title" />
<input type="text" v-model="title" />
<h4 v-bind="title">这里也会发生更新</h4>
```

```js
function View() {
  let proxy = new Proxy(
    {},
    {
      set(obj, property, value) {
        // 只找到 title 的数据让其发生更新
        document.querySelectorAll(`[v-model="${property}"]`).forEach((item) => {
          item.value = value;
        });
        document.querySelectorAll(`[v-bind="${property}"]`).forEach((item) => {
          item.innerHTML = value;
        });
        return true;
      },
      // get(obj, property) {
      //   return
      // }
    }
  );
  // 绑定事件
  this.init = function () {
    const els = document.querySelectorAll("[v-model]");
    els.forEach((item) => {
      item.addEventListener("keyup", function () {
        proxy[this.getAttribute("v-model")] = this.value;
      });
    });
  };
}
new View().init();
```

## `JSON`

**`JSON` 是一种通用格式 前后端交互 或者发公众号啥的**

**`JSON.stringify()` -` JSON.parse()`**

### `JSON` 序列化 与 自定义 `toJSON()`

- `JSON.stringify()`

  - `params1` - 就是要转 `json` 的对象
  - `params2` - 就是要保留的属性 `e.g: ['title']`
  - `params3` - tab 符占位

- `toJSON`

  **`JSON.stringify` 的时候会查看有没有 `toJSON` 方法**

  **有的话 就按照你定制的返回数据**

  ```js
  let obj = {
    title: "1",
    age: 2,
    toJSON: function () {
      // JSON.stringify 的时候会查看有没有 toJSON 方法
      // 有的话 就按照你定制的返回数据
      return {
        title: this.title,
      };
    },
  };
  console.log(JSON.stringify(obj)); // {"title":"1"}
  console.log(JSON.stringify(obj, null, 2));
  // {
  //   "title": "1"
  // }
  ```

  ### `JSON` 转为 `JS` 可操作类型

  **`JSON.parse()`**

  ```js
  let obj = { a: 1 };
  let jsonObj = JSON.stringify(obj);
  // console.log(JSON.parse(jsonObj)); // {a: 1}
  // params1 - 要转换的 json 串
  // params2 - 函数
  JSON.parse(jsonObj, (key, value) => {
    console.log(key); // a
    console.log(value); // 1
    if (key == "a") {
      value++;
    }
    return value;
  }); // {a: 2}
  ```
