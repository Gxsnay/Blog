# `TS` - `class` & `class`继承

> 类就是拥有相同属性和方法的一系列对象的集合。定义了它所包含的全体对象的静态特征**属性**和动态特征**方法**。
>
> **子类继承 - 满足`A is a kind of B`[满足 A 是 B 的一种]，那么 A 类就是 B 类的子类。**

- 定义：

  类就是拥有相同属性和方法的一系列对象的集合。

  类是一个模具，是从该类包含的所有具体对象中抽象出来的一个概念。定义了它所包含的全体对象的静态特征**属性**和动态特征**方法**。

  **类中定义的属性一定是去体现 类 本身的特征变量，不能将一些无关的属性定义在类属性中。🍓🍓🍓**

- **实例：**

  就是一个拥有具体属性值和方法的实体，**是类的一个具体表现。一个类可以创建多个实例对象。**

  - **通过`new`的方法创建实例。**
  - 通过类中的属性或者方法来赋值[Or `get/set` 选择器来赋值] / 通过【 构造函数 】来进行赋值。

  ```typescript
  class Person {
    // 要么赋值一个初始值，要么 给一个默认的 undefined
    // public name: string | undefined;
    // Ts4 以后 可以通过 赋值非空 来对其进行定义。
    public name: string = "gl";
    public address: string[] = ["1", "2"];
    public address1: Array<string> = ["1", "2"];
    public fn: () => void = () => {};

    constructor(name: string) {
      this.name = name;
    }

    // 方法默认的返回值是 void
    show() {}
  }
  ```

## `class` 解析编译成 `JS`「 `ES5`语法 」

```js
"use strict";
var PersonJs = /** @class */ (function () {
  function PersonJs(name) {
    this.name = "gl"; // 先赋 初值
    this.name = name; // 在进行 构造参数 赋值
  }
  // 在原型上 定义了 show 方法。 实现 原型共享~，节省空间。
  PersonJs.prototype.show = function () {};
  return PersonJs; // 立即函数自动执行，return 该函数内容，返回给 外面的 PersonJs 变量。
})(); // 立即执行函数 - 避免了变量名被污染。
// --- --- --- --- --- --- ⬆️⬇️ --- --- --- --- --- ---
var a = (function () {
  var b = 2;
  return b;
})(); // a 就是 2, b 就是只在 立即执行函数中的。外界访问不到的。
```

## `class` - 引用属性

数组、类、对象{}、对象数组、集合类[Set / Map / 自定义的集合类] 等都可以被称为是 引用属性。

- **类引用属性案例 - 订单详情 & 订单类**

  ```typescript
  class Order {
    // 下面 👇 是当前声明属性的简写。 --- 指代 👇OrderDetail 中构造函数代码。
    public orderId: number = 0; // 订单Id
    public data: Date = new Date(); // 订单日期
    public custname: string = ""; // 顾客姓名
    public phone: string = ""; // 顾客手机号
    // public orderDetail: Array<OrderDetail> = []; 和下面定义结构一致。✨~
    public orderDetails: OrderDetail[] = []; // item 为订单详情的 array 数组。

    // 约定： 区分局部变量和全局变量 几乎都是用 _ 来区分。
    public constructor(
      _orderId: number,
      _data: Date,
      _custname: string,
      _phone: string,
      _orderDetails: OrderDetail[]
    ) {
      this.orderId = _orderId;
      this.data = _data;
      this.custname = _custname;
      this.phone = _phone;
      this.orderDetails = _orderDetails;
    }
  }

  class OrderDetail {
    public constructor(
      // 这里 👆 是上面的简写。 推荐✨
      public orderDetailId: number = 0, // 订单号
      public prodctname: string = "", // 订单详情中的商品名
      public price: number = 0, // 购买商品价格
      public count: number = 0 // 购买数量
    ) {}
  }

  const orderDetailOne = new OrderDetail(0, "电脑", 10000, 1);
  const orderDetailTwo = new OrderDetail(1, "收集", 5000, 1);
  const orderDate = new Date(2021, 11, 17, 11, 20, 0);
  const order = new Order(0, orderDate, "GL", "151", [
    orderDetailOne,
    orderDetailTwo,
  ]);
  ```

## `class` - 修饰符

- `public` - 公共属性。「 默认 」
- `protected` - 受保护的属性。**「 只能在当前类及其当前类的子类中访问。 」**
- `private` - 私有属性。**「 只能在当前类中访问。 」**

