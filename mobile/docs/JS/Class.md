# `JS` - `Class`

> 在`ES6`中，`Class`(类)作为对象的模板被引入，可以通过 `Class` 关键字定义类。
>
> `Class` 的本质是 `function`。
>
> 它可以看作一个语法糖，让对象原型的写法更加清晰、更像面向对象编程的语法。

## 类的两种声明形式

```js
class User {
  constructor(name) {
    this.name = name;
  }
  // 方法之间是不需要加逗号的 哈哈哈
  // 声明方法 最好使用这种方法声明  function 和 ()=> 不推荐使用
  show() {
    return this.name;
  }
}
// typeof User // function
let gl = class {}; // 这样也是可以 声明的
// --- 下面的是函数形式 ---
function Animal(name) {
  this.name = name;
}
let a = new Animal("小黄");
```

## `JS`类内部的工作机制其实就是原型操作

- **`ES6` 的类，完全可以看作构造函数的另一种写法。**

```js
// 类其实就是 `构造函数` 的一个语法糖结构
class User {
  constructor(name) {
    // 为对象做属性初始值
    this.name = name;
  }
  show() {} // 打印发现  这个方法已经自动放置在 原型prototype 上面去了
}
User === User.prototype.constructor; // true
const u = new User();
// Object.getOwnPropertynames 方法返回一个由 指定对象的所有自身属性的属性名
// 包括 不可枚举
console.log(Object.getOwnPropertynames(u)); // ['name'];
console.log(Object.getOwnPropertynames(User)); // ['constructor', 'show'];
// --- 下面的是函数形式 ---
function User(name) {
  // 和上面的 constructor 一样 为每个对象独立存放属性的 - 初始化
  // 保证 每个实例对象的属性都是独有的 方法写在原型上是为了保证实例对象方法共用
  // 并且 prototype 一个对象定义 所有实例共用 不过多消耗内存
  this.name = name;
}
User.prototype.show = function () {};
User === User.prototype.constructor; // true
```

## 对象属性的声明

```js
class User {
  // ⚠️注意 这是对象属性的声明
  site = "站点i"; // 这样也可以声明 可以修改 👇changeSite
  constructor(name) {
    this.name = name;
  }
  changeSite(value) {
    this.site = value;
  }
}
let gl = new User("郭霖");
gl.changeSite("123"); // User {site: "123", name: "郭霖"}
gl.site = "aaa"; // User {site: "aaa", name: "郭霖"}
```

## `class` 声明的方法为什么不能遍历

- 添加到函数原型的方法`(User.prototype.show = function() {})` 如果没有设置具体特征(枚举)的时候是可以 `in` 遍历出来的

- 如果指向当前遍历的 那就是 `Object.hasOwnProperty(key)`

- **使用类的时候 会自动添加 不可枚举的 特性。**

  **⚠️ 推荐使用 严格模式下 编写代码**
  **`class` 编写代码 默认就是 严格模式 🍓🍓🍓**

## 静态属性 和 静态方法的使用

### **静态属性**

```js
function Web(url) {
  // 这个是 构造函数 生成对象的独有属性
  this.url = url;
}
// 因为函数是对象 所以可以点属性 分配给构造函数点属性 称为静态属性
Web.url = "123"; // 这个是函数对象点 是函数独有的属性 只属于函数 静态属性的使用
let w = new Web("333");

// --- 下面的是class形式 ---

class Web {
  url = "123"; // 这个是 实例属性
  constructor(name) {
    this.name = name; // 这个也是 实力属性 一般 这样定义的比较多
  }
  static url = "222"; // 这个是 类独有的 静态属性 了
  // Web.url 这个访问静态属性的方式
  // 这个 属性是所有对象 共用的 那就可以定义成 静态属性 因为只保存一份 保存在 类 当中
}
```

### **静态方法**

```js
function User() {} // 其实 动态方法 也是 this.show = function() {} 但这样就每个对象都创建了
User.prototype.show = function () {}; // 原先的动态方法 - 这样也是保存了一份 定义到 prototype 上了
User.show = function () {}; // 因为函数也是对象 这样定义函数的方法就是静态方法
User.__proto__.show = function () {
  console.log(this === User);
}; // 这样this 也是User

// --- 下面的是class形式 ---

class User {
  show() {
    console.log("动态方法");
  }
  static show() {
    console.log("静态方法"); // 推荐这样 使用类 就是为了更便捷和好识别
  }
}
User.__proto.show = function () {
  console.log("静态方法");
}; // 这样不推荐
```

