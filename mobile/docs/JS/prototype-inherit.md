# `JS` - 原型与继承

> 所有的 `JavaScript` 对象都会从一个 `prototype`（原型对象）中继承属性和方法。

## 对象的原型（父级）

### 创建一个没有原型的对象

```js
let gl = Object.create(null, { name: { value: "gl" } });
gl; // {name: "gl"}
```

- **`Object.create` 创建对象的 参数 以及 返回值 介绍**

  **`params - 1`新创建对象的原型对象。**

  **`parmas - 2_可选` 参数如下 和 `Object.defineProperty()` 一致**

  ```js
  {
    configurable: true | false(默认) // true 表示描述符类型可修改 并 对应对象属性可删除
    enumerable:  true | false(默认) // true 表示可枚举   in 操作符可查到
    value: undefined(默认) // 可以是任何js有效值 属性关联的值
    writable: true | false(默认) // true 表示 对应对象属性的值可以被修改
    get: undefined(默认) | function() // getter函数 如果没有 getter 则为undefined。函数返回值将被用作属性的值。
    ser: undefined(默认) | function() // setter函数 如果没有 setter 则为undefined。函数将仅接受参数赋值给该属性的新值。
  }
  ```

  **`return - value` 一个新对象，带着指定的原型对象和属性。-- 指定`null` 则没有原型**

- **我们每次 字面量 创建 对象的时候，相当于 `new Object()` 操作**

  ```js
  let a = {},
    b = {};
  Object.getPrototypeOf(a) === Object.getPrototypeOf(b); // true
  a.__proto__ === b.__proto__; // true
  // 因为他们的 [[prototype]] 都是 Object.prototype
  a.__proto__ === Object.prototype; // true
  b.__proto__ === Object.prototype; // true
  ```

### 对象 和 函数之间的区别 - 仅原型

- **对象只有 `__proto__` (`[[prototype]]`) 没有 `prototype` , `prototype`是函数独有的** 。

### 自定义原型对象

```js
let a = { name: "gl" };
let p = {
  name: "parent",
  show() {
    console.log("parent method: " + this.name);
  },
};
a.__proto__ === Object.prototype; // true 原先是 true

Object.setPrototypeOf(a, p);
a.__proto__ === Object.prototype; // false

Object.getPrototypeOf(a); // p
a.__proto__ === p; // true
p.__proto__ === Object.prototype; // true
```

### 函数(对象)的原型

#### `__proto__` && `prototype`

- **`__proto__` (`[[prototype]]`) 是原型函数为对象使用的时候 调用的 `[[prototype]]`**

- **`prototype` 是原型函数作为函数使用的时候 调用的 `prototype`**

  ```js
  function User() {}
  // User有两个父级
  // 一个 __proto__ 服务于函数对象(**服务于他自己**)的
  // 一个是服务于函数实例化的对象的 prototype
  let gl = new User();
  
  // 因为 User.prototype 的父级是对象 所以在往上找就是 __proto__
  gl.__proto__ === User.prototype; // true
  User.prototype.__proto__ === User.__proto__.__proto__; // true
  gl.__proto__.__proto__ === Object.prototype; // true
  Object.prototype.__proto__ === null; // true
  // __proto__ 向上不断查找的过程 就是整条原型链了。
  ```

#### `constructor`

- **`constructor` 构造器 是 函数原型上查找自己的。**

  ```js
  function User() {}
  // User.prototype 有两个
  // 一个 __proto__ 来去找 原型链
  // 一个 constructor 来去找 自己
  let gl = new User();
  
  // 因为 gl 是 new 出来的实例 对象，所以只能使用 __proto__ 来查找
  gl.__proto__.constructor === User; // true
  User.prototype.constructor === User; // true
  gl.__proto__.constructor === User.prototype.constructor; // true
  
  // FIXME: 如果想要在原型上写多个方法属性 可能会想到 使用字面量的方式
  User.prototype = {
    // 字面量之后 构造器指向就 丢失了
    // 这样就相当于开辟了一块新空间 - 重新指向了 所以原来 prototype 里面的 constructor 就没有了
    // 需要将 构造器指回去，保证有联系
    constructor: User,
    show() {
      console.log(this.name);
    },
  };
  ```

#### 原型链检测之 - `instanceof` （一个构造函数的 prototype 是否是一个对象的长辈）

- **`instanceof` 运算符用来判断 一个构造函数的`prototype`属性所指向的对象。是否存在另外一个要检测的对象的原型链上。**

  ```js
  function Person() {}
  var p = new Person();
  console.log(p instanceof Person); //true
  ```

#### `isPrototypeOf` 明确来检测 一个对象是否在另一个对象的原型链上