## `Ts4` 新特性

### `Ts4-class`类中初始化变量。

- **增加 `undefined` 联合类型，忽略检测。 「 `TS4 之前` 」**

  `Ts4`之前，针对没有初始化的值，也没有在构造函数中明确给这个赋值的一种解决办法：

  **增加`undefined`联合类型声明即可。 「 知道有这个变量，但是不理会。因为是 `undefined` 」**

  **但是 如果是`undefined`类型，是不会给其开辟 内存空间的。 也会有一些 类型操作的提示。**

  **`undefined`系统不检查，如果后续不操作，也不会报错。这样会有一些风险。⚠️⚠️⚠️**

  ```typescript
  class P {
    public prod: string | undefined;
  }
  ```

- **非空判断 -- 「 推荐 ✨✨✨~ `TS4` 」**

  **`Ts4`，就使用 非空判断。🍓🍓🍓 因为`undefined`这个特殊类型会有风险。**

  **如果确保属性会使用/赋值，`!`可以不进行添加。🍓**

  **不确定属性才需要添加。🍓**

  ```typescript
  class P {
    public prod!: string;
    // typeof prod // 🍓✨ - 非空判断不进行赋值的话，也是 undefined 类型。
  }
  ```

### `Ts4-class`类中定义属性简写。

**给构造器上的参数添加 修饰符`public / protected / private`, 一般只是针对`public`。这个参数就变成了一个属性。**

**定义属性并且进行赋值操作[ 隐式操作 ]。**

```typescript
class Person {
  constructor(
    public name: string,
    protected sex: boolean,
    private age: number
  ) {}
}

const p1 = new Person("name", true, 12);
```

## `Class`继承

**`OOP`「 面向对象编程 」**

### 子类

- **子类 - 满足 `A is a kind of B`[满足 A 是 B 的一种]，那么 A 类就是 B 类的子类。**
- **子类 - 就是对 原型链 的包装和提升。**

### `JS`帮助理解 👇~

- **`TS`类 - 双重性质 - 既是类型[`new`实例时`TS`类是类型] / 当用`TS`类直接获取属性时就是对象。**
- **`JS`函数 - 双重性质 - 既是类型[`new`实例时`JS`函数是类型] / 当用`JS`函数直接获取属性时就是对象。**
- **`JS`函数作为对象时，可以获取 `__proto__、prototype` 以及自身定义的静态属性。**

### 前言 - `Object.setPrototypeOf` & `Object.create`

- **`Object.setPrototypeOf[Es6]` - 设置一个指定的对象的原型到另外一个对象 或 `null`**

  - 接受两个参数： 第一个是现有对象，第二个是原型对象。

  ```js
  let a = {};
  Object.setPrototypeOf(a, parent.prototype);
  // 这样执行后效果是 a.__proto__ = parent.prototype  给 a 对象设置了原型。
  ```

- **`Object.create` - 创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。**

  ```js
  Son.prototype = Object.create(Parent.prototype);
  // 这样会导致原有 Son.prototype 上的方法失效。但是 Object.setPrototypeOf 可以保留。
  ```

- **`Object.setPrototypeOf / Object.create` 区别：**

  - **`Object.setPrototypeOf(Son.prototype, Parent.prototype);`**
  - **`Object.setPrototypeOf`没有改变 原对象的指针指向。没有中间对象过渡，只是在原有基础上为`__proto__ `改变了指向。**
  - **设置后，相当于`Son.prototype.__proto__ = parent.prototype`就会有这样的效果了。**
  - **而`Object.create`是新建了对象后，为`Son.prototype`进行了赋值。**

### 静态属性/方法 的继承

```js
function Parent(name, sex, phone) {
  // 父类 [构造函数]
  this.sex = sex;
  this.name = name;
  this.phone = phone;
}
Parent.count = 31; // 静态属性 <-> 相当于 `TS`的`static`属性
Parent.commonDescribe = function () {
  // 静态方法 <-> 相当于 `TS`的`static`方法
  console.log("666~");
};
Parent.prototype.say = function () {
  // 实例方法 <-> 相当于 Ts的默认方法
  console.log("say");
};
const PObj = new Parent("zs", "女", "333");
PObj; // { name: 'zs', sex: '女', phone: '333' }
function Son(name, sex, phone, age) {
  // 子类 [子构造函数]
  Parent.call(this, name, sex, phone);
  this.age = age;
}
```

