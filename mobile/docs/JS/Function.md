# `JS` - 函数

> `JS` 使用关键字 **`function`** 定义函数。
>
> 函数可以通过声明定义，也可以是一个表达式。

## 函数声明

👇 函数声明的几种方式。

- **`let gl = new Function('title', 'console.log(title)');`**

- **`function gl() {};`**

- **`let gl = function() {};`**

- ```js
  let obj = {
    setUsername: function () {},
    getUsername() {},
  };
  ```

## 全局函数定义

```js
function a() {}
window.a; // 这样就可以访问到
// 但是这样就有问题 因为可能会覆盖 `window` 里面的属性

// `var` 声明
var gl = function () {};
window.gl(); // `var` 声明的函数 会往 `window` 里面压入属性

// `let` 声明 - 不会往 `window` 里面压属性了
let gl = function () {};
// window.gl(); // 这样就会报错 `let` 声明的函数 就不会往 `window` 里面压了
gl(); // 可以通过 这样的方式来调用
```

## 匿名函数与函数的提升

```js
let gl = function () {}; // 使用匿名函数 赋值 给变量 这样是不会进行提升的
gl(); // gl() 写在 声明前 是会报错的~

gl(); // gl is not a function
var gl = function () {};
// `var`
// 来进行声明也是不会提升的 只是提升了定义 并没有提升赋值的函数 所以报错是 `gl is not a function`

show(); // show() 写在 声明之前也会可以进行调用的
function show() {} // 这样声明的 具名函数 是会提升到 语法的开头
show(); // 当然这样也可以
```

**`函数提升`在`变量提升`的前面, 且不会被`变量声明`覆盖， 但是会被`变量赋值`之后覆盖。** 🍓🍓🍓

```js
gl(); // 1 打印的是 1 并不会打印 2
// 因为 只是提升了gl变量 然后没有赋值。 所以会执行 具名函数
function gl() {
  console.log("1");
}
var gl = function () {
  console.log("2");
};
```

```js
function gl() {
  console.log("1");
}
var gl = function () {
  console.log("2");
};
gl(); // 2 此时会 从上往下 执行 然后打印2
```

**`函数`是对象（即引用类型）。**

+ 函数提升与变量提升的一个例子

  **`函数提升` 在 `变量提升` 的前面, 且不会被 `变量声明` 覆盖， 但是会被 `变量赋值` 之后覆盖。**

  ```js
  console.log(a); // f a() {console.log(10)}
  console.log(a()); // undefined - 这里 a 执行打印了10 然后输出 a() 没有return返回就是 undefined
  var a = 3;
  function a() {
    console.log(10);
  }
  console.log(a); // 3
  a = 6;
  console.log(a()); // a is not a function;
  // ------------------------ 原理 ------------------------
  var a = function () {
    console.log(10);
  };
  var a;
  console.log(a); // f a() {console.log(10)}
  console.log(a()); // 10 undefined -> 是因为函数没有return value
  a = 3;
  console.log(a); // 3
  a = 6;
  console.log(a()); //a() is not a function;
  ```

## 参数

### 形参与实参

**一般来讲实参的数量要和形参对应，默认参数的话就可以不对应了。**

```js
function sum(a, b) {
  return a + b;
} // a b 就属于形参
sum(1, 2); // 就属于 实参
```

### 默认参数 的使用技巧

**一般情况下 可选的默认参数都要放置到后边 然后让需要传递的值在前面进行传递**

```js
function sum(a, b = 2) {
  // 新版本 - 直接赋值 来当作默认参数 - 方法2
  // 老方法 - b的默认参数如下 - 方法1
  b = b || 2;
  return a + b;
}
```

### 参数的展开语法

```js
let gl = [1, 2, 3];
let [a, b, c] = [...gl]; // 赋值 - 在等号右边 - 那就是 `放`
let [b, ...a] = gl; // a就是[2, 3] - 赋值 - 在等号左边 - 那就是 `收`

// 在函数使用也是一样
// 🍓如果有多个参数的话, 展开语法一定是在后边的 展开来接受剩余的
function abc(...args) {
  // args 这样就是 数组了 就可以调用数组的方法进行运算了
}
```

