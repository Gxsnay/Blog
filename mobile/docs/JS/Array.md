# `JS` - 数组

> **更多的是对数组方法的分析，同时要注意值类型和引用类型。**

## 数组分析

```js
let a = new Array(1, "2", {});
let a = [1, "2", {}];
typeof a; // object - 对象-引用类型
let b = a;
b[1] = "3";
console.log(a); // [1, "3", {}]
console.log(b); // [1, "3", {}]

// const - 关键字针对引用类型
const arr = [1, 2];
arr[0] = 3; // 这样是可以改变的 因为 引用地址 没有变 - 对象也是这样
```

## `Array.of`与数组创建的细节

```js
let array = [1, 3, 4];
console.log(array.length); // 3

let a = [1];
a[3] = 3;
console.log(a.length); // 4 - 这样数组会默认在没有 值 的地方填充一个 undefined 进去
console.log(a[1]); // undefined
```

### `new Array`

**单个数值的话需要注意的一点~**

```js
let a = new Array(1, 2, 3);
console.log(a); // [1, 2, 3]
// 但如果要是 只填充 一个数值的话 就会变成 默认生成 数值 个空元素
let b = new Array(6);
console.log(b); // [empty × 6] 会填充进去 6 个 undefined
```

### `Array.of`

```js
let a = Array.of(6); // 这样就会生成一个数组 里面是 [6] 其余的创建方式和 new Array() 一样~
console.log(a); // [6]
```

## 类型检测与类型转换

```js
Array.isArray() // 检测数组
[(1, 2)].toString(); // 将数组转换成字符串 typeof - string
String([1, 2]); // 也可以转换成字符串
[1, 2].join("-"); // 1-2 将数组换成字符串 typeof - string - 然后按照指定方式进行拼接
"123".split(","); // [123] - 字符串转换成数组 - 查找字符按格式进行转换 不传就挨个字符串进行拆分
Array.from("123"); // [1, 2, 3] - 按照 length 属性进行转换的~
let obj = {
  // 对象 转换字符串 需要指定索引和 length 属性 然后 Array.from 就可以对其进行转换了~
  0: "b",
  length: 2,
};
console.log(Array.from(obj));
// Array.from(params1, params2) 的第二个参数(params2)就是一个 回调函数-作用就是 对其中的每个元素进行遍历~
```

## 展开语法

```js
let a = [1, 2];
let b = [3, 4];
let c = [...a, ...b]; // [1, 2, 3, 4]; a.push(...b)
console.log(c);
// 展开语法 针对函数 接受参数，特别是不固定的 参数个数 使用展开语法~
[...args].forEach || [...div].map; // 这样就 类数组 转换成 数组 了 - 可以使用数组的方法了~
```

## 使用 解构赋值 提高效率

**解构语法 就是把数组里面的值 批量的 赋值给变量**

```js
let [a, b] = [1, 2, 3];
console.log(a); // 1
let [, ...c] = [1, 2, 3];
console.log(c); // [2, 3]
let [g, l = "a"] = [1];
console.log(l); // 'a'

console.log(..."123"); // 1 2 3 - 字符串也可以使用展开
let [...nums] = "123";
console.log(nums); // ["1", "2", "3"]
```

## 添加元素的多种操作技巧

```js
let arr = [];
arr[arr.length] = "a"; // 方法1
arr = [...arr, 3]; // 方法2
arr.push(1, 2, 3); // 方法3 - 直接改变原来的数组 - 返回数组长度~
```

## 数据出栈入栈以及填充操作

```js
`push - pop - unshift - shift`  --- 添加删除
```

### `fill`

**`fill` - 返回新的数组 - 会修改原数组。**

```js
console.log(Array(3).fill("gl")); // ["gl", "gl", "gl"]
// - 从第一个位置添加 添加到第三个位置 (包括起始 不包括结束)
console.log([1, 2, 3, 4].fill("66", 1, 3)); // [1, "66", "66", 4]
```

## `splice` 与 `slice` 实现数组的 增删改查 🍓

```js
let arr = [1, 2, 3, 4, 5];
// 从第一个位置截取 截取到第二个位置 (包括起始 不包括结束) - 返回截取的数组 - 不会修改原数组
// 如果不传参数 那就是截取全部
// 如果传递了一个参数 那就是从 参数位置截取到最后~
console.log(arr.slice(1, 2));

// 两个参数 - 从开始位置截取 截取几个 - 会修改原数组
// 不传递参数 那就是不截取 - 返回空数组
console.log(arr.splice(0, 2));
console.log(arr); // [3, 4, 5]
// 3个以上的参数 就是替换操作 - 返回的还是截取的参数
console.log(arr.splice(0, 2, "111", "112", "113"));
console.log(arr); // ["111", "112", "113", 3, 4, 5]
// 3个以及以上参数 第二个 删除参数为0 的时候 就是插入操作
console.log(arr.splice(1, 0, "12", "21")); // []
console.log(arr); // [1, "12", "21", 2, 3, 4, 5]
arr.splice(arr.length, 0, "333"); // 新增操作
```