获取 `Son.count` 👇

1. **静态属性继承 - `[ for...in... ]`**

   **🍓`[for...in...]` - `in`后面会被当作对象，所以如果`[for...in 函数]`的话,获取到的是函数以及函数原型链上的的静态属性。**

```js
for (const key in Parent) {
  if (Object.hasOwnProperty.call(Parent, key)) {
    // 限制：只会查找自有属性
    Son[key] = Parent[key]; // 静态属性 / 方法进行赋值。
  }
}
```

2. **静态属性继承 - `[ Object.keys ]`**

   🍓 **`Object.keys` 直接返回的就是对象上的自有属性，不会向上查找。**

```js
Object.keys(Parent).forEach((_key) => {
  // 等价于👆 for + if 效果
  Son[_key] = Parent[_key];
});
```

3. **静态属性继承 - `[ Son.__proto__ = Parent ]`**

   **基于 原型链 想上查找**

```js
Son.__proto__ = Parent; // 🍓因为是 Son.count 是基于对象获取的。所以他也会基于原型链进行查找。
```

4. **静态属性继承 - `[ Object.setPrototypeOf ]`**

```js
Object.setPrototypeOf(Son, Parent); // 其实就是上面 方法3 的翻版。
```

```js
const s = new Son("ls", "男", "111", 22);
s; // { name: 'ls', sex: '男', phone: '111', age: 22 }
Son.count; // 31
```

### 原型链继承

- **实现：**`Son`类的原型对象属性，`Son.prototype`指向`new Parent()`

- **实现本质：** 改变`Son`构造函数的原型对象变量的指向`Son.prototype = new Parent()`，那么`Son`顺着`__proto__` 属性，`Son`类也可以访问`Parent`类的原型对象空间中的所有属性和方法。

  ```js
  function Parent(name) {
    this.name = name;
  }
  function Son(favor) {
    this.favor = favor; // 兴趣爱好
  }
  const PObj = new Parent("GL");
  Son.prototype = PObj;
  Son.prototype.constructor = Son; // 🍓🍓🍓 重要 构造函数指针指向Son这样可以形成闭环，重新找回。
  // 这里只能使用 父类构造好的 name 属性，不能自定义使用。⚠️⚠️~ 局限性了。
  let SObj = new Son("🏀");
  SObj.__proto__ === PObj; // true
  SObj.name; // GL

  // ------------ 原型链说明 ------------
  class User {}
  const u = new User();
  u.constructor === User; // true
  u.__proto__ === User.prototype; // true
  User.prototype.constructor === User; // true
  // 函数.prototype === 实例对象.__proto__
  ```

- **原型链继承的好处 🌊~**

  - 子类对象变量可以访问父类的实例属性。
  - 子类对象变量可以访问父类原型对象空间中的属性和方法。

- **原型链继承的缺点 ⚠️~**

  - 局限性：不能通过子类构造函数向父类构造函数传递参数。 [ 只能使用父类构造好的 `key-value` ]。

- **原型链容易被遗忘的重要一步 ☁️‼️**

  - **可以借助 `constructor` 去找对应的函数。**

    **`Son.prototype.constructor = Son`**

  - **`Son.prototype = Parent.prototype` 会导致的问题：👇**

    **访问不到`new Parent()`后的属性/方法了。**

    **结合上面示例，`Son.prototype.constructor = Son `。会导致`Parent.prototype.constructor`也会指向 `Son`。**

    ```js
    Son.prototype = Parent.prototype;
    Son.prototype.constructor = Son; // 这样会导致 Parent.prototype.constructor 也指向了 Son。
    ```

### 借用构造函数继承