```js
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  static create(...args) {
    // 展开语法 可以接受 不定数量的参数
    return new this(...args); // new this 是因为 this 就是声明 当前的 类
  }
}
let gl = User.create("郭霖", 19); // 静态方法的调用 - 然后创建 自身
console.log(gl); // User {name: '郭霖', age: 19}
```

### 静态属性 - 方法（练习）

```js
const data = [
  {
    name: "js",
    price: 87,
  },
  {
    name: "css",
    price: 98,
  },
];
class Lesson {
  constructor(data) {
    this.model = data;
  }
  price() {
    return this.model.price;
  }
  name() {
    return this.model.name;
  }
  // 或者也可以这样写 改成属性的方式
  get name1() {
    return this.model.name;
  }
  // 静态方法 我们不是对 单个对象 进行管理的,是 类独有，或者说 生成对象共有的方法。
  // 这样使用静态方法 就比较好了。
  static createBatch(data) {
    return data.map((item) => new Lesson(item)); // 遍历 然后返回 实例
  }
  static maxPrice(data) {
    return data.sort((a, b) => b.price() - a.price())[0]; // a.price() 是可以调用 实例方法的
  }
  static totalPrice(data) {
    // 如果不是对单个对象操作的 就可以使用静态方法
    return data.reduce((t, c) => {
      return t + c.price();
    }, 0);
  }
}
let obj1 = new Lesson(data);
console.log(obj1);
let Lessons = Lesson.createBatch(data); // 创建 课程 的集合
console.log("Lessons", Lessons);
console.log(Lesson.maxPrice(Lessons).name()); // css 这样是可以调用的 因为也是对象的方法 this.name()
console.log(Lesson.maxPrice(Lessons).name1); // css 如果改成访问器的名字 就可以不需要写括号了 本质上当作属性访问
console.log(Lesson.totalPrice(Lessons)); // 185 FIXME:  如果是对单个对象操作的话 就不能使用静态方法了
```

## 访问器 - `getters` / `setters`

- **有时候我们直接修改属性，可能会带来一些问题 🍓，这个时候我么可以使用访问器来访问。**
- **`getters` / `setters` 对属性的设置和获取 都是使用函数来进行操作的。**

```js
class A {
  constuctor(url) {
    this._host = url;
    this.data = {
      url
    };
  }
  set host(url) {
    // if (...) { ... }
    this.host = url; // 这样就造成死循环了 因为我们有设置了
    // 解决办法 - 这两种方法 都是可以的
    // 我们 可以加一个变量符号_ 表示私有变量（受保护） 或者 用一个对象包裹
    this._host = url;
    this.data.url = url;
  }
  get host() {
    return this._host;
    rertun this.data.url;
  }
  // 访问器 其实就是 添加一个自定义验证的 保护措施或者验证措施
};
let aa = new A('123');
aa.host = 222;
console.log(aa);
console.log(aa.host);
```

### 使用命名规则来保护属性

**个人理解 高内聚 和 低耦合**

**高内聚 就是 我们暴漏出几个配置 但是具体怎么实现 我们不告诉**

**低耦合 就是 我们尽可能的 让每个模块 各司其职 不搞串联**

```js
class B {
  _url = "https://www.baidu.com";
  set url(url) {
    if (!/^https?:/i.test(url)) {
      throw new Error("网址不符合规范");
    }
    this._url = url;
  }
}
let bb = new B();
bb.url = "wangyi.com"; // ❌ Uncaught Error: 网址不符合规范
bb.url = "https://wangyi.com"; // ✅ B {_url: "https://wangyi.com"}
```

### 使用 `Symbol` 来定义 `protected(保护)` 属性

**唯一值 受保护的属性 不让被设置的属性 可以使用 `Symbol`**

