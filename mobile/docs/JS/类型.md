# `JS` - 类型

> `JS`中基础类型和引用类型说明，以及类型转换的详细说明。

## 原始类型&对象类型

### 原始类型

- **原始类型的值无法更改**

  ```js
  let a = "abc";
  a[1] = "a";
  alert(a); // abc
  ```

- **字符串中的方法，返回的是一个新的字符串，并不会改变原来的字符串**

  ```js
  let s = "ABC";
  s.toLowerCase("");
  alert(s); // ABC
  ```

- **比较原始类型是否相等，是比较它们的值。**

  ```js
  let n1 = 123,
    n2 = Number(123);
  console.log(n1 === n2); // true
  ```

### 对象类型

- **对象类型的值是可以修改的**

  ```js
  let o = { x: 1 };
  o.x = 2;
  o.y = 3;
  console.log(o); // { x: 2, y: 3 }
  delete o.x;
  console.log(o); // { y: 3 }
  ```

- **比较对象是否相等，不是比较它们的值。**

  ```js
  let o1 = { x: 2 },
    o2 = { x: 2 };
  console.log(o1 === o2); // false
  ```

  **对象类型又叫 引用类型， 当给一个变量赋值为对象时，该变量保存的是该对象在内存中的地址。**

  **对象的比较是在比较引用地址： 当且仅当 它们的引用是同一个对象时，它们才相等（内存地址相等）。**

  ```js
  let x1 = { s: 1 };
  let x2 = x1;
  x2.y = 1;
  console.log(x1 === x2); // true;
  ```

### 复制变量的值

**想复制某个变量的值，只要将它 赋值给另外一个变量(或者是某个对象的属性)。 复制原始类型和对象类型 有所不同。**

- 复制 原始类型 的变量的值时，**会将值 拷贝一份，和原来的值是相互独立的。**

- 复制 对象类型 的变量的值时，**会将存储在变量中的值拷贝一份，也就是它所指向对象在内存中的地址值。**

  > 相当于赋值了 对象类型的指针，**复制操作结束后，他们俩指向了 同一个对象。**

- **如果想复制对象的副本，则必须 显式地 复制对象的每个属性(如果对象是数组， 就复制数组的每个元素)**

## 类型转换

```js
let a = "5" + "2"; // '52'
let b = "5" - "2"; // 3

let a = "" - 1; // -1
let b = true + false; // 1
let c = null + 1; // 1
let d = undefined + 1; // NaN ⚠️
let e = [] + []; // "" ⚠️
```

### 转字符串

**经常出现在`+`运算符中，并且其中有一个操作数，不是数值类型。**

```js
let s = 4 + "px" + 5; // 4px5
s = 123e-2 + "a"; // 123e-2a
```

### 转数值

经常出现在 数学运算 中，**表示链接字符串的 + 运算符除外。**

```js
let s = "abc"; // +s -> NaN ⚠️  / -s -> NaN ⚠️
s = " 123 "; // +s -> 123 ⚠️ / -s -> -123 ⚠️
```

### 转布尔

**经常出现在`if`语句，逻辑运算中。**

```js
let s = "abc";
if (s) console.log(s); // 'abc'
console.log(!!s); // true
```

### 相等

**`==`元算符会有类型转换，`===`运算符不会进行类型转换。**

```js
console.log(null == undefined); // 相等
console.log("0" == 0); // 在比较之前 字符串转换成数字
console.log(0 == false); // 在比较之前 布尔转化成数字
console.log("0" == false); // 在比较之前 字符串和布尔值都转换成数字
```

### 类型转换`Table`