### 函数参数与`arguments`

**函数传递参数 一般来讲 是不受类型约束的。**

**以前版本不确定传参个数 - 使用 `arguments` 就可以知道传递参数的内容，`arguments.length` 可以看到传递参数的个数。**

**在最新的版本的函数中，我们可以使用 `...语法` 来接受函数。**

### 参数传递

+ **按值传递** - 函数形参的值是调用函数所传入实参的副本。

+ **按引用传递** - 函数形参的值是调用函数所传入实参的引用。- **这就意味着在里面修改之后，外面也会修改。**

```js
let a = "a",
  obj = { x: 1 },
  obj1 = { x: 2 };
function fn(x, y, z) {
  x = "b";
  y = { a: 1 };
  z.x = 3;
}
fn(a, obj, obj1);
console.log(a); // 'a'
console.log(obj); // { x: 1 }
console.log(obj1); // { x: 3 }
```

## 箭头函数

因为箭头函数没有自己的名字所以在写递归的时候不太方便， ⚠️⚠️⚠️ 可以用函数表达式解决。

**根据 `this` 的使用场景来判断使用`箭头函数` 还是 `普通函数`。 ⚠️⚠️⚠️**

### 与普通函数的**区别**。👇

- **没有自己的`this、super、arguments、new.target`，他们是离 该箭头函数最近的非箭头函数的绑定。**

- **不能使用`new`来调用。**

- **没有原型对象。**

- **内部的`this`无法改变， 无法通过`apply、call、bind`来改变。**

- **形参名称不能重复。**

### **语法**

+ **参数 => 函数体**

  ```js
  var fn = (val) => val * 2; // 直接返回 🍓
  var fn = (a, b) => a * b; // 有两个参数
  var fn = () => "john"; // 只有返回值
  var fn = () => {}; // 没有返回没有参数
  var fn = (id, name) => ({ id, name }); // 直接返回对象 用括号括起来~🍓
  ```

- **宽松绑定**

  `=>` 的优先级比较低 👇

  ```js
  const f = (x) => x % 2 === 0; // f(1)-false \ f(2)-true
  // 如果要想提升优先级的话，就需要添加大括号了
  ```

- 函数体为表达式【生成值】或者 函数体为语句【 执行语句 】不需要大括号包裹。

  ```js
  const f1 = (x) => console.log(x); // 表达式
  const f2 = (x) => typeof x; // 表达式
  const f3 = (x) => {
    throw x;
  }; // 语句
  ```

- **返回对象的时候。⚠️~**

  ```js
  const f1 = x => ({ bar: 123 }); // 当作整体返回  { bar: 123 }
  const f2 = x = > { bar: 123 }; // 也返回 但是是 `undefined`
  ```

### 使用场景

+ **箭头函数没有自己的`this`**

  **箭头函数 使用`bind call apply`，没有效果的 也改变不了 `this` 指向 。🍓🍓🍓**

  ```js
  let obj = {
    name: "John",
    getName() {
      setTimeout(function () {
        console.log(this.name);
        // 这样打印呢 this 就是 window
        // 解决 - 绑定 this
        // - setTimeout 上定义 let that = this;
        // - setTimeout(function() {}.bind(this), 1000);
        // - setTimeout(() => {}, 1000)
  
        // 🍓 箭头函数中的this 就是 计时器函数 所在作用域函数的this 就是 getName 的this
        // 🍓 箭头函数 使用 bind call apply ，没有效果的 也改变不了 this 指向
        // 🍓 异步点击的时候 或者 addEventListener 绑定事件的时候 也可以适用 箭头函数
      }, 1000);
    },
  };
  obj.getName();
  ```

+ **不能使用`new`来调用。**

  ```js
  let People = () => {};
  let person = new People(); // TypeError People is not a constructor
  ```

