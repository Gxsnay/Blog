# `TS` - 类型断言&类型守卫

> 类型断言 - 把两种能有重叠关系的数据类型进行相互转换的一种`TS`语法，把其中的一种数据类型转换成另外一种数据类型。
>
> 类型守卫 - 在语句的块级作用域内缩小变量的一种类型推断的行为。

## **类型断言/类型转换**

**类型断言 - `as` / 类型转换`<Type>x;`**

**类型断言和类型转换产生的效果一样，但语法格式不同。**

- **定义** - 把两种能有重叠关系的数据类型进行相互转换的一种`TS`语法，**把其中的一种数据类型转换成另外一种数据类型。**
- **语法格式**
  - **A 数据类型的变量 `as` B 数据类型。**
  - A 数据类型 和 B 数据类型 必须具有**重叠**关系。

### 重叠关系理解

- **如果 A、B 是类，并且有继承关系。**

  **不论 A、B 谁是父类或子类。 都可以进行相互断言。大多数场景下都是把 父类的对象变量断言成子类。🍓~**

  ```typescript
  class PA {
    public name!: string;
    public eat() {}
  }
  class SA extends PA {
    public age!: number;
    public study() {}
  }
  const p = new PA();
  const s = new SA();
  let res = p as SA; // 常用✨
  res.name; // 因为继承关系得到了该 name 属性。
  res.age; // 可以 点到

  let res2 = s as PA; // 子类对象变量也可以断言成父类 但不常用✨
  res2.name; // 只可以 点到 父类的属性
  // res2.age; // ⚠️⚠️⚠️ 这样是点不到 子类原有的对象属性的。 因为就将其断言成 父类了。

  // 类型转换格式🍓 - 与上面效果一致。
  res = <SA>p;
  res2 = <PA>s;
  ```

- **如果 A、B 是类，但没有有继承关系。 -- [ 范型约束-`extends` ]的一个基础**

  **两个类中任意一个类的所有`public`实例属性 / 方法[不包括静态属性/方法] 和 另外一个类完全相同或者 是 另外一个类的子集，则这两个类可以相互断言。否则就不能相互断言。**

  **需要充分重叠。🍓🍓🍓~ `public`的方法和属性需要充分重叠。**

  ```typescript
  class PA {
    public name!: string;
    public eat() {}
    static a() {}
    static hh: string;
  }
  class SA {
    // PA 是 SA的 子集，没有继承关系，但是实例方法充分重叠~ 🍓🍓~
    public name!: string;
    public age!: number;

    public eat() {}
    public study() {}
  }
  const p = new PA();
  const s = new SA();

  let res = p as SA; // 可以获取到 SA 的所有属性 eat / name / age / study
  let res2 = s as PA; // 可以获取到 PA 的所有属性 eat / name

  // 类型转换格式🍓 - 与上面效果一致。
  res = <SA>p;
  res2 = <PA>s;
  ```

- **如果 A 是类，B 是接口，并且 A 类实现了 B 接口 [`implements`]，则可以互相 转换/断言。🍓🍓🍓**

  ```typescript
  interface PA {
    name: string;
  }
  class SA implements PA {
    public name!: string;
    public age!: number;
  }
  const p: PA = { name: "GL" }; // 利用接口定义对象，因为接口是不能 new 的。
  const s = new SA();
  // 接口类型的对象 可以 断言成实现它的 具体的类
  let res = p as SA; // 可以获取到 SA 的所有属性 name / age
  let res2 = s as PA; // 可以获取到 SA 的所有属性 name

  // 类型转换格式🍓 - 与上面效果一致。
  res = <SA>p;
  res2 = <PA>s;
  ```

- **如果 A 是类，B 是接口，并且 A 类没有实现了 B 接口。 则断言依据 第二项[充分重叠 / 子集]规则完全相同。**

  ```markdown
  A as B 是需要拿 B 的属性作为标准，和 A 进行比较。B[主]有的，A[副]就需要有。
  ```