> `\` 代表的是 本身就是这个类型

| 值                        | 转字符串       | 转数值 | 转布尔  | 转对象                  |
| ------------------------- | -------------- | ------ | ------- | ----------------------- |
| `undefined`               | `'undefined'`  | `NaN`  | `false` | `TypeError`             |
| `null`                    | `'null'`       | `0`    | `false` | `TypeError`             |
| `true`                    | `'true'`       | `1`    | `\`     | `new Boolean(true)`     |
| `false`                   | `'false'`      | `0`    | `\`     | `new Boolean(false)`    |
| `''`                      | `\`            | `0`    | `false` | `new String('')`        |
| `'1.2'`                   | `\`            | `1.2`  | `true`  | `new String('1.2')`     |
| `'abc'`                   | `\`            | `NaN`  | `true`  | `new String('abc')`     |
| `0`                       | `'0'`          | `/`    | `false` | `new Number(0)`         |
| `-0`                      | `'0'`          | `/`    | `false` | `new Number(0)`         |
| `NaN`                     | `'NaN'`        | `/`    | `false` | `new Number(NaN)`       |
| `Infinity`                | `'Infinity'`   | `/`    | `true`  | `new Number(Infinity)`  |
| `-Infinity`               | `'-Infinity'`  | `/`    | `true`  | `new Number(-Infinity)` |
| `{}(任意对象)`            | `~`            | `~`    | `true`  | `/`                     |
| `[](空数组)`              | `''`           | `0`    | `true`  | `/`                     |
| `[9](数字元素)`           | `'9'`          | `9`    | `true`  | `/`                     |
| `['a'](其他数组)`         | `使用join方法` | `NaN`  | `true`  | `/`                     |
| `function() {}(任意函数)` | `~`            | `NaN`  | `true`  | `/`                     |

### 显示类型转换

- **数字 转 字符串**

  **还可以使用`toString()`方法，他的执行结果通常和`String()`方法一致**

  **`Number`类型的 `toString()`方法还支持第二个参数，指定要转换的进制。**

  ```js
  null.toString(); // Error - 🍓 null 和 undefined 没有 toString 方法
  undefined.toString(); // Error
  undefined.toString(); // '123'
  false.toString(); // 'false'
  let n = 20;
  n.toString(2); // 二进制 - 10100
  n.toString(8); // 八进制 - 24
  n.toString(16); // 十六进制 - 14
  ```

  - **`Number` 类型转换成 字符串还有三个方法**

    **`toFixed()` - 可把`Number`四舍五入为指定小数位数的数字 ~ 返回`NumberObject`的字符串表示;**

    **`toExponential()` - 可把对象的值转换成指数计数法;**

    **`toPrecision()` - 把数字格式化为指定的长度 ~ 方法返回指定长度的数值字符串;**

- **对象 转 字符串**

  - **`value.toString();`**

  - **`value + ''`**

    > **先调用`valueOf`方法，如果是原始值则返回，否则 调用`toString()`方法，如果是原始值。则返回 否则报错`TypeError`**

  - **`String(value)`**

    > `String`和空字符串差不多， 只是会优先调用`toString()` 然后`valueOf`最后都不行报错。
    >
    > **`Date`始终调用`toString`方法。**

- **对象 转 数值**

  - **`+value`**

  - **`Number(value)`**

    > **都是先调用`valueOf`方法，如果是原始值，则返回。否则，调用`toString()`方法，将返回值转换为数值。**

### 类型识别`typeof`

**`typeof` 在判断对象类型时有局限性。**

**可以识别基础数据类型`undefined / boolean / number / string / symbol`和 `object / function`**

### 类型识别`instanceof`

**`obj instanceof constructor`**

- **判断变量是否是 给定 类的实例。**

  ```js
  new Date() instanceof
    Date(
      // true
      []
    ) instanceof
    Array(
      // true
      null
    ) instanceof
    Object(
      // false
      /\d+/
    ) instanceof
    RegExp; // true
  ```

- **`instanceof`可以识别自定义对象类型**

  ```js
  function Foo() {}
  function Bar() {}
  Bar.prototype = new Foo();
  new Bar() instanceof Bar; // true
  new Bar() instanceof Foo; // true
  ```

- **`instanceof`可以识别 继承类型**

  ```js
  let a = [];
  a instanceof Array; // true
  a instanceof Object; // true
  ```

- **`instanceof`无法识别 原始类型**

  **`instanceof`只是在判断 变量 是哪个类型，不是得到哪个变量类型。**

  ```js
  "123" instanceof String; // false
  123 instanceof Number; // false
  ```

### 类型识别`constructor.name`

这个更加具体，**可以检测变量的构造函数**

```js
({ x: 1 }.constructor
  .name(
    // Object
    []
  )
  .constructor.name(
    // Array
    new Date()
  )
  .constructor.name(
    // Date
    ""
  )
  .constructor.name(
    // String
    true
  )
  .constructor.name(
    // Boolean
    12
  )
  .constructor.name(
    // Number
    null
  )
  .constructor.name(
    // TypeError 🐖~
    undefined
  ).constructor.name); // TypeError 🐖~