+ 可以简化操作数组的写法。

+ 使用箭头函数创建立即执行函数。

  ```js
  ((a) => {
    // use strict
    console.log(a); // 箭头函数 和 严格模式 没有关系 怎么使用都行
  })(1);
  ```

## 递归

**在函数中调用函数本身。**

### 使用场景

+ **阶乘**

  ```js
  function factorial(num) {
    return num === 1 ? 1 : num * factorial(--num);
  }
  factorial(5); // 120
  ```

+ **斐波那契数列`1 1 2 3 5 8...`**

  ```js
  function fib(n) {
    if (n === 1 || n === 2) {
      return 1;
    }
    return fib(n - 1) + fib(n - 2);
  }
  fib(10);
  ```

+ 递归求和与 `...`点语法注意事项

  ```js
  // 归并
  let sum = [1, 2, 3].reduce((a, b) => a + b);
  console.log(sum); // 6
  
  // 递归 & 点语法
  function sum(...args) {
    console.log("args", args); // [1, 2, 3] - [1, 2]
    if (args.length === 0) return 0;
    return args.pop() + sum(...args); // 这里也使用 点语法 是保证参数一致 🍓🍓🍓~
    // 不然传递过去点就是个数组  然后展开之后就是 数组嵌套了 ...
  
    // 优化成一行
    return args.length === 0 ? 0 : args.pop() + sum(...args);
  }
  console.log(sum(1, 2, 3)); // 6
  ```

+ **递归实现倒三角**

  **注意 `++i` 和 `i++` 的 先赋值后操作还是先操作后赋值，以防写递归的时候造成死循环。**

  ```js
  function star(sum) {
    return sum ? document.write("*".repeat(sum) + "<br />") || star(--sum) : "";
  }
  star(5);
  /**
   *****
   ****
   ***
   **
   *
   */
  ```

## 回调函数

**在其他函数里面调用的函数。**

### 使用场景

+ **同步回调**

  ```js
  function foo(n, func) {
    ++n;
    func(n);
  }
  foo(1, function (n) {
    console.log(n);
  }); // 2
  
  const items = [1, 2, 3];
  const copy = [];
  items.forEach((item) => copy.push(item));
  ```

+ **异步回调**

  ```js
  function foo(n, callback) {
    setTimeout(() => {
      ++n;
      callback(n);
    }, 1000);
  }
  foo(1, function () {
    console.log(n); // 2
  });
  ```

## `this`

**`this` 其实就是当前对象的引用的意思。🍓**

> **全局环境中的`this`指向全局对象 (不管是 严格模式 还是 普通模式~)**

**`this`是当前`function`被定义的作用域。🍓**

**箭头函数使用`bind call apply`，没有效果的，也改变不了 `this` 指向。🍓🍓**

### 普通函数中的`this`

**普通函数中的 `this`， 取决于函数是如何被调用的。**

**如果函数作为普通函数使用`this`指向全局，没有返回值的话就是 `undefined`。🍓**

```js
function C() {
  console.log(this); // Window
}
let o = C();
console.log(o); // undefined
```

- **简单调用**

  ```js
  function f() {
    // 'use strict' 这里如果使用 严格模式 this 就是 undefined
    console.log(this); // Window
  }
  fn();
  ```

  > `'use strict'` - 这里如果使用 严格模式 `this` 就是 `undefined`

- **对象方法调用**

  ```js
  let obj = {
    f() {
      console.log(this); // obj
      function g() {
        console.log(this); // Window 这里是自调用 所以是window
      }
      g(); // 修改可以使用 call apply bind 都可以
    },
  };
  obj.f();
  ```

- `call` & `apply` 来修改 `this` 指向。

- **构造函数调用**

  ```js
  function C() {
    this.a = "a";
    // new操作后，相当于加了个 return this
  }
  let o = new C();
  console.log(o.a); // 'a';
  ```

  ```js
  let obj = {
    a: "b",
  };
  function C() {
    this.a = "a";
    return obj;
  }
  let o = new C();
  console.log(o.a); // 'b'
  console.log(o === obj); // true
  ```