- **如果 A 是类，B 是`type`定义的数据类型[ 就是引用数据类型，e.g`Array, Object, Date`], 并且 有 A 实现了 B type 定义的数据类型[ `implements` ]。**

  **则 A 的对象变量可以断言成 B type 定义的对象数据类型，同样 B type 定义的对象数据类型的对象变量也可以断言成 A 类型。**

  ```typescript
  type PA = {
    // type 和 interface 实现是一致的。
    name: string;
    age: number;
  };
  class SA implements PA {
    public name!: string;
    public age!: number;
    public sex!: string;
  }
  const p: PA = { name: "GL", age: 12 }; // 利用type定义对象，因为type是不能 new 的。
  const s = new SA();
  let res = p as SA; // 可以获取到 SA 的所有属性 name / age / sex
  let res2 = s as PA; // 可以获取到 PA 的所有属性 name / age

  // 类型转换格式🍓 - 与上面效果一致。
  res = <SA>p;
  res2 = <PA>s;
  ```

- **没有实现关系，和接口是一致的。 断言/转换 依据 [ 充分重叠 / 子集 ] 来进行判断。**

  ```typescript
  type PA = {
    name: string;
    age: number;
  };
  class SA {
    // SA 中的个数 是PA 的子集。
    public name!: string;
    // public kk() {} // ⚠️ 报错 因为这样不符合 子集 要求了。
  }

  const p: PA = { name: "GL", age: 12 };
  const s = new SA();
  let res = p as SA; // 可以获取到 SA 的所有属性 name
  let res2 = s as PA; // 可以获取到 PA 的所有属性 age / name

  // 类型转换格式🍓 - 与上面效果一致。
  res = <SA>p;
  res2 = <PA>s;
  ```

- **如果 A 是一个函数上参数变量的联合类型。`e.g: number | string`。 那么在函数内部可断言成 `number | string`。**

  ```typescript
  function fn(p: string | number) {
    // 但是联合类型 点 属性是获取不到 非重叠属性的。
    p as string;
    p as number;

    // 方便其 去做一些 计算和运算。
    (p as number) + 1;
  }
  fn(1);
  ```

- **多个类组成的联合类型如何断言 ?**

  **`e.g: let vechile: Car | Bus | Trunck。`**

  **那么 vechile 可以断言成其中任意一种类型。 `vechile as Car / vechile as Bus / vechile as Trunck。`**

  ```typescript
  class Car {
    public name!: string;
    public say() {}
  }
  class Bus {
    public name!: string;
    public eat() {}
  }
  let vechile: Car | Bus = new Car(); // 如果是这样定义，vechile 可以获取到 Car 的所有属性
  function test(vechile1: Car | Bus) {
    vechile1.name; // 这样只能获取到 他们共有的属性 name 🍓🍓🍓
    (vechile1 as Car).say(); // 依靠断言 可以获取到 Car上所有属性。
    (<Car>vechile1).say(); // 类型转换也一样
  }
  ```

- **🍓 任何数据类型都可以转换成`any｜unkonwn`类型。`any / unknown`类型也可以转换成 任何其他数据类型。**

  **`any` - 既可以当作所有类型的父类，也可以当作所有类型的子类。**

  **`unkonwn` - 只可以充当所有类型的父类。**

### 类型断言存在的意义和场景

- **顾客在执行汽车租赁项目 租赁价格计算方法中调用每一个类独有方法的时候使用。如上 👆 方法**

- **对象中`Symbol`数据类型取值问题**