- **实现：** 父类`Parent.call / apply`实现
- **实现本质：** 在子类 `Son`构造函数的内部借助`apply()&call()`方法调用并传递参数给父类 `Parent`构造函数。

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.say = function () {
  console.log(this.name);
};
function Son(name, age) {
  // 第一个参数 this 就是 new Son() 后的实例对象。
  Parent.call(this, name); // 借用父构造函数继承
  this.age = age;
}
const SObj = new Son("GL", 21);
SObj.say; // undefined 缺点⚠️
```

- **借用构造函数继承的好处 🌊~**
  - 可以使用父类构造函数并传递参数。但不能访问父类原型的属性/方法。
- **借用构造函数继承的缺点 ⚠️~**
  - 借用构造函数实现了子类向父类构造函数传递参数，但没有继承父类原型的属性和方法，所以也就无法访问。

### 借用构造函数+原型链继承 组合模式

- **优势：**
  - 具备借用构造函数的优点：子类的内部可以向父类传递参数。
  - 具备原型链继承的优点，`Son.prototype & new Son`出来的实例对象变量和实例都可以访问父类原型对象上的属性和方法。

```js
// 这样会导致 this.name 打印了两次, 产生原因 - `new Parent & Parent.call` 操作。
function Parent(name) {
  this.name = name;
}
Parent.prototype.say = function () {
  console.log(this.name);
};
function Son(name, sex) {
  Parent.call(this, name); // 🍓
  this.sex = sex;
}
Son.prototype = new Parent(); // 🍓
Son.prototype.constructor = Son; // 🍓
const sonObj = new Son("GL", "boy");
sonObj.say(); // GL
sonObj; // Son { name: 'GL', sex: 'boy' }
```

- **缺点：** 调用了两次父类构造函数，`new Parent` 调用构造函数带来的问题：
  - 进入 `Parent` 构造函数为属性赋值，分配内存空间， 浪费内存 🍓。
  - 赋值导致效率下降一些，关键是 `new Parent`赋的值没有意义，代码冗余。`new Son`出来的对象和这些值毫不相干，是通过子类`Son`构造函数中的`apply`🍓 来向父类`Parent`构造函数赋值。

### 寄生组合式继承 🍓

**✨ 最佳继承模式 「 寄生组合继承模式 = 借用构造函数继承 + 寄生继承 」**

寄生组合继承解决了 👆 上面调用两次父类构造函数的不足。**保留了借用构造函数继承，使用寄生继承代替了原型链继承。**

- **实现：**
  - `Son.prototype` 不再指向`new Parent()`出来的对象空间，而是用 `Parent`父类原型对象属性克隆了一个对象。再让`Son.prototype`指向这个新对象。
  - **避免了借用+原型链的调用两次父类构造函数为属性赋值的不足。**

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.say = function () {
  console.log(this.name);
};
function Son(name, sex) {
  Parent.call(this, name); // 🍓
  this.sex = sex;
}
function Middle() {
  // 🍓
  // 这里 this 上的属性，会绑定在 Son.prototype 也就是 new Son().__proto__
}
// 因为 new Middle().__proto__ 和 Middle.prototype 指向一致，所以这也改变了 __proto__ 的指向
// 但是 条件是先改变 Middle.prototype 指向，之后再进行 new Middle()，才可以导致 __proto__ 指向改变
Middle.prototype = Parent.prototype; // 🍓
// 寄生： - 寄生于新创建的构造函数对象。
// - 这里之后 new Son().__proto__ 就指向 new Middle() 了。
// - new Middle().__proto__ 有指向 Parent.prototype 这样就做到了，共享 Parent 中的属性。
// - 而 Parent 中的 name 实例属性，会通过 Son 中 Parent.call(this, name...) 绑定。
// - 😯 call(this) 改变了this指向，所以 new Son 就会有对应的属性。
Son.prototype = new Middle(); // 🍓
Son.prototype.constructor = Son; // 🍓
const SObj = new Son("GL", 21);
SObj.say(); // GL
SObj; // Son { name: 'GL', sex: 21 }
```

- **上面 👆 优化后，构建一个公共的寄生组合继承函数「 最佳原型继承模式！！！ 」**

```js
// 公共的寄生组合继承函数
function _extends(Parent, Son) {
  function Middle() {
    /** 😯 神奇 amazing~ ✨✨✨
     * 这里 this.constructor 中的 this 就是 new Middle() 后的实例
     * new Middle() 又是绑定在 Son.prototype 中，相当于 new Son().__proto__。
     *
     * 参考👆 -- 这段。
     * Son.prototype = new Middle();
     * Son.prototype.constructor = Son;
     */
    this.constructor = Son; // 🍓🍓🍓
  }
  Middle.prototype = Parent.prototype; // 🍓
  return new Middle(); // 🍓
}

function Parent(name) {
  this.name = name;
}
Parent.prototype.say = function () {
  console.log(this.name);
};
function Son(name, sex) {
  Parent.call(this, name); // 🍓
  this.sex = sex;
}
// 🍓 Son.prototype 会导致 Son原有上面的方法丢失。
Son.prototype = _extends(Parent, Son); // 🍓
const sonObj = new Son("GL", "boy");
sonObj.say(); // GL
sonObj; // Son { name: 'GL', sex: 'boy' }
```