+ 通过常量来改变 `this` 指针。

  ```js
  // 以前的方法
  const self = this; // 常量来保存 当前的 `this`
  ```

### `map`等方法&`this`

+ **`map`第一个回调函数的第三个参数是数组本身，也可以通过改变数组本身来编写代码，不需要返回新数组。**

  ```js
  // `map`
  let a = arr.map((value, index, array) => {}); // return 出去让 a 接收也可以
  arr.map((value, index, array) => {
    array[index] += 10;
  }); // 或者 直接改变 原数组 也可以 然后 用原数组 来进行运算
  ```

+ **`map` 的第二个参数 是可以指定 `this` 的定义的，如果使用普通函数，那我们可以指定一个父级`this`。🌊**

  ```js
  let user = {
    list: [1, 2, 3],
    show: function () {
      const self = this; // 保存this
      return this.list.map(
        function (value) {
          console.log(this); // {a: 1}
        },
        { a: 1 }
      ); // map 的第二个参数可以指定 this 对象
      // , this) // 🍓 这里指定this 需要普通函数 🍓
      // 所以我们就不需要在 外部保存this了 只需要 定义接受就可以
    },
  };
  user.show();
  ```

### 箭头函数中的`this`

**箭头函数里面的 `this` 就是指向当前作用域的上下文，一般就是当前父级的 `this`。**

```js
let user = {
  list: [1, 2, 3],
  show: function () {
    return this.list.map((value) => {
      console.log(this); // {list: Array(3), show: ƒ} - 就是 user 了
    });
  },
};
user.show();
```

+ **某些场景下的箭头函数就有点陷阱了。**

  **结合场景 大量使用当前对象就是 `function`。**

  **大量使用父级就是 `()=>{}`。**

  ```js
  button.addEventListener(function () {
    console.log(this);
  }); // 这里的this 就是 当前 button
  button.addEventListener(() => {
    console.log(this);
  }); // 这里的this 上下文，父级this了
  // 结合参数定义 或者 变量保存 或者 定一个特殊方法(handleEvent)点击的话回去找这个方法
  // 结合场景 大量使用当前对象就是 function 大量使用父级就是 ()=>{}
  button.forEach(function (ele) {
    ele.addEventListener("click", () => {
      console.log(this); // 因为这里使用了 箭头函数 就会去找上一级的 this 定义
      // 上一级 是一个普通函数 那 this 就是 window 了 - 解决办法就是 forEach 也变成箭头函数 - ⚠️
    });
  });
  ```

## 函数的双重职能

- **函数内部有两个不同的方法 `[[Call]]` 和 `[[Constructor]]`。**

- **当使用普通方法调用函数的时候 `[[Call]]` 会被执行**

- **当使用构造函数调用时` [[Constructor]]`方法会被执行， 会创建一个`new Tager`对象去执行函数体**

  **箭头函数的调用 例外。**

  ---

+ 判断函数是以何种方式被调用的 🍓🍓~

  ```js
  function Person(name) {
    if (this instanceof Person) {
      this.name = name;
    } else {
      throw new Error("You must use new with Person");
    }
  }
  let person = new Person("John");
  let person2 = Person("John"); // Error
  ```

+ **`new.target`元属性**

  **当以构造函数的形式调用函数时，`new.target`指向的是构造函数本身。**

  ```js
  function Person(name) {
    if (new.target === Person) {
      this.name = name;
    } else {
      throw new Error("You must use new with Person");
    }
  }
  let person = new Person("John");
  let person2 = Person("John"); // Error
  ```

+ **构造函数 👆 Vs 工厂模式**

  ```js
  function Person(name) {
    let obj = this;
    if (new.target !== Person) {
      obj = new Person();
    }
    obj.name = name;
    return obj;
  }
  let person = new Person("John");
  let person2 = Person("John");
  ```