- **加法计算，巧用`as any`。**

  ```typescript
  // 对象中 Symbol 数据类型取值问题 🍓~
  let symid = Symbol("objid");
  let obj = {
    [symid]: 101,
    name: "zs",
    age: 21,
  };
  let name = obj["name"];
  let objid = obj[symid]; // 如果报错 类型 symbol 不能作为索引类型使用。
  // 解决：
  let objid2 = obj[symid as any];
  // obj[symid as unknown] // 报错 unknown 是不可以作为索引类型使用的 🍓🍓🍓~
  symid as unknown; // 但是 转换成 unkonwn 是可以转换的。
  
  // 加法计算，巧用 as any。🍓~
  type strOrNum = string | number;
  function add(one: strOrNum, two: strOrNum) {
    // one + two // 运算符“+”不能应用于类型“strOrNum”和“strOrNum”。
    ((one as any) + two) as any; // 🍓🍓~
    <any>one + <any>two; // 🍓🍓~
  }
  ```

## 类型守卫

### 前言 - `new`底层发生了什么？

```typescript
class TestA {
  public constructor(public name: string) {}
  public say() {
    console.log(this.name);
  }
}
const obj = new TestA("123");
```

- **`new`生成对象都发生了什么？**

  - `var obj = {} / new Object();`

    **创建了一个 `Object` 对象。**

  - `obj.__proto__ = TestA.prototype;`

    **让新创建对象的 `__proto__` 变量指向 `TestA` 原型对象空间。**

  - `TestA.apply(obj, ["123"]);`

    `apply`方法 也改变了`this`的指向。😯😯😯

    **借用 `TestA` 构造函数 为 `obj` 对象变量增加 `name、say` 属性 / 方法。**

### 考核题

**编写一个操作对象方法/属性的函数实现以下功能。**

1. 对象字符串属性有空格时就去掉空格后输出。
2. 当遇到对象函数时就执行，其他数据类型的属性一律直接输出。
3. 只有对象中包含 `allowoutput` 属性时，才允许输出。 --- `in`
4. 函数接收到外部传入的`null / undefined / {}`时，直接输出不是一个合法的对象。

```typescript
// 考核点：- 类型守卫 / 静态方法
interface IObjInfer {
  name: string;
  age: number;
  eat(): void;
  allowoutput: 1; // 值类型
}
const obj: IObjInfer = {
  name: " z s ",
  age: 21,
  eat() {
    console.log(this.name + " eating");
  },
  allowoutput: 1,
};
class StringUtil {
  // 工具类🔧
  // + -> 1或多个。 * -> 0或多个。 ? -> 0或1个。
  public static trimSpace(str: string): string {
    return str.replace(/\s*/g, "");
  }
}
const outputFn = (obj: any) => {
  if (obj == null || (typeof obj === "object" && !("allowoutput" in obj))) {
    throw new TypeError("不是一个合法的对象");
  }
  let value;
  if ("allowoutput" in obj) {
    // 监测属性是否在 obj 中存在🍓
    Object.keys(obj).forEach((_key) => {
      value = obj[_key];
      // "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" - typeof 可以判断的类型范围就这么多。 和 js 一样。
      // 类型守卫... 变量范围 缩小为 string 类型， 在 if 块中 value 则为 string 类型.
      if (typeof value === "string") {
        // 这里判断后，value点出来的都是 字符串的属性。
        console.log(_key + ": string", StringUtil.trimSpace(value));
        obj[_key] = StringUtil.trimSpace(value);
      } else if (typeof value === "function") {
        /** 🚗🚗🚗~
         * 这里打印不到 name, this 指向发生了改变。
         * 在外部执行 对象内部函数的时候，this 指向发生了改变。 指向了全局环境。
         * 浏览器环境中，指向了 window。
         */
        value.call(obj);
      } else {
        console.log(`key: ${_key}, value: ${value}`);
      }
    });
  }
};
outputFn(obj);
// null == undefined // true
```

### 类型守卫实现

**定义：在语句的块级作用域 [ if 语句内 / 条目运算符表达式内 ] 缩小变量的一种类型推断的行为。🍓🍓🍓**

`[ if ] / [ ? : ]`类型守卫可以帮助我们在块级作用域中更加精确，从而减少不必要的类型断言。 [其实就是`if/else`]。