- **`isPrototypeOf` 一个对象是否是一个对象的长辈**

  ```js
  let a = {};
  let b = {};
  b.isPrototypeOf(a); // false
  Object.prototype.isPrototypeOf(a); // true
  // 因为 b.__proto__ === Object.prototype
  b.__proto__.isPrototypeOf(a); // true
  Object.setPrototypeOf(a, b);
  b.isPrototypeOf(a); // true 或者理解为一个对象(b)是否是一个对象(a)的长辈
  ```

#### `in` 和 `hasOwnProperty` 的属性检测的差异

- **`in` 会检测 原型链 中一切可枚举的属性。**

- **`hasOwnProperty` 只会检测 自身属性。 （是否 挂载 在自身上）**

  ```js
  let a = { url: "baidu.com" };
  let b = { name: "gl" };
  Object.prototype.web = "hdcms.com";
  console.log("web" in a); // true - 'in'会检测原型链
  Object.setPrototypeOf(a, b);
  console.log("name" in a); // true - 'in'会检测原型链
  
  // 如果某一时候 指向操作当前对象 不检测原型链 hasOwnProperty
  console.log(a.hasOwnProperty("url")); // true // hasOwnProperty 只检查自己
  console.log(a.hasOwnProperty("web")); // false
  
  // FIXME: 使用工具自动生成 就会有这个 hasOwnProperty
  for (const key in a) {
    console.log("key1", key);
    if (a.hasOwnProperty(key)) {
      console.log("key2", key);
    }
  }
  // key1 url - key2 url - key1 name - key1 web
  ```

#### 使用 `call` && `apply` 借用原型链

```js
const content = {
  data: [1, 2, 55, 34, 22],
};
Object.setPrototypeOf(content, {
  max(data) {
    let sortArr = data.sort((a, b) => b - a)[0];
    return sortArr;
  },
});
content.max(content.data); // 55;

const test = {
  lessons: {
    js: 87,
    php: 78,
    node: 88,
  },
};
Object.values(test.lessons); // FIXME: 因为这里需要传递的参数数组
// apply 传递进去之后 是按照一个一个分开处理的 还是单个参数
// 比如 apply(null, [1, 2, 3]) 但是进去看参数 还是 (data1 = 1, data2 = 2, data3 = 3)

// 所以需要改成call 那么第一个参数就是传递进去的数组了~
content.max.call(null, Object.values(test.lessons)); // 88

// -----------------------------------------------------------------
// 优化调用方法
const gl = {
  data: [1, 2, 55, 34, 22],
};
console.log(Math.max.apply(null, gl.data)); // 55 因为需要传递多个参数 现成的数组 所以使用 apply 就可以了

const test = {
  lessons: {
    js: 87,
    php: 78,
    node: 88,
  },
};
console.log(Math.max.apply(null, Object.values(test.lessons))); // 88
console.log(Math.max(Object.values(test.lessons))); // 这样传递进去的就是一整个数组 所以调用的时候 ⚠️注意一下就行
console.log(Math.max(...Object.values(test.lessons))); // 88 这样就可以了
```

#### 伪数组借用数组方法

```js
{/* <button class="red">我是红色</button>
<button>我是默认</button> */}
filter -> Array.prototype.filter;
let btns = document.querySelectorAll('button');
btns = [].filter.call(btns, item => { // Array.prototype.filter
  item.hasAttribute('class');
})
btns[0].innerHTML // 我是红色
```

#### `Object.create`和`__proto__`

**`Object.create`如上所述**

```js
const person = {};
const me = Object.create(person); // 是可以做到深拷贝的 并且它的父级就是 person ⚠️
me.__proto__ === person; // true
```

**使用 `setPrototypeOf` 来替代 `__proto__`**

```js
Object.getPrototypeOf(gl); // 获取 相当于 gl.__proto__
Object.setPrototypeOf(gl, user); // 设置 相当于 gl.__proto__ = user
```

## 继承

**继承是原型的继承 而不是改变构造函数的原型**

```js
// 这样会造成 我往原型里面添加方法
// 一个是 重复的会覆盖掉
// 另一个是 都是往 User.protptype 里面添加方法 指向已经改变了
Admin.prototype = User.Prototype; // ❌

// ✅
function User() {}
User.prototype.show = function () {
  console.log("show method");
};
function Admin() {}
Admin.prototype.__proto__ = User.prototype; // 方法一

// 这里 User.prototype 就自动挂载在了 Admin.prototype 上了。
Admin.prototype = Object.create(User.prototype); // 方法二
// 这样就 有顺序要求了 因为重新指向了 添加方法前后顺序就需要遵循了
```

### 继承对于 新增对象的影响