- **上面 👆 使用 `Object.create()` 编写如下：⬇️**

  **上面`_extends`通用性、灵活性会更高。`Object.create`适用于少次创建继承的时候。**

```js
function Parent(name) {
  this.name = name;
}
Parent.prototype.say = function () {
  console.log(this.name);
};
function Son(name, sex) {
  Parent.call(this, name); // 🍓
  this.sex = sex;
}
// Son.prototype = ...，这样会导致原有 Son.prototype 上的方法失效。 🍓~
Son.prototype = Object.create(Parent.prototype);
Son.prototype.constructor = Son;
const sonObj = new Son("GL", "boy");
sonObj.say(); // GL
sonObj; // Son { name: 'GL', sex: 'boy' }
```

### `TS`继承 - `JS`编译源码解析

```typescript
class Animal {
  constructor(public name: string) {}
  static a = "1";
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}
class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}
class Horse extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 45) {
    console.log("Galloping...");
    super.move(distanceInMeters);
  }
}
let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");
```

- **👆 上面是`TS`，转译后的`JS`代码如下 ⬇️**

```js
var __extends =
  (this && this.__extends) ||
  (function () {
    // 继承静态属性 - extendStatics 方法作用： 完成父类静态方法 / 属性在子类中的继承。
    // 这里这段代码 主要是为了做兼容... setPrototypeOf / __proto__ / for...in 😯
    var extendStatics = function (d, b) {
      // 在立即执行函数中比较优雅~，外部 和 内部 同样名称的函数，这样做的好处是： 节省内存空间。🍓🍓🍓~
      // 在外部定义后，内部使用，可以做到 节省变量空间 🍓🍓🍓~
      extendStatics =
        Object.setPrototypeOf ||
        // 如果不兼容上面 就使用 instanceof 语法判断数组
        // instanceof 判断 构造函数，是否属于
        // let a = {}; a.__proto__ = []; a instanceof Array - true / a instanceof Object - true。
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b); // 继承静态属性
      // 首先绑定 constructor，new 之后 constructor，会如约绑定到 实例上。
      function __() {
        this.constructor = d;
      }
      // 如果 b === null 就返回一个 object.create(null)
      // 否则 返回 (__.prototype = b.prototype, new __());
      // -- __.prototype = b.prototype 将 寄生函数 原型链接到 父类原型。 形成关系
      // -- 指向完上面之后，利用 逗号运算符，返回 new __() 的实例对象
      // 然后将子类 原型 绑定到 new __()，这样 constructor 也绑定了。子类和父类 也通过中间寄生函数形成了 关系。
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());

      // 上面表达式 改进后为 ✨✨✨~
      if (b) {
        __.prototype = b.prototype;
        d.prototype = new __();
      } else {
        d.prototype = Object.create(null);
      }
    };
  })();

var Animal = /** @class */ (function () {
  function Animal(name) {
    this.name = name;
  }
  Animal.prototype.move = function (distanceInMeters) {
    if (distanceInMeters === void 0) {
      distanceInMeters = 0;
    }
    console.log(this.name + " moved " + distanceInMeters + "m.");
  };
  Animal.a = "1";
  return Animal;
})();
var Snake = /** @class */ (function (_super) {
  // _super 就是父类
  __extends(Snake, _super); // 🍓~将子类 和 父类 传递进行 实现继承。
  function Snake(name) {
    // 这里 || this 是针对 构造函数来写的 因为 constructor 默认返回 this。
    return _super.call(this, name) || this;
  }
  // 方法重写 - 在父类原有方法上 追加方法逻辑。
  Snake.prototype.move = function (distanceInMeters) {
    if (distanceInMeters === void 0) {
      distanceInMeters = 5;
    }
    console.log("Slithering...");
    // 🍓~ 利用call来调用 父类 的函数，并 绑定当前子类的this。
    _super.prototype.move.call(this, distanceInMeters);
  };
  return Snake; // 一定要记得 return 不返回 外部也就拿不到，也 new 不到该函数。
})(Animal); // 立即执行函数传递参数
var Horse = /** @class */ (function (_super) {
  __extends(Horse, _super);
  function Horse(name) {
    return _super.call(this, name) || this;
  }
  Horse.prototype.move = function (distanceInMeters) {
    if (distanceInMeters === void 0) {
      distanceInMeters = 45;
    }
    console.log("Galloping...");
    _super.prototype.move.call(this, distanceInMeters);
  };
  return Horse;
})(Animal);
var sam = new Snake("Sammy the Python");
var tom = new Horse("Tommy the Palomino");
```

