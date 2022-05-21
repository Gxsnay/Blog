# `JS` - `Map&Set`

> `JS`中新增了两个对象，`Map`和`Set`。
>
> `Map` 是一组键值对的结构，具有极快的查找速度。
>
> `Set` 是一组`key`的集合，但不存储`value`, 而且`key`不重复，可自动排重。

## `Set`

**`Set` - 不能有重复的值(如果类型相同 值相同是不能重复的)**

```js
let set = new Set();
set.add(1);
set.add(1);
set.add("1"); // 字符串 和 数字类型不一致 那就是两个
console.log(set); // Set(2) {1, "1"}
```

```js
let set = new Set([1, 2, 3]);
console.log(set); // Set(3) {1, 2, 3}
```

- **但是在对象里面 属性会统一转换成字符串的**

  如果对象里面 调用 的是 对象作为属性参与的话，会将对象转换成字符串来设置。

  ```js
  let obj = {
    1: "gl",
    1: "gl123",
  };
  console.log(obj); // {1: "gl123"}
  
  let gl = {
    obj: "gl", // 这里的 obj 和 上面对象obj 是不一样的 这里是 字符串obj
    // 如果想使用对象定义就是
    [obj]: "gl123",
  };
  console.log(gl); // {obj: "gl", [object Object]: "gl123"}
  console.log(gl["[object Object]"]); // gl123
  console.log(gl[obj.toString()]); // gl123 是因为将对象属性 转换成了字符串 所以这样可以取到
  ```

## `Set` 元素检测与管理

- **`add()` - 添加/设置 值**
- **`has()` - 判断值， 有就返回 `true` 没有就 `false`**
- **`delete()` - 删除指定值，删除成功就 `true` ， 没有就 `false`**
- **`clear()` - 清空 `set` 里面的元素**
- **`keys()` - 查看里面元素的个数**
- **`values()` - 和 `keys` 一样 也是查看里面元素的个数**
- **`entries()` - `{'1' => '}` 返回的参数和返回值是同一个值**

```js
let set = new Set("gl");
console.log(set); // Set(2) {"g", "l"} 会将字符串展开处理
console.log(set.size); // 2
console.log(set.has("g")); // true

console.log(set.delete("g")); // true
console.log(set); // Set(1) {"l"}

console.log(set.values()); // SetIterator {"l"} - 查看里面的元素个数
console.log(set.keys()); // SetIterator {"l"} - 和 value 一样 查看元素个数
console.log(set.entries()); // SetIterator {"l" => "l"} - 参数返回值是同一个值~

console.log(set.clear()); // 彻底清空元素~
console.log(set); // Set(0) {}
```

## `Set` - 类型之间的相互转换

- `Array.form()` - 转成数组，后面可以写 `callback` 循环
- `[...set]` - 转成数组 - 然后处理完事之后 - 在 `new Set()` 转换回来~

```js
function checkType(value) {
  // 判断类型的
  if (typeof value !== "object") {
    return typeof value;
  }
  return Object.prototype.toString.apply(value);
}

let set = new Set([1, 2]);
console.log(Array.from(set)); // (2) [1, 2] - 转数组
console.log(checkType(Array.from(set))); // type [object Array]
console.log(...set); // 1 2
```

### **在 `Set` 里面查找 `<5` 的**

```js
let gl = new Set("123456789");
console.log(gl);
// Set(9) {"1", "2", "3", "4", "5", …}
let arr = [...gl].filter(function (item) {
  // 将 gl 转成数组然后使用 数组过滤
  return item < 5;
});
gl = new Set(arr);
console.log(gl); // Set(4) {"1", "2", "3", "4"}
// 简化成一行
gl = new Set([...gl].filter((item) => item < 5));
console.log(gl); // Set(4) {"1", "2", "3", "4"}
```

### 数组 借助 `Set`

```js
let array = [1, 2, 3, 1, 5];
console.log([...new Set(array)]); // [1, 2, 3, 5] - 借助 `Set` 去重 然后转化成数组
```

## 遍历 `Set` 类型的方式