## 函数的基本应用

### `apply` - `call` - `bind`

```js
function User(name) {
  // 构造函数
  this.name = name;
}
let gl = new User("gl");
console.log(gl);
let newGl = { age: 18 };
User.call(newGl, "新的名字"); // cool ~ 这样就能生出一个新的对象 - 🍃
console.log(newGl); // {age: 18, name: "新的名字"}
```

**如果没有指定传递的`this`可以传递`null`，来进行占位一般是`null`也默认指向`window`。**

**参数可选可以不传递, 不传递就是只改变`this`去执行。**

+ **`call` - `apply` 的区别**

  **在修改 `this` 指针的情况下，也会立刻执行函数。**

  - **`call` 传递参数 就是一个一个的参数。（逗号隔开就行）**
  - **`apply` 传递参数 就是一个数组。（之后也会自动分散进行传参）**

  **就看参数传递的多少 和 传递参数的类型 - 来决定使用 `call` 和 `apply`。**

  + **`call` || `apply` 来实现构造函数的继承。**

    ```js
    function Request() {
      this.get = function (params) {
        let str = Object.keys(params)
          .map((k) => `${k}=${params[k]}`)
          .join("&");
        return `https://www.vxecho.cn?${this.url}/${str}`;
      };
    }
    function Getname() {
      this.url = "name/lists";
      Request.call(this); // 参数 可选可以不传递 也可以只改变this去执行
    }
    let a = new Getname();
    console.log(a.get({ id: 1 })); // https://www.vxecho.cn?name/lists/id=1
    ```

  + `call` || `apply` 实现展开面板操作

    ```js
    // html & css 代码省略
    function panel(i) {
      let dds = ducoment.querySeletorAll("dd");
      dds.forEach((dd) => dd.setAttribute("hidden", "hidden"));
      dds[i].removeAttribute("hidden");
    }
    document.querySelectorAll("dt").forEach((dt, i) => {
      dt.addEventlistener("click", () => panel.call(null, i)); // 如果只传递参数 不改变this 就可以用 null 来进行占位
      // 虽然是为了展示语法 但这样写更加清晰
    });
    ```

+ **`bind`**

  ```js
  function a() {}
  let b = a.bind({}, 1);
  b(3, 4);
  // 如果函数需要两个传递参数 就会依次查找。
  // 这样的传递参数就是 1 3 剩下的 4 参数就没有什么用了。
  // 如果需要一个 3 4 就没什么用了，就是依次查找的一个关系 🍓~
  ```

  **和 `call` `apply` 作用是一样的，`call` && `apply` 会立刻执行。**

  **`bind` 不会立即执行，`bind` 绑定完事之后会得到一个新的函数。 🍓**

  > **如果想要执行呢，就后面加一个 括号就执行了。**

  ```js
  function show() {
    console.log(this.name);
  }
  console.log(show.bind({ name: "gl" })); // f show() { console.log(this.name); }
  console.log(show.bind({ name: "gl" })()); // gl
  ```

  ```js
  let a = function () {};
  let b = a;
  console.log(a === b); // true
  b = a.bind(); // 因为他会重新开辟空间 赋值一份函数 得到一个新的函数
  console.log(a === b); // false
  ```

  + `bind`的传参

    **如果`bind`参数和执行函数都传递了参数优先执行 `bind()` 参数的传递参数。**

    ```js
    let a = b.bind({}, 1, 2); // 可以在绑定的时候传递参数
    
    let newA = b.bind({});
    newA(1, 2); // 也可以在 调用的时候传递参数
    ```

**`bind` 得到一个新函数 🍓，就是只改变 `this` , 然后之后选择调用使用最为合理。**

> 或者是只改变 `this` 不调用的情况的下执行。

```js
setInterval(
  function () {
    // 使用这种方式 改变 this  当然直接一点就是 使用 箭头函数 来改变就行
  }.bind(this),
  1000
);
```

### 立即执行函数 `IIFE`

**`(function() {})();` - 这里使用`let`变量就是自己的局部变量~**

> 可以在函数里面添加`'use strict'`严格模式 然后实现自己的业务逻辑代码

**`(function() {}());` - 立即执行函数的变体**

**`!function() {}();` - 还可以用 `+ - ~ void new`**

**`(function(win) {})(window);` - 不推荐在立即执行函数中直接引用全局变量 可以通过参数传入**

- **`ES6`不需要`IIFE`， 使用块级作用域 就可以解决**

  **或者给`sciprt`标签加一个`module`属性， 他就是块级代码。**

  ```js
  {
    let page = {
      init() {
        console.log(666);
      },
    };
    page.init();
  }
  ```

+ **解决冲突**

  当同时引入了多个文件有两个同样的函数名，**`模块化-类`的方式可以解决。 - 推荐 ✨✨✨**

  - **以前的解决方式 - 立即执行函数。**

    ```js
    // 第三方包 - 我们使用 `立即执行函数` 包裹起来 起一个别名
    (function (window) {
      function gl() {}
      wondow.js = { gl };
    })(window);
    function gl() {}
    // 这样就可以做到防止方法 重名了
    js.gl();
    gl();
    ```

  - **还有一种方式，使用 `let` 来定义。**

    ```js
    // 因为 `let` 是 块级 出了 块级 就访问不到了
    {
      let gl = function () {};
      window.js = { gl };
    }
    function gl() {}
    js.gl();
    gl();
    ```


### 闭包

**闭包是指 访问了另外一个 作用域中的变量的函数。**

```js
function foo() {
  var a = 1;
  function bar() {
    return ++a;
  }
  bar();
}
foo();
```

**可以通过闭包来解决 异步`for`循环的问题 或者 异步点击`dom`元素啥的。**

```js
function foo() {
  for (var i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i);
    }, 0);
  }
}
foo();