### `Code` - `TS`继承=>`JS`编码

```js
const Parent = function (name, sex, phone) {
  this.name = name;
  this.sex = sex;
  this.phone = phone;
};
Parent.count = 31;
Parent.commonDescribe = function () {
  console.log("666~");
};
Parent.prototype.say = function () {
  console.log("say");
};
function Son(name, sex, phone, age) {
  Parent.call(this, name, sex, phone);
  this.age = age;
}

// 🍓🍓🍓 ⬇️
let __extends = (function (Son, Parent) {
  function getStaticExtendsWithForIn(Son, Parent) {
    for (const key in Parent) {
      if (Object.hasOwnProperty.call(Parent, key)) {
        Son[key] = Parent[key];
      }
    }
  }
  function getStaticExtendsWithObjectkeys(Son, Parent) {
    Object.keys(Parent).forEach((_key) => {
      Son[key] = Parent[key];
    });
  }
  function getStaticExtendsWithProto(Son, Parent) {
    Son.__proto__ = Parent;
  }
  // 实现 静态属性/方法 继承
  let myExtendsStatics = function (Son, Parent) {
    myExtendsStatics =
      Object.setPrototypeOf ||
      getStaticExtendsWithForIn ||
      getStaticExtendsWithObjectkeys ||
      getStaticExtendsWithProto;
    return myExtendsStatics(Son, Parent);
  };
  // 实现 寄生组合式继承。
  return function (Son, Parent) {
    myExtendsStatics(Son, Parent);
    function __() {
      this.constructor = Son;
    }

    if (Parent) {
      __.prototype = Parent.prototype;
      Son.prototype = new __();
    } else {
      Son.prototype = Object.create(null);
    }
  };
})();
// 🍓🍓🍓 ⬆️
__extends(Son, Parent);
const s = new Son("ls", "男", "111", 22);
console.log("s", s); // { name: 'ls', sex: '男', phone: '111', age: 22 }
Son.count; // 31
```

### 继承 - 实现

- 汽车租赁功能大概实现：

  > 有小轿车,大巴,卡车三种类型的车,
  >
  > 顾客可以租任意一种或多种不同类型的车,按照租用的天计算租金，
  >
  > 同时为了响应国家对各类车安全的管理, 对在租赁期内有过各种超载，超乘客数，酒后驾车等违规的车需额外支付一定的费用。
  >
  > 计算退回费用：最终退回顾客的费用为押金扣除使用天数，如押金不足需额外支付不足部分。

  - **思考：🤔**

  > 如果只是针对租赁功能，颜色，价格这些先暂时忽略。
  >
  > 小轿车,大巴,卡车共同属性: `brand` (品牌) `VechileNo` (车牌号) `days` (租赁天数) `total` (支付的租赁总费用) `deposit` (押金)
  >
  > 小轿车,大巴,卡车共同方法: 计算租赁车的价格 (`calculateRent`) 支付押金的方法(`payDesposit`) 安全检测方法（`safeShow`)等等~ 如果超载了需要显示具体的车牌，不能定义为静态...
  >
  > 父类：`Vechile` 交通工具。