```js
let gl = new Set("123456789");
gl.forEach((item, key, set) => {
  // console.log('item', item); // 1 2 3 4 ...
  console.log("key", key); // index 值
  console.log("set", set); // set Set(9) {"1", "2", "3", "4", "5", …} - 原 Set 对象
});
for (let item of gl) {
  console.log(item); // 1 2 3 4 ...
}
```

## 使用 `Set` 处理 并集、交集 和 差集

### 并集

```js
let a = new Set([1, 2, 3]);
let b = new Set([3, 5, 6]);
console.log(new Set([...a, ...b])); // Set(5) {1, 2, 3, 5, 6}
```

### 交集

```js
console.log(
  new Set(
    [...a].filter((item) => b.has(item)) //  {3} - 在 b 元素里面 3 是 和 a 共同存在的
  )
);
```

### 差集

```js
console.log(
  new Set(
    [...a].filter((item) => !b.has(item)) //  {1, 2} - 在 b 元素里面 1和2 是不存在的
  )
);
```

## `WeakSet` 语法介绍 - `弱引用`

**`WeakSet` 也是不能有重复的值 - 但是有个要求就是必须是引用类型**

```js
let set = new WeakSet(["1", "2"]); // 这样是报错的 这样的理解是添加两个 字符串的值
let set = new WeakSet();
set.add(["1", "2"]);
console.log("set", set); // set WeakSet {Array(2)}
// 移除也是 delete - 判断也是 has - 🍓
// 大部分和 set 是差不多的 - 主要区别就是里面保存的是 引用类型 - 🍓
```

## 引用类型 的 垃圾回收 原理

```js
let gl = {
  name: "gl",
}; // 引用 +1
let a = gl; // 引用 +2
hd = null;
console.log(a); // { name: 'gl' } 因为它还在引用 所以可以打印到
a = null;
console.log(a); // null;
// 都 赋空 了之后，这个对象就没有引用了 就会 被系统自动垃圾回收♻️
```

## `WeakSet`的弱引用特性

**弱引用 的好处就是 我们不需要手动 赋空 如果没有引用 系统会帮助我们隔一段时间清空**

**弱引用 就是 循环遍历的时候 会出错**

- **`WeakSet.values() .size for...of forEach` 都不能使用**

```js
let gl = {
  name: "gl",
}; // 引用 +1
let set = new WeakSet();
set.add(gl); // 这样添加了之后 系统不会使 引用+1 还是只引用了一次 - 这种特性就是 弱引用
console.log(set); // WeakSet {{…}} - 0: Object
gl = null; // 引用清空 对象就被垃圾回收了
console.log(set); // WeakSet {{…}} - No properties - 但是 WeakSet 会以为他还保存着值 也还是会去打印
setTimeout(() => {
  console.log(set); // `WeakSet()` - 系统会在一段间隔里面就去把这个值 移除掉...
  // 所以 `弱引用` 的好处就是 我们不需要手动 赋空 如果没有引用 系统会帮助我们隔一段时间清空
}, 1000);
```

**`WeakSet()` - 系统会在一段间隔里面就去把这个值 移除掉...🍓🍓🍓**

## `TODO` 任务列表中使用 `WeakSet`

```html
<ul>
  <li>1 <a href="javascript:void(0);">删除</a></li>
  <li>2 <a href="javascript:void(0);">删除</a></li>
  <li>3 <a href="javascript:void(0);">删除</a></li>
  <!-- javascript:后面直接加了";"表示没有任何动作，这样点a标签就不会有任何反应了 -->
</ul>
```

```js
class Todo {
  constructor() {
    this.items = document.querySelectorAll("ul>li");
    this.lists = new WeakSet();
    this.items.forEach((item) => this.lists.add(item));
    console.log(this.lists); // WeakSet {li, li, li}
  }
  run() {
    this.addEvent();
  }
  addEvent() {
    this.items.forEach((item) => {
      let a = item.querySelector("a");
      // console.log(a); // 三个 a 标签
      a.addEventListener("click", (event) => {
        const parentElement = event.target.parentElement;
        if (this.lists.has(parentElement)) {
          parentElement.classList.add("remove");
          this.lists.delete(parentElement);
          console.log("hahhha");
          alert(1);
        } else {
          parentElement.classList.remove("remove");
          this.lists.add(parentElement);
        }
      });
    });
  }
}
new Todo().run();
```