```js
function Admin() {}
let a = new Admin(); // 这里 a 指向的 原来 Admin.prototype
Admin.prototype = Object.create(User.prototype); //这里重新指向了 但是 a.__proto__ 还是指向原来的  所以最好还是 方法一 去实现 函数的继承或者 class
Admin.prototype.role = function () {
  console.log("Admin role method");
};
a.role(); // 哪怕是在这里执行也是会报错的~
// 所以就会报错了
```

### 继承对于 `constructor` 的影响

```js
let Hd = function () {};
let obj = new Hd();
console.log(obj.__proto__.constructor === Hd); // true -- Hd.prototype.constructor === Hd

// 都是重新赋值的 指向丢失 开辟新空间
Admin.prototype = Object.create(User.prototype); // 这样定义之后就把 constructor 就丢失了
Admin.prototype.constructor = Admin; // 需要手动指向一下
```

- **禁止 `constructor` 被遍历 ⬆️ 接着上面的说**

  ```js
  Object.getOwnPropertyDescriptor(Admin.prototype.constructor); // 发现 enumerable 为true
  // for... in  是可以遍历到的
  // 所以我们定义的时候需要 这样定义
  Object.defineProperty(Admin.prototype, "constructor", {
    value: Admin,
    enumerable: false, // 禁止被遍历
  });
  ```

### 方法重写 与 父级属性访问

```js
function User() {}
User.prototype.show = function () {
  console.log("user.name");
};
User.prototype.site = function () {
  return "郭霖";
};

function Admin() {}
Admin.prototype = Object.create(User.prototype);
Admin.prototype.constructor = Admin;
Admin.prototype.show = function () {
  // 如果不想用父级show 那么就自定义 然后就近原则
  // User.prototype. ... 就可以访问到父级属性
  // ⚠️ 是可以重新写 也可以使用 父级方法或者属性的 帮助重写新的方法
  console.log(User.prototype.site() + "admin show");
};

let gl = new Admin();
gl.show();
```

### 面向对象的多态

```js
for (const obj of [new Admin(), new Member()]) {
  obj.show(); // 这样就各自调用各自的原型 上的show方法

  // 如果没有多态 那就是 showAdmin() showMember()...这样实现了
  if (obj instanceof Admin) {
    obj.showAdmin();
  }
}
```

### 使用工厂函数 封装继承

```js
function extend(sub, sup) {
  // sub-补充 替代 sup-超级 基类
  sub.prototype = Object.create(sup.prototype);
  Object.defineProperty(sub.prototype, "constructor", {
    value: sub,
    enumerable: false,
  });
}

extend(Admin, User);
let gl1 = new Admin("郭霖", 18);
gl1.show(); // 郭霖 18
```

### 对象工厂派生对象并实现继承

```js
function admin(name, age) {
  // instance - 例子 建议的意思
  const instance = Object.create(User.prototype);
  User.call(instance, name, age);
  return instance;
}
let gl = admin();
gl.show();
```

**互相之间没有关系的就不需要继承了，继承的话就继承一个就可以了 🍓**

### 使用 `mixin` 实现多继承 - 混合功能

```js
// 把方法都修改为对象 方法只是对象的一个属性
// 定义一些功能对象 用到的时候呢 把他们的属性合并到原型里面就可以了
Admin.prototype = Object.assign(Admin.prototype, Request, Credit);

// mixin的内部继承与super关键字
// super // this.__proto__   super 是指我当前这个类的原型(父级) 原型链的 都可以拉下来
const a = {
  __proto__: b,
  show() {
    // super - this.__proto__  那就是 b.name
    super.name;
  },
};
// super 只用来攀升原型 不改变 this 🍓

admin.show(); // super 也是指向的当前类的原型 就是 a 不是admin
let b = { name: "123" };
let bb = {
  // __proto__: b,
  show() {
    // super 不能单独打印 因为是关键字
    // super.toString() 目前相当于使用 Object.toString()
    console.log(super.toString());
  },
};
bb.show();
```

### 使用父类构造函数 初始化 属性

```js
// 简单版本
function User(name, age) {
  this.name = name;
  this.age = age;
}
User.prototype.show = function () {
  console.log(this.name, this.age);
};

// ...args 小技巧 这里的结构其实是将 类数组转成数组了
// 呃... 其实也不是 这里也是 为了收集多个参数
function Admin(...args) {
  User.apply(this, args);
}
Admin.prototype = Object.create(User.prototype);
Object.defineProperty(Admin.prototype, "constructor", {
  value: Admin,
  enumerable: false,
});
let gl = new Admin("郭霖", 18);
gl.show(); // 郭霖 18
```

## `for...of`