```js
const HOST = Symbol();
class C {
  // 这样就 相当于 我们对象的属性 但是我们想要使用的 Symbol 的值
  // HOST = '123' // ❌
  // 需要这样定义的 Symbol值 是唯一的
  [HOST] = '123';
  set host(url) {
    if (...) {
        ...
    }
    this[HOST] = url; // ⚠️ 一定要加 中括号
  }
  get host() {
    return this[HOST];
  }
}
let cc = new C();
// 子类 也可以用 Symbol 的值
// 子类 使用了super() 会调用 父类的 constructor
// 在类以及子类中 是可以使用的 继承之后 一定要调用 super(); 🍓

// 如果想要定义 多个值
const protecteds = Symbol();
class Common {
  constructor() {
    this[protecteds].host = '123';
  }
  set...
  return this[protecteds].host = '223';
  get...
  return this[protecteds].host
}
```

### 使用 `weakMap` 保护属性

**`WeakMap`对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。**

```js
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
const host = new WeakMap();
const obj = new WeakMap();
class D {
  constructor(name) {
    this.name = name;
    host.set(this, 'http://www.baidu.com'); // 赋 初始值
  }
  set host(this, url)
  // obj.set(this, { // 多个值
  //   ...obj.get(this),
  //   host: url,
  // })
  get host() {
    return host.get(this);
    return obj.get(this)['host'];
  }
}
let dd = new D('D');
```

### `private` 私有属性使用`#`

- **公共属性(`public`) 在类的内部 外部是都可以访问的 包括子类**
- **受保护的属性(`protected`) 就是类以及子类 可以访问的 外部不可以访问**
- **私有属性(`private`) 只属于当前类 子类都不可以访问 (只属于自己)**

```js
class E {
  #host = '123'; // 加个 # 就是表示这个是 私有属性
  // 如果想要修改 就是设置一个 get set 访问器 进行修改和访问
  // 这两种都是设置 私有方法的 方式
  #check() {};
  #check = () => {}; // 方法其实就是一个属性 然后值是函数 本质还是属性
}
// 继承里面是不可以 设置和获取私有属性的
```

## `class`属性继承原理

```js
function User(name) {
  this.name = name;
}

function Admin(name) {
  User.call(this, name); // 属性继承
}
Admin.prototype = Object.create(User.prototype); // 原来函数的继承
User.prototype.show = function () {}; // 方法继承
// ------- class 形式 ----------
class User {
  constructor(name) {
    console.log("123");
    this.name = name;
  }
  show() {
    console.log("哈哈哈");
  }
}

class Admin extends User {
  constructor(name) {
    super(name);
  }
}
let admin1 = new Admin("测试"); // 此处打印了 123。使用super() 就是调用了父类的 构造函数
admin1.show(); // 哈哈哈
// 方法是所有对象共享的。始终是在原型对象上的 属性是每个对象独有的 所以 this.属性 就可以了
```

### `super` 关键字的原理

```js
class User {
  show() {
    console.log("User show");
  }
}

class Admin extends User {
  show() {
    super.show();
    console.log("Admin.show");
  }
}

let a = new Admin();
a.show(); // User show, Admin show
```

- **`super` 关键字解决了 多层调用的问题，上面的 `this` 还是打印的 `gg`** 👇👇👇

  **`super` 用来作为原型攀升。 `this` 还是原来调用的时候的 `this`** 👇👇👇

  ```js
  let g = {
    name: 'g.name',
    show() {
      console.log(this.name);
    }
  }
  let gg = {
    __proto__: g,
    name: 'gg.name',
    show() {
      this.__proto__.show(); // g.name - 这里的话 this.__proto__ 调用所以 上面的show this还是指向的g
      this.__proto__.show.call(this) // gg.name - 这里改变了 this 之后打印的 类似是实现了 super 的操作机制
      super.show() // gg.name
    }
    // ⚠️ 这样写 super() 是不行的 声明成函数是不可以的
    // say(){} 这也是我们在类中 这样写的原因
    say: function() {}
  }
  gg.show()
  ```

- **如果是多重继承的话 ` this.__proto__.show.call(this)` 这样 `this` 一直指向 `gg` 所以 死循环了**

  **可以使用 `super.show()`**

### 为什么子类 `constructor` 中会执行 `super`

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