## `Map`

## `Map` 类型的特点 与 创建方法

**`Map`是可以将 不同的数据类型 都可以作为键名，而以往的对象只能使用 字符串 作为键名(`Set` 的时候有说明)**

```js
let map = new Map();
map.set("name", "gl");
map.set(function () {}, "hahaha");
map.set({}, "guolin");
console.log(map); // Map(3) {"name" => "gl", ƒ => "hahaha", {…} => "guolin"}
map.clear();
map.set(1, "number 1");
map.set("1", "string 1");
console.log(map); // Map(2) {1 => "number 1", "1" => "string 1"}
```

**我们也可以和 `Set` 一样 构造的时候添加 `Map` 的数据**

```js
let map = new Map([
  ["1", "2"],
  ["name", "gl"],
]);
console.log(map); // Map(2) {"1" => "2", "name" => "gl"}
```

### 链式操作

```js
// `JS` 的链式操作
// console.log('abc'.toString().substr(1, 1)); // b
// `Map` 的链式操作 - `Set` 也可以~ - 🍓🍓
map.clear();
map.set("name", "sina").set("2", "3");
console.log(map); // Map(2) {"name" => "sina", "2" => "3"}
// `Set` 的链式操作 - 🍓🍓
let a = new Set().add(1).add(2);
console.log(a); // Set(2) {1, 2}
```

## `Map` 类型的 增删改查 操作

- **`set('', '')` - 设置值， `Map` 是 `key-value` 的形式， `Set` 是 值 的形式**
- **`get()` - 获取值**
- **`has()` - 判断值， 有就返回 `true` 没有就 `false`**
- **`delete()` - 删除指定值，删除成功就 `true` ， 没有就 `false`**
- **`clear()` - 清空 `set` 里面的元素**
- **`keys()` - 返回 `map` 里面所有的键**
- **`values()` - 返回 `map` 里面所有的值**
- **`entries()` - `{"1" => "2", "name" => "gl"}` - 返回 `map` 里面所有的 `key-value`**

```js
let obj = {
  name: "gl",
};
let map = new Map();
map.set(obj, "123"); // set -设置值
console.log(map.get(obj)); // 123 -
// get - 获取值 - map.get({ name: 'gl' }) 这样获取是不行的 因为我那的key是引用类型
console.log(map.delete("abc")); // false 有的话删除并返回true 没有返回false
console.log(map.clear()); // clear彻底清空 - clear是没有返回值的
console.log(map.has("abc")); // has检测是否有key-value 有就返回true 没有就返回false
```

## 遍历 `Map` 类型数据

```js
let map = new Map([
  ["1", "2"],
  ["name", "gl"],
]);
console.log(map.keys()); // MapIterator {"1", "name"} - 返回 `map` 里面所有的键
console.log(map.values()); // MapIterator {"2", "gl"} - 返回 `map` 里面所有的值
console.log(map.entries()); // MapIterator {"1" => "2", "name" => "gl"} - 返回 `map` 里面所有的key-value
```

**`forEach` - `for...of` // 都可以进行循环**

```js
for (const item of map.entries()) {
  // 循环 map.keys() || map.values() 都是可以的
  console.log(item); // ["1", "2"] ["name", "gl"]
  // 这个时候就可以使用 展开语法 进行赋值
}
for (const [key, value] of map.entries()) {
  console.log(key); // 1 name
  console.log(value); // 2 gl
}
map.forEach((value, key) => {
  // ⚠️ value是第一个参数 key是第二个参数
  console.log(value); // 2 gl
  console.log(key); // 1 name
});
```

## `Map` 的类型转换

**`a => b => a - a` a 转换成 b 做处理，然后处理完成返回 a 类型**