- `for...of` 允许你遍历 `Array`（数组）, `String`（字符串）, `Map`（映射）, `Set`（集合）等可迭代的数据结构

  ```js
  const iterable = ['mini', 'mani', 'mo'];
  // for...of  --- 'mini', 'mani', 'mo'
  
  const iterable = new Map([['one', 1], ['two', 2]]);
  for (const [key, value] of iterable) {
    console.log(`Key: ${key} and Value: ${value}`);
  }
  // Key: one and Value: 1 Key: two and Value: 2
  ...
  ```

## `Object.defineProperties` & `Object.defineProperty`

- `Object.defineProperties` & `Object.defineProperty` - 是**多个 & 一个 的关系**

  **----- 上下是对应的**

- `Object.getOwnPropertyDescriptor` & `Object.getOwnPropertyDescriptors` - 是**返回多个 & 返回一个的关系**

## `Other`

- **`new` 声明对象的时候 方法是放在 原型`prototype` 让其复用的**

  **如果给每个对象都配置这个方法 会造成 额外的内存开销**

  ```js
  function User(name) {
    this.name = name; // 属性是可以的 保存到各自的实例也是 独立的
    this.show = function () {}; // ❌
  }
  User.prototype.show = function () {}; // ✅ 定义在 父级 让其复用
  // 如果声明 多个方法 可以这样写
  User.prototype = {
    constructor: User, // ⚠️不要忘记 指向自身哦
    show() {},
    say() {},
  };
  ```

- **`this` 和 原型 是没有关系的**

- **不要滥用原型**

  - **不建议在 系统的原型 `Object.prototype` 中去追加方法。这样会导致原型属性不稳定。**

## `this` ~ 箭头函数

- **在箭头函数出现之前 🍓，每一个新函数根据它是被如何调用的来定义这个函数的`this`值**

  - **如果该函数是一个构造函数 `this`指针指向的是一个新对象**
  - **在严格模式下函数的调用。`this`指向 `undefined`**
  - **如果该函数是一个对象的方法， 则它的`this`指针指向这个对象**

- **箭头函数 不会创建自己的`this`，🍓 他只会从自己的 作用域的上一层继承 this。**

- **不绑定 `arguments` （如果要使用 `argument`可以使用 `rest`(解构)参数来代替 ）**

  ```js
  const foo (...args) = > {
  	console.log(arguments); // Uncaught ReferenceError: arguments is not defined
  	console.log(args); // [1, 2, 3]
  };
  foo(1, 2, 3);
  ```

### **箭头函数 不适用的 场景**

- **作为对象的属性**

  ```js
  const obj = {
    a: () => {
      console.log(this); // window
    },
  };
  ```

- **构造函数**

  ```js
  const Person = (name) => {
    // Uncaught TypeError: Person is not a constructor
    this.name = name;
  };
  const person = new Person("Jack");
  ```

- **作为原型方法**

  ```js
  function Person(name) {
    this.name = name;
  }
  Person.prototype.say = function () {
    console.log(this);
  }; // 指向实例
  Person.prototype.show = () => {
    console.log(this);
  }; // 指向 window
  const p = new Person("lala");
  p.say(); // { name: 'lala' };
  p.show(); // window
  ```

- **需要动态 `this` 的时候**

  ```js
  document.addEventListener(
    "click",
    () => {
      console.log(this); // window ⚠️ 这里就是看需求了
    },
    false
  );
  
  document.addEventListener(
    "click",
    function () {
      console.log(this); // #document对象
    },
    false
  );
  ```

### 延伸

- **函数下的 `prototype & __proto__` 方法调用**

  ```js
  function User() {}
  Object.prototype.show = function () {
    console.log("123");
  };
  User.show(); // 123
  
  function User() {}
  User.__proto__.show = function () {
    // 这个是 函数 独有的方法
    console.log("456");
  };
  User.prototype.show = function () {
    console.log("123");
  };
  User.show(); // 456 函数直接调用(作为对象)的时候 使用的是 __proto__
  let gl = new User();
  gl.show(); // 123  因为 gl.__proto__ === User.prototype
  ```

  **加深记忆**

  ```js
  let obj = {}; // new Object();
  obj.__proto__ === Object.prototype; // true
  
  let arr = []; // new Array()
  arr.__proto__ === Array.prototype; // true
  
  let str = ''; // new String()
  str.__proto__ ===  String.prototype; // true
  
  let reg = /a/i; // new RegExp()
  reg.__proto__ === RegExp.prototype; // true
  
  function User() {}; // new Function()
  User.__proto__ === Function.prototype; // true
  
  Function.prototype.__proto__ === Object.prototype // true
  String.prototype.__proto__ === Object.prototype // true
  ... // 因为... 万物皆对象 ...
  ```