class Admin extends User {
  constructor(...args) {
    // 如果继承了之后 不调用 super 就会报错
    super(...args); // 这里传递参数的用意就是 继承过来的属性 初始化 🍓🍓🍓
    // 必须写在 this 之前去调用 super
    this.a = 1; // 因为我们继承之后 子类使用的初衷还是 子类的优先级 > 父级 🍓🍓🍓
  }
}
let a = new Admin("a");
```

### `super` 总之就是原型链的攀升

```js
class User {
  data = 1;
  sum() {
    console.log("b sum");
    return this.data;
  }
}

class Admin extends User {
  data = 3;
  constructor() {
    super(); // 如果使用 super 后面没有跟方法的时候 调用父类的 constructor
  }
  info() {
    super.sum(); // 这样调用的 this 还是指向 Admin
  }
}
let a = new Admin();
a.sum(); // b sum & 3
```

## 方法的重写

- **就是子类调用子类 自己的方法 来覆盖和父类重名的方法**
- **扩展：子类调用父类的方法，来扩展自己的方法 完成重写 `super.xx()`**

## 静态继承的原理

```js
function User() {}
User.site = "123";
User.show = function () {};

function Admin() {}
Admin.__proto__ = User;
console.log(Admin.site); // 123

// -----------------------

class User {
  static site = "213";
  static show() {
    console.log("user show");
  }
}
class Admin extends User {}
Admin.show(); // user show
```

## 使用 `instanceof` 检测对象实现 - 对象 与 构造函数

```js
function User() {}
function Admin() {}
Admin.prototype = Object.create(User.prototype);
let a = new Admin();
a instanceof Admin; // true
a instanceof User; // true
```

- **递归调用 实现原型链之间的判断 - 实现`instanceof`**

  ```js
  function checkPrototype(obj, con) {
    obj = Object.getPrototypeOf(obj); // 🍓返回指定对象的原型
    if (!obj) return false;
    if (obj === con.prototype) return true;
    return checkPrototype(obj, con); // 不满足 就递归~
  }
  
  class User {}
  class Admin extends User {}
  let a = new Admin();
  console.log(checkPrototype(a, Admin)); // true
  console.log(checkPrototype(a, User)); // true
  console.log(a instanceof User); // true
  console.log(a instanceof Admin); // true
  ```

## `isPrototypeOf` 检测继承关系 - 对象与对象的关系

**`a.isPrototypeOf(b)` - `b`对象是否是由`a`对象实现的**

```js
class User {}
class Admin extends User {}
let ad = new Admin();
console.log(Admin.prototype.isPrototypeOf(ad)); // true
```

## 内置类继承的原型实现

```js
function Arr(...args) {
  args.forEach((item) => {
    return this.push(item);
  });
  this.first = function () {
    return this[0];
  };
  this.max = function () {
    return this.sort((a, b) => b - a)[0];
  };
}
Arr.prototype = Object.create(Array.prototype);
let a = new Arr(1, 2, 3, 35);
a.first(); // 1
a.max(); // 35

// ---------------------- class 形式 -------------------
// 这样就是增强内置类 在原有的内置类里面可以重写和增加一些新的方法
class Arr1 extends Array {
  // 如果是这样结构的话 不写 constructor 也是可以的 会自动生成
  constructor(...args) {
    super(...args);
  }
  first() {
    console.log(this); // Arr1(4) [1, 2, 3, 35]
    return this[0];
  }
  max() {
    return this.sort((a, b) => b - a)[0];
  }
  remove(value) {
    let pos = this.findIndex((item) => item === value);
    this.splice(pos, 1);
  }
  push() {
    console.log("123");
  }
}

let a1 = new Arr1(1, 2, 3, 35);
console.log(a1.first()); // 1
console.log(a1.max()); // 31
a1.remove("2");
// a1.push() // 重写了
// a1 也是可以直接调用 数组 它所有的方法的
console.log(a1);
```

## `mixin`混合模式使用技巧

```js
let Tool = {
  max(key) {
    console.log("哈哈哈");
  },
};
class Lesson {
  constructor(lessons) {
    this.lessons = lessons;
  }
}
const data = [
  {
    name: "js",
    price: 100,
  },
  {
    name: "node",
    price: 90,
  },
];
Object.assign(Lesson.prototype, Tool);
let les = new Lesson(data);
les.max(); // 哈哈哈
```