// 使用闭包 或者 let 都可以解决
function foo() {
  for (var i = 0; i < 10; i++) {
    function bar(j) {
      setTimeout(() => {
        console.log(j);
      }, 0);
    }
    bar(i);
  }
}
foo();
```

- **闭包 + 立即执行函数的应用：封装（信息隐藏）🍓**

  ```js
  let obj = {
    name: "John",
    getName() {
      return this.name;
    },
  };
  console.log(obj.getName());
  
  // 阻止用户直接访问obj.name, 需要通过 obj.getName() 修改如下👇
  let obj = (function () {
    let name = "John";
    return {
      getName() {
        return name;
      },
    };
  })();
  ```

### 柯里化

**柯里化是把接收多个参数的函数变换成接收一个单一参数的函数，并且返回接收余下参数以及返回返回的结果的 新函数技术。**

- **需求: 实现生成唯一`id` 的函数**

  1. 可以传入一个 起始`id`， 之后返回的`id` 要从这个值开始算。
  2. 还可以传入一个数字，返回的值是 上次的`id` 加上这个数字。如果没有传入数字，就返回上次的`id`加上`1`。

  > 普通实现

  ```js
  let id = 0;
  function getId(step, startId) {
    // 加一个 id 是否为0的判断
    // 保证只有第一次调用传入的 startId 是有效的
    if (startId && id === 0) {
      id = startId;
    }
    id += step || 1;
    return id;
  }
  // 第一次调用 传入的 起始值有效
  getId(12, 1000);
  // 第二次调用 传入的 起始值有效
  getId(15, 1000);
  ```

  > 柯里化实现

  ```js
  function initId(startId) {
    let id = startId || 0;
    return function (step) {
      // 闭包
      id += step || 1;
      return id;
    };
  }
  let genId = initId(1000);
  genId(12);
  genId(15);
  ```

### 函数式编程

**接收函数作为参数。**

```js
function not(fn) {
  // 接收 函数作为 参数 执行结果 取反并返回。
  return function () {
    var result = fn.apply(this, arguments);
    return !result;
  };
}
var even = function (x) {
  return x % 2 === 0;
};
var odd = not(even);
var result = [1, 1, 3, 3, 5].every(odd);
console.log(result); // true
```

### 尾调用优化

> `ES6`要求 `JS` 引擎对尾调用做出优化。

**在执行某个函数的时候，如果最后一步是一个函数调用，并且被调用函数的返回值，直接被当前函数返回，就成为 尾调用`(Tail Call)`**

其实就是 - **某个函数的最后一步是调用另一个函数。**

```js
function f() {
  return g(); // Tail Call
}
```

- **尾调用的要求**

  - 尾调用不需要访问当前`stack / frame`中的变量，也就是**没有闭包。**
  - 返回到尾调用处时，**不能再做其他事情。**
  - **尾调用的返回值，直接返回给调用它所在函数的调用者。**

  ```js
  function g(x) {
    return x;
  }
  
  function f1(x) {
    g(x); // 不是尾调用 没有return
  }
  
  function f2(x) {
    return 1 + g(x); // 尾调用的时候 做了 其他的事情
  }
  
  function f3() {
    let num = 1;
    let g = () => num;
    return g(); // 闭包了 使用了 外部的变量
  }
  // f1 f2 f3 都不是 尾调用函数
  ```

- **我理解的尾调用函数**

  - **就是优化了存放栈中的 一个流程，少了一次入栈和出栈的过程。**
  - **执行到尾调用函数的时候`return g(x);`就回去先销毁 之前的 存放在 栈的一个信息，然后直接替换成 `g(x)` 的返回结果**

  - **因为尾调用 没有用到外面的变量，也不参与运算，还是可以进行优化的**

### 尾递归

> **递归时，如果函数调用函数本身时是一个尾调用，则称为 尾递归。**

**函数调用自身，称为递归。如果尾调用自身，就称为尾递归。**

```js
function f(n) {
  if (n === 1 || n === 0) return 1;
  return f(n - 1) + f(n - 2);
} // 不是一个 尾递归， 因为最后不是一个尾调用 因为做了其他的事情~
console.log(f(10)); // 55
console.log(f(100)); // 堆栈溢出  直接卡死
```

- **修改成尾递归**

```js
function fibonacci(n, a = 1, b = 1) {
  if (n === 0) {
    return 1;
  }
  if (n === 1) {
    return b;
  }
  return fibonacci(n - 1, b, a + b); // f(n - 1) + f(n - 2); 这个逻辑呢 就通过 a+b 来解决了~
}
fibonacci(100); // 354224...
fibonacci(10000); // Infinity 就不会有 堆栈溢出的问题了
```

- **尾递归前后对比**

```js
// 尾递归之前
function factorial(n) {
  if (n == 1) return 1;
  return n * factorial(n - 1);
}

// 尾递归之后
function factorial(n, total) {
  if (n == 1) return total;
  return factorial(n - 1, n * total);
}
```

> **我理解的是 用变量去保存上一次的结果，然后表达式的一边去 递减或者累加 另外一边去 执行运算结果。空间复杂度降低 🍓**

尾递归的实现，往往需要改写递归函数，**确保最后一步只调用自身**。做到这一点的方法，**就是把所有用到的内部变量改写成函数的参数**。 如 👆 所示

```js
// 增加一个函数 来 使得👆函数 参数传递正常
function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

function factorial(n) {
  return tailFactorial(n, 1);
}

factorial(5); // 120
```

```js
// 使用柯里化 来 使得👆函数 参数传递正常
function currying(fn, n) {
  return function (m) {
    return fn.call(this, m, n); // 😯神奇~ 还利用了闭包
  };
}

function tailFactorial(n, total) {
  // 尾调用 - 尾递归
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

const factorial = currying(tailFactorial, 1);

factorial(5); // 120
```

```js
// 使用ES6默认值做法 来使得👆函数 参数传递正常
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5); // 120
```