**`TS`条件语句中遇到下列 👇 条件关键字时，会在语句的块级作用域内缩小变量的类型，这种类型推断的行为称作 类型守卫。 ✨**

#### `typeof` - 类型判断

- **作用 - 用来检测一个变量或者一个对象的数据类型。**
- **范围 - `"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"`**

```typescript
typeof []; // object
typeof new Array(); // object
typeof new Set(); // object
typeof new Map(); // object

// 其实就是 new 底层改变的。 Ts中时不能 new 一个函数的，只能 new 类。🥱 🍓🍓🍓
// 所以之后 typeof 检测除了 function 的其它一些引用类型都是 object 。🍓
const fn = () => {};
typeof fn; // function

class A {}
Object.prototype.toString.call(new A()); // [object Object]
```

- **`typeof`局限性 🍓🍓🍓**

  - **`typeof null`结果为`object`[ 设计 bug ]。**

    **`null` 本身就是一个数据类型，也是值。 所以如果是「 `typeof null === null` 」最合适了。 ⚠️**

  - **`typeof`检测引用类型。 几乎都是`object`。 `typeof` 函数`function`除外。**

  - **`typeof`检测`set map`。 也是 `object`。**

- `typeof`的替代方案。 是`object`创建的，构造函数是`[1]`标示的。

  ```js
  Object.prototype.toString.call; // 🍓🍓🍓
  Object.prototype.toString.call([]); // [object Array]
  Object.prototype.toString.call(null); // [object null]
  Object.prototype.toString.call(new Set()); // [object Set]
  Object.prototype.toString.call(new Map()); // [object Map]
  ```

  **`typeof` 无法获取一个[ 自定义的类的实例变量 ]或者[ 构造函数的对象变量 ]的 真正创建类型。 可以使用 `instanceof` 来检查。**

#### `in`

**属性 / 方法 / 函数 判断 [ 通常判断 属性/方法 在对象中是否存在 ✨✨✨~ ]**

#### `instanceof` - 实例判断

- **格式：对象变量 `instanceof` 类名/函数名**

- **作用：`instanceof` 可以判断一种自定义函数或者类创建的对象变量的数据类型。**

  **`instanceof` 执行后返回 `true` 的几种条件：**

  ```typescript
  // 对象变量.__ptoro__[+ ~ 标示 1或者多个 ~] = 类名/函数名.prototype
  class AP {}
  class A extends AP {}
  const s = new A();
  s instanceof A; // true        s.__proto__ === A.prototype;
  s instanceof AP; // true       s.__proto__.__proto__ === AP.prototype;
  s instanceof Object; // true   s.__proto__.__proto__.__proto__ === Object.prototype;
  s instanceof Function; // false
  ```

- **应用场景：**

  **需要判断 归属类 的时候。**

  **`typeof`之外的功能判断。**

  ```typescript
  class Car {
    public total: number = 0;
    show() {}
    public aa() {
      return (this.total += 3 * 2);
    }
    public bb() {
      // 累加 只要 new出来后，使用的是 同一块内存空间。
      this.aa();
      return (this.total += this.total * 3);
    }
  }
  class Bus {
    say() {}
  }
  class Customer {
    /**
     * 因为是联合类型，就是不想写多个方法。想一个方法兼容所有车。共用方法调用一次即可。
     * 方法重载是 返回值以及参数不一致，功能一致，只是实现的细节不一致。
     * 所以使用 方法重载很不合适的。
     * 但是可以使用 多态 解决。
     */
    haha(a: Car | Bus) {
      // a.show(); // 报错 类型“Bus”上不存在属性“show”。
      if (a instanceof Car) {
        // 缩小 归属类 范围。
        a.bb();
        a.show();
      }
      // 扩展✨： 子类当中无法使用父类的属性。
    }
  }
  new Customer().haha(new Car());
  ```

#### `== / === / != / !==`

**字面量相等判断**