```typescript
// 父类
class Vechile {
  public total!: number; // 支付的租赁总费用
  public constructor(
    public brand: string, // 品牌
    public vechileNo: string, // 车牌号
    public days: number, // 租赁天数
    public deposit: number // 押金
  ) {}

  // 计算租赁车的价格
  protected calculateRent(): number {
    // 公共 / 通用部分 - 可以在父类中定义~
    // 子类重写该方法后，原父类方法就不会再次调用了。因为就近查找 已经执行了 重写方法。
    console.log(`${this.brand}车牌号为${this.vechileNo}被租。`);
    return 0;
  }

  // 支付押金的方法
  public payDesposit() {
    console.log(`${this.brand}车牌号为${this.vechileNo}支付了:${this.deposit}`);
  }

  // 安全检测方法
  public safeShow() {
    // 规则...
    console.log(`${this.brand}车牌号为${this.vechileNo}违规了`);
  }
}

// 子类 小轿车 型号(type)
class Car extends Vechile {
  constructor(
    brand: string,
    vechileNo: string,
    days: number,
    deposit: number,
    public type: string
  ) {
    // 表示调用父类的构造方法。
    // 转译成Js就是继承中借用构造函数的call方法。- Vechile.call(this, brand, vechileNo...);
    super(brand, vechileNo, days, deposit);
  }

  // 根据型号来获取租用一天该型号车的租金
  public getPriceByType() {
    let rentMonryByDay: number = 0; // 每天租金
    if (this.type === "五菱宏光") rentMonryByDay = 10;
    else if (this.type === "特斯拉-ModelY") rentMonryByDay = 188;
    else if (this.type === "比亚迪-汉") rentMonryByDay = 66;
    return rentMonryByDay;
  }

  // super + 方法重写[ method override ]
  public calculateRent() {
    // 父类是 protected，子类需要比父类大，可以为 public。
    super.calculateRent();
    return this.days * this.getPriceByType();
  }
}
const car = new Car("比亚迪", "京A66666", 3, 50, "比亚迪-汉");
car.calculateRent(); // 198

// - 子类 大巴车 座位数(seatNum)
class Bus extends Vechile {
  constructor(
    brand: string,
    vechileNo: string,
    days: number,
    deposit: number,
    public seatNum: number // 座位数
  ) {
    super(brand, vechileNo, days, deposit);
    if (seatNum > 200) {
      // 🍓🍓🍓 定义的时候错误控制
      throw new Error("座位数不能超过 200");
    }
  }

  public getPriceBySeatNum(): number {
    // 计算租赁价格
    let rentMonryByDay: number = 0; // 每天租金
    if (this.seatNum <= 16) rentMonryByDay = 11;
    else rentMonryByDay = 200;
    return rentMonryByDay;
  }

  // super + 方法重写[ method override ]
  public calculateRent() {
    // 这个是定义在 原型对象 空间当中了。
    // this.calculateRent();  // 这样就导致 死递归循环了。 ❌❌❌
    // .call(this) 也是为了标示 保证是 Bus的实例对象 在调用，this指向Bus的实例对象，也保证了数据正确性🍓~。调用父类方法并修改 this指向。
    super.calculateRent(); // 这里相当于 - Vechile.prototype.calculateRent.call(this);
    return this.days * this.getPriceBySeatNum();
  }
}
```

- **继承好处**

  **节省子类当中重复赋值。**

### `super` + 方法重写`override`

- **条件：** 一定发生在继承中。
- **位置：** 子类中重写父类的方法
- **执行实际：** 当父类中方法的实现不能满足子类功能需要或者不能完全满足子类功能需要是，就需要在子类中进行方法重写。
- **给继承带来的好处：** 让所有子类共用父类中的方法已经实现了一部分功能的代码[ 父类方法代码在各个子类中得到了复用。 ]
- **定义规则： 🍓🚗~**

  1. **和父类同名。**
  2. **参数和父类相同，如果是引用类型的参数，则需要依据具体类型来定义。 `any` `unknown` 类的类型。**
  3. **父类方法的访问范围[ 访问修饰符 ]必须小于子类中丰富从写的访问范围[ 访问修饰符 ]。同时父类方法不能是`private`。**
     - **`private`私有修饰符 是不可以被子类 继承的，只允许在本类中使用。**
     - **`protected`受保护的修饰符 是允许被继承的，但是不可以在类的外部调用。**
     - **`public` 公共的修饰符，默认是`public`。 可允许继承，也允许外部调用。**

- **`super` 用法：🍓🚗~**

  - **在子类的构造函数中使用`super`[ 子类传递给父类构造函数的参数 ]就表示用来调用父类构造函数，传递给父类构造函数的参数。**
  - **在子类重写的方法中调用父类同名的方法，`super`.重写的方法。**

  **当子类父类有同名属性时，可以在子类中用 `super`来获取父类同名属性吗？[不能 ❌ 一般要避免在子类、父类属姓名同名。]**