## 清空数组的多种方式

```js
arr = []; // 方法1
arr.length = 0; // 方法2
arr.splice(0); // 方法3
while (arr.pop()) {} // 方法4
// 推荐方法1 - 方法2 但是这两种有区别 就是 🍓✨🍓
// arr = [] // 是又开辟了一份新的空间 arr指向了
// arr.length = 0; // 是在原来的空间里面 清空数组 - 如果想让数组彻底清空 当然 这种方式 更好~
```

## 数组的拆分与合并操作

```js
let str = "a,b";
let arr = str.split(","); // ["a", "b"]
str = arr.join("-"); // 'a-b'

let a = [1];
let b = [2];
let c = a.concat(b); // 多个参数 就是多个数组的合并~
console.log(c); // [1, 2] - 返回合并之后的数组
console.log(a); // [1] - 不会改变原数组🍓
let c = [...a, ...b];
```

## `copyWithin`复制

```js
let a = [1, 7, 3, 4, 5, 6];
// 参数1-开始下标 参数2-复制的时候的开始下标 参数3-复制的时候的截止下标(不包括截止~)
console.log(a.copyWithin(1, 3, 5)); // [1, 4, 5, 4, 5, 6]
```

## 查找元素的基本使用

```js
// indexOf() // - 从左侧开始查找
// lastIndexOf() // - 从右侧开始查找
// 找得到的话 返回下标 找不到返回 -1 - 他俩都是严格类型匹配 - 判断就是 !== -1 🍓
// 第二个参数 就是查找的起始点

// includes(); // 返回true(找得到) false(找不到)
```

### `includes`方法实现原理

```js
let arr = [1, 2, 3, 4, 5];
function include(array, find) {
  for (const value of array) if (value === find) return true;
  return false;
}
console.log(include(arr, 2)); // true
console.log(include(arr, 6)); // false
```

### 高效的 `find`与`findIndex` 新增方法

```js
// includes 只能查找值类型~ 🍓~
// 可以解决引用类型查找 - function() { return item.name === 'gl' }

// 遍历函数查找 - find & findIndex 禁止贪婪的找到一个真就停止了~
// find() // - 找到了就返回item 找不到就是 undefined
// findIndex() // - 找到了就返回item的下标 找不到就是 undefined
```

#### 自定义`find`原型方法的实现

```js
function find(array, callback) {
  // 🍓
  for (const value of array) if (callback(value)) return value;
  return undefined;
}
let arr = [1, 3, 5];
let ab = find(arr, (item) => {
  // return item === 3; // 3
  return item === 6; // undefined
});

// `Array.prototype`
Array.prototype.findValue = function (callback) {
  // 🍓🍓🍓 - 放置在 原型链 的时候 这时候的 array 需要替换成 this
  for (const value of this) if (callback(value)) return value;
  return undefined;
};
let arr = [1, 3, 5];
let ab = arr.findValue((item) => {
  return item === 3; // 3
});
console.log(ab); // 3
```

## 数组排序的使用技巧

```js
let arr = [1, 5, 3, 8];
arr.sort(function (a, b) {
  // 负数 从小到大 -> a - b
  // 正数 从大到小 -> b - a
  return a - b;
});
console.log(arr); // [1, 3, 5, 8]

const cart = [
  { n: "js", p: 12 },
  { n: "css", p: 8 },
  { n: "ts", p: 17 },
];
cart.sort((a, b) => a.p - b.p);
console.log(cart); // [{n: "css", p: 8} ...12...17]
```

### `sort` 排序算法的实现 🍓

```js
let arr = [1, 5, 3, 8];
function sort(array) {
  for (const a in array) {
    // 循环的是下标~
    // console.log(a); // 0 1 2 3
    for (const b in array) {
      // 循环4次 0 1 2 3
      if (array[a] < array[b]) {
        const temp = array[a];
        array[a] = array[b];
        array[b] = temp;
      }
    }
  }
  return array;
}
// 进阶版本 就是加了一个回调 然后判断 <0 这个临界值的时候~
function sort(array, callback) {
  for (const a in array) {
    for (const b in array) {
      if (callback(array[a], array[b]) < 0) {
        // 前后两个值 对比
        const temp = array[a];
        array[a] = array[b];
        array[b] = temp;
      }
    }
  }
  return array;
}
// 上面仅是模拟sort(主要是 `<0` 的一个思路)，真正sort实现估计时间复杂度会低很多(快速排序 ｜ 归并排序)。
arr = sort(arr, function (a, b) {
  return a - b; // [1, 3, 5, 8]
  return b - a; // [8, 5, 3, 1]
});
console.log(arr); // [1, 3, 5, 8]
```