```js
let map = new Map([
  ["1", "2"],
  ["name", "gl"],
]);
console.log(...map); // 展开之后就变成数组了~ (2) ["1", "2"] (2) ["name", "gl"]
console.log([...map]); // (2) [Array(2), Array(2)] - 就等同于 [...map.entries()]
// 也可以单独转换 `键`
console.log([...map.keys()]); // ["1", "name"] - 值同理
let newArr = [...map].filter((item) => {
  return item[1].includes("gl");
});
console.log(newArr); // [["name", "gl"]]
console.log(new Map(newArr)); // Map(1) {"name" => "gl"}
```

## `Map` 类型管理 DOM 节点

```html
<div name="one">1*20</div>
<div name="two">2*20</div>
```

```js
let map = new Map();
document.querySelectorAll("div").forEach((item) => {
  map.set(item, {
    content: item.getAttribute("name"),
  });
});
map.forEach((config, ele) => {
  ele.addEventListener("click", () => {
    alert(config.content);
  });
});
```

## 使用 `Map` 类型控制网站表单提交

```html
<!-- action: 就是 如果为 true 跳转的网址~ -->
<form action="http://47.97.43.76/" onsubmit="return post()">
  接受协议
  <input type="checkbox" name="agrt" error="请接受协议" />

  我是学生
  <input type="checkbox" name="stud" error="只对学生开放" />

  <input type="submit" value="提交" />
</form>

<script src="./Map.js"></script>
```

```js
function post() {
  let map = new Map();
  let inputs = document.querySelectorAll("[error]");
  inputs.forEach((item) => {
    map.set(item, {
      error: item.getAttribute("error"),
      status: item.checked,
    });
  });
  // console.log([...map]); // [Array(2), Array(2)]
  return [...map].every(([ele, config]) => {
    // 🍓🍓🍓 参数使用了 解构特性 优秀...
    // console.log(config); // {error: "请接受协议", status: false}
    config.status || alert(config.error);
    // 神奇 amazing... 这样如果为true不alert false就提示... 🍓🍓🍓
    return config.status; // 返回一个结果 如果为true 就提交...
  });

  return false;
}
```

## 补充 - `Sub` ⚠️⚠️⚠️

```js
// 就比如你平常写 if 如果一行代码 就你可以简写
if (true) console.log(1);
// 也可以 用这种短路运算 写成这样的
true && console.log(1); // true 的时候这样做
false || console.log(2); // false 的时候这样做
```

## `WeakMap` 的语法使用

**`WeakMap` 里面的键 只能是对象(引用类型)~**

```js
let map = new WeakMap();
map.set("1", "asd"); // 报错
map.set({}, "123").set([], "666"); // 对象数组等的引用类型就可以了
```

**`DOM` 元素也是对象 所以也可以进行存储~**

- **`set delete has clear` 这些 `WeakMap` 是可以使用的 🍓🍓🍓**
- **`keys values entries size` 这些 `WeakMap` 是不可以使用了~ 🍓🍓🍓**

## `WeakMap` 弱引用类型体验

**- 因为是弱引用类型 - 所以遍历 或者 获取长度的时候是有问题的~**

**和 `WeakSet` 一样 - 具体可以参照 `WeakSet` 的章节里面的弱引用说明**

延时器 去打印 系统之后会自动清空

- **`WeakMap` 判断的时候 使用 `has` 去判断**

  **因为是弱引用，引用地址它以为还在, 所以拿 `has` 判断更为准确~**

## 判断数量

```js
// 因为 `WeakMap` 是弱引用类型~
let map = new WeakMap();
map.set(); // 往里面 push 一个
class Code {
  count() {
    // 点击标签之后 往里面 set 了
    // 每次点击 我都遍历一下 有的就加 1 没有的加 0 然后就会 构建出数量
    // 拿 `has` 判断 `WeakMap` 就挺好~
    return [...this.lis].reduce((count, li) => {
      return (count += this.map.has(li) ? 1 : 0);
    }, 0);
  }
  lists() {
    // 这里用到了 js 里面的链式编程...
    return [...this.lis]
      .filter((li) => {
        return this.map.has(li);
      })
      .map((li) => {
        return `<span>${li.querySelector("span").innerHTML}</span>`;
      })
      .join("");
  }
}
```
