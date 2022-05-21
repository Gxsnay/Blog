# `JS` - 闭包

> 闭包是指有权访问另一个函数作用域中的变量的函数。
>
> `JavaScript` 变量可以是局部变量或全局变量。
>
> 私有变量可以用到闭包。

## 环境 - 理解

- **环境如果不被需要 就会被 回收 ♻️**
- **全局的环境是不会被回收的~**
- **调用两次函数 就生成两次内存地址（两次的函数环境~）**

## 延伸 函数 中的环境生命周期

**如果我们创造的环境 在被使用 那就不会被删除**

```js
function gl() {
  let n = 1;

  function sum() {
    console.log(++n);
  }
  sum();
}
gl(); // 2
gl(); // 2
gl(); // 2
// 多次调用之后 gl() 还是多个2  开辟了三次引用地址 每次都是最新的~ 🍓🍓🍓
```

```js
// 这样 向外抛出  能够使得 sum() 一直在被使用 所以不会被清空 然后也会一直累加
function gl() {
  let n = 1;
  return function sum() {
    console.log(++n);
  };
}
let a = gl(); // 就是 sum 函数被外部引用了 而且被全局的环境变量引用 所以不会被回收♻️ - 🍓🍓🍓
a(); // 2
a(); // 3
a(); // 4
let b = gl();
b(); // 2
```

## 构造函数 中 作用域的使用形态

```js
function Gl() {
  let n = 1;
  this.sum = function () {
    console.log(++n);
  };
}
// 其实构造函数这样 就类似与 下面这种写法---可以相对于闭包这么理解
function Gl() {
  let n = 1;

  function sum() {
    console.log(++n);
  }
  return {
    sum,
  };
}
let a = new Gl();
a.sum(); // 2
a.sum(); // 3
let b = new Gl();
b.sum(); // 2
```

## `var / let` 在`for`循环中的使用

### `var`

```js
for (var i = 1; i <= 3; i++) {
  console.log(i); // 1 2 3
}
console.log(i); // 4 - 因为执行了 `for` 循环中的语句了 然后不符合 但是 `i` 也++了
```

### `let`

- `let` 就是外面访问不到了 但是也是会执行的~
- **`let` 在每次循环都创建一个内存空间 类似 立即执行函数**

### 模拟 `let` 的块作用域

```js
for (var i = 1; i <= 3; i++) {
  (function (a) {
    setTimeout(() => {
      console.log(a); // 1 2 3
    }, 1000);
  })(i);
}
```

```js
let arr = [];
for (var i = 1; i <= 3; i++) {
  arr.push(function () {
    return i;
  });
}
console.log(arr[0]()); // 4
// 因为调用的时候 会向上查找 也是执行完了 所以就打印 4 最后的执行结果了👆

let arr = [];
for (var i = 1; i <= 3; i++) {
  (function (i) {
    arr.push(function () {
      return i;
    });
  })(i);
}
console.log(arr[0]()); // 1
```

**如果包裹一层立即执行函数，他也是会往上面查找，然后发现 立即执行函数参数就有值，所以就每次都是一个 新空间 所以会按照顺序执行 - 🍓🍓🍓**

## 闭包

### 什么是 闭包

**闭包是指有权访问另一个函数作用域中的变量的函数。**

**有两个要点：**

- **闭包是函数。**
- **它可以访问另一个函数的作用域中的变量。**

### 使用 闭包 获取区间商品

```js
let arr = [1, 33, 45, 21, 3, 13];

function between(a, b) {
  return function (v) {
    return v >= a && v <= b;
  };
}

let filterArr = arr.filter(between(3, 20));
console.log(filterArr); // [3, 13]
```

### 闭包 - 实际开发 理解~

```js
btns.forEach((item) => {
  // 这样是解决了抖动 但是加速会越来越快
  // let left = 1;

  // 解决 动画越来越快 的问题
  let flag = false;

  item.addEventListener("click", function () {
    let left = 1; // 放在这里 每次点击都生成一次环境 每次 left 都重新执行 所以产生了抖动 - 🍓
    if (!flag) {
      // flag = true; 或者 flag直接定于 定时器~
      flag = setInterval(() => {
        item.style.left = left++;
      }, 100);
    }
  });
});
```

### 闭包 内存泄漏解决办法 - 释放引用(释放内存)

**手动赋空 `null` - 确定不需要使用的时候 赋值为空~ 🍓🍓🍓**

## `this` 的遗留问题

**`this` 是当前 `function` 被定义的作用域**

```js
let hd = {
  user: "GL",
  get: function () {
    return function () {
      return this;
    };
  },
};
let a = hd.get();
console.log(a());
// `window` 因为 `a` 在全局执行的 所以这里的 `this` 就指向 `window` 了
```

**解决方法：**

**1 - 箭头函数 ` () => {}`**

**2 - 在外部定义一个变量保存 `this` - `e.g: let self = this;`**