## 循环操作中 引用类型 的使用技巧~

- **`值类型` 去做 循环赋值操作 - 不会改变原来数组**

- **`引用类型` 去做 循环赋值操作 - 就会改变原来数组里面的对象 - 因为使用的是同一个引用地址~**

  ```js
  let arr = [1, 5, 3, 8];
  for (const item of arr) {
    // 循环 value 🍓
    console.log(item); // 1, 5, 3, 8
  }
  for (const key in arr) {
    // 循环 key 🍓
    console.log(key); // 0, 1, 2, 3
  }
  let obj = {
    a: 1,
    b: 2,
  };
  // ⚠️⚠️⚠️ for...of 不能迭代对象 因为没有 迭代器解构 🍓
  // console.log(Object.entries(obj)); [["a", 1], ["b", 2]] - 这样就可以使用解构 得到下标和 key-value 了~ 🍓
  for (const item in obj) {
    // 循环属性
    console.log(item); // a, b
  }
  ```

## `forEach` 循环操作的使用

```js
// 要注意 引用类型 和 值类型。 - `forEach` 是可以直接操作 DOM 元素的~
// params1 - callback - 下面是 callback 的参数定义
//   params1 - item - 每一项
//   params2 - key - 下标
//   params3 - array - 原数组 - 改变了之后 原来的数组也是会改变的
// params2 - 在普通函数的使用情况下 -可以指定 this - 🍓🍓🍓
// return - 无返回值~
[0, 1, 2].forEach(_item = > {}, 参数2-箭头函数时，不可指定this);
[0, 1, 2].forEach(function() {}, 参数2-普通函数时，可指定this);
```

## `iterator` 迭代器方法 - `for-of` && `for-in`对比

```js
let arr = [1, 2];
let keys = arr.keys(); // 这个方法返回了 一个迭代对象 - 然后使用 next() 查看一下
// let values = arr.values(); // 这个方法返回了 一个迭代对象 - 然后使用 next() 查看一下
// keys 是因为拿的 keys 所以 value 就是下标值  如果是values 就是 对应的值了
console.log(keys.next()); // {value: 0, done: false} - value 表示值 - done为false 表示后面还有数据.
console.log(keys.next()); // {value: 1, done: false}
console.log(keys.next()); // {value: undefined, done: true}

let values = arr.values();
console.log(values); // Array Iterator {}
// 包裹括号 是想让前面的 先执行  - 另外一个就是 包裹括号 是让 value 使用var定义
while (({ value, done } = values.next()) && done === false) {
  console.log(value); // 1 2
}
// 其实 for...of 是专门用来操作 具有迭代器属性的结构的 --- 🍓🍓🍓
// Symbol.iterator 属性~
for (const item of arr.values()) {
  console.log(item); // 1 2
}
for (const key in arr) {
  console.log(key); // 0 1
}
for (const key in arr.values()) {
  // Array Iterator {} - 因为 `arr.values()` 返回的是一个 迭代对象
  console.log(key); // for...in 则执行不了
}
for (const [key, value] of arr.entries()) {
  console.log(key); // 0 1
  console.log(value); // 1 2
}
```

## `every` - `some` - `filter`

```js
// params1 - callback - 下面是 callback 的参数定义
// params1 - item - 每一项
// params2 - key - 下标
// params3 - array - 原数组 - 改变了之后 原来的数组也是会改变的
// return 比较~
// params2 - 在 普通函数 的使用情况下 -可以指定 this - 🍓🍓🍓
// return -
// every 所有元素都符合条件 返回true否则为false - 🍓
// some 有一个元素符合条件 返回true否则为false - 禁止贪婪 - 🍓
// filter 返回符合条件的所有元素组成的数组 否则就是 空数组 ~ 🍓
```

### 自定义 `filter` 函数

```js
let arr = [1, 3, 5];
function filter(array, callback) {
  let newArr = [];
  for (const value of array) {
    if (callback(value)) newArr.push(value);
  }
  return newArr;
}
console.log(filter(arr, (item) => item > 2)); // [3, 5]
```

## `map` 数组映射操作

```js
// params1 - callback - 下面是 callback 的参数定义
// params1 - item - 每一项
// params2 - key - 下标
// params3 - array - 原数组 - 改变了之后 原来的数组也是会改变的
// return 每一项(可能做了一些 修改的操作)
// params2 - 在普通函数的使用情况下 -可以指定 this - 🍓🍓🍓
// return - 返回一个新数组
// 值类型 - 不修改原数组~  --- 引用类型 - 就会修改原数组~
```

### 如果不想让 map 修改原数组应该这么操作~