```

- **`obj.constructor.name` 也可以检测自定义类型**

  ```js
  function Foo() {}
  new Foo().constructor.name; // Foo
  ```

- **`obj.constructor.name`在有原型的时候 会失效 🐖~**

  ```js
  function Foo() {}
  Foo.prototype = {
    method1: function () {},
  };
  new Foo().constructor.name; // Object
  ```

- **`obj.constructor.name`在多重继承的时候 会失效 🐖~**

  ```js
  function a() {}
  function b() {}
  b.prototype = new a(); // b 继承 a
  let f = new b();
  f.constructor.name === b; // false
  f.constructor.name === a; // true
  ```

### 类型识别`Object.prototype.toString.call`

**可以检测对象的内部属性`[[Class]]`**

```js
function getType(o) {
  return Object.prototype.toString.call(o);
}
let d = new Date();
let a = [];
let r = /d+/;
console.log(getType(a)); // [object Array]
console.log(getType(d)); // [object Date]
console.log(getType(r)); // [object RegExp]
```

```js
// 所以我们只要截取一下 字符串 就可以了
function getType(o) {
  return Object.prototype.toString.call(o).slice(8, -1);
  // Array Date RegExp
}
```

**🐖~ 这里是判断不了 自定义的构造函数~**

```js
function Foo() {}
console.log(getType(new Foo())); // Object
```

### 类型识别总结

- **`constructor`和`instanceof`不可以跨`frame`**，需要在同个`frame`中才有效。

```js
let iframe = document.createElement("iframe");
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length - 1].Array;
let arr = new xArray(1, 2, 3); // [1, 2, 3]
arr instanceof Array; // false
arr.constructor === Array; // false
```

- **只检测特定的属性，如果存在，则认为是该类型。**

```js
// 有的 第三方 库，是 这么进行判断 的。
function isArray(object) {
  return (
    object != null &&
    typeof object === "object" &&
    "splice" in object &&
    "join" in object
  );
}

function isArray(arr) {
  return !!arr && arr.constructor === Array;
}
```

- **总结**

| 方法                            | 总结                                                                                               |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| **`typeof`**                    | **无法检测具体的对象类型，适合检测变量是否定义。**                                                 |
| **`instanceof`**                | **无法检测 原始类型，跨`frame`失效**                                                               |
| **`constructor`**               | **不检查原型链，无法检测`null`和`undefined`，跨`frame`失效，有浏览器兼容性问题，某些场景下失效。** |
| **`duck-typing`**               | **不可靠，某些场景下失效。**                                                                       |
| **`Object.prototype.toString`** | **可以检测所有原生对象，无法识别自定义对象的 具体类型。**                                          |

- **如果有原生方法， 肯定是要优先使用。🍓🍓🍓**

  **`Array.isArray();` - 检测数组的原生方法。**

  > `true` 👇
  >
  > `Array.isArray([]); `
  >
  > `Array.isArray([1]); `
  >
  > `Array.isArray(new Array());`
  >
  > `Array.isArray(Array.prototype);` - 鲜为人知 `Array.prototype` 也是一个数组

  > `false` 👇
  >
  > `Array.isArray() / Array.isArray({}) / Array.isArray(null) / Array.isArray(undefined)`
  >
  > `Array.isArray(17) / Array.isArray(false) / Array.isArray({ __proto__: Array.prototype }); `

- **关于`DOM`元素 和 宿主对象的检测**

  **情况更加复杂， 和具体的浏览器厂商实现有很大关系， 有很多的兼容性问题。**