```js
let a = [
  { title: "1", name: "g" },
  { title: "2", name: "l" },
];
let b = a.map((item) => {
  // 只要不再 item 上做修改就可以了~ 毕竟引用类型~
  return { age: 18, ...item }; // 浅拷贝
  return Object.assign({ age: 18 }, item); // 浅拷贝
});
console.log(b); // {age: 18, title: "1", name: "g"}
console.log(a); // {title: "2", name: "l"}
```

## `reduce`

```js
let arr = [1, 2, 3, 4, 5];
// params1 - callback - 下面是 callback 的参数定义
// params1 - pre - 第一项(或者说是 起始值) -
// 如果没有设置第二个参数起始值的话 那就是数组的第一项
// 如果数组没有返回 再次循环就是 undefined - 如果有返回值 pre 就是这个函数的上一次的返回值~
// params2 - crut - 当前项 就始终比 pre 后一位
// params3 - key - 当前项 crut 的索引
// params4 - array - 原数组 - 改变了之后 原来的数组也是会改变的
// return 每一项(可能做了一些 修改的操作)
arr.reduce(function (pre, crut, index, array) {
  console.log("pre", pre); // 1 undefined undefined undefined
  console.log("crut", crut); // 2 3 4 5
  console.log("index", index); // 1 2 3 4
  console.log(array); // [1, 2, 3, 4, 5]...
});
```

### `reduce` - 统计元素出现的次数

```js
let arr = [1, 2, 3, 1, 6, 5];
function numCount(array, item) {
  return array.reduce((pre, curt) => {
    return (pre += curt === item ? 1 : 0);
  }, 0);
}
console.log(numCount(arr, 1)); // 2
```

### `reduce` - 获取元素的最大值

```js
function arrayMax(array) {
  return array.reduce((pre, curt) => {
    return pre > curt ? pre : curt;
  });
}
console.log(arrayMax(arr)); // 6
```

### `reduce` - 获取价格超过 100 的商品

```js
let cart = [
  { name: "a", price: 12 },
  { name: "b", price: 121 },
  { name: "c", price: 187 },
];
function getNameByPrice(goods, price) {
  // 这个是 获取 到了商品对象
  // return goods.reduce((arr, cur) => {
  //   if (cur.price > price) arr.push(cur);
  //   return arr;
  // }, [])
  // 如果是 只获取名字 不要对象
  return (
    goods
      .reduce((arr, cur) => {
        if (cur.price > price) arr.push(cur);
        return arr;
      }, [])
      // 嗯 链式操作一下 就可以了~
      .map((item) => item.name)
  );
}
console.log(getNameByPrice(cart, 100)); // [{name: "b", price: 121}, {name: "c", price: 187}]
console.log(getNameByPrice(cart, 100)); // ["b", "c"]
```

### `reduce` - 数组 去重

```js
let abc = [1, 2, 3, 2, 3, 5];
let newSetArr = arr.reduce((arr, cur) => {
  arr.includes(cur) || arr.push(cur);
  return arr;
}, []);
console.log(newSetArr); // [1, 2, 3, 6, 5]
```

### `reduce` - 数组去重 去除重复的商品

```js
let cart = [
  { name: "a", price: 12 },
  { name: "b", price: 121 },
  { name: "c", price: 187 },
  { name: "a", price: 15 },
];
function filterGoods(goods) {
  return goods.reduce((arr, cur) => {
    let find = arr.some((item) => item.name === cur.name);
    find || arr.push(cur);
    return arr;
  }, []);
}
console.log(filterGoods(cart)); // 就是前面那三个数组了~
```

### `reduce - Demo` 炫酷的文字 `logo` 动画

```html
<style>
  body {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #34495e;
  }
  div {
    font-size: 5em;
    font-weight: bold;
    /* 都是大写 */
    text-transform: uppercase;
    color: #9b59b6;
  }
  div > span {
    position: relative;
    display: inline-block;
  }
  span.color {
    animation-name: color;
    animation-duration: 1s;
  }
  @keyframes color {
    50% {
      color: #f1c40f;
      transform: scale(2);
    }
    to {
      color: #e74c3c;
      transform: scale(0.5);
    }
  }
</style>
<!-- 炫酷的文字 LOGO 动画-->
<div>Vxecho</div>
```

```js
const div = document.querySelector("div");
// console.log([...div.textContent]); // ["G", "x", "s", "c", "u", "y"]
[...div.textContent].reduce((pre, cur, index) => {
  pre === index && (div.innerHTML = ""); // 赋了初始值 然后第一个和index 就都是0了~
  let span = document.createElement("span");
  span.innerHTML = cur;
  div.appendChild(span);
  span.addEventListener("mouseover", function () {
    this.classList.add("color");
  });
  span.addEventListener("animationend", function () {
    // 这个是监听动画结束
    this.classList.remove("color");
  });
}, 0);
```
