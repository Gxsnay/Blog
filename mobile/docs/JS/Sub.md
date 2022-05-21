# `JS` - `Sub`

> `JS` - 查缺补漏，作用域 / 原型 / 模版字面量等。

## 模版字面量

**模板字面量是允许嵌入 表达式 的字符串字面量。可以使用多行字符串和字符串插值功能。**

- **模板字面量的插值是指所有合法的`JS`表达式，包括函数调用等。**
- **插值表达式 还支持嵌套。**

```js
const classes = `header ${isHa() ? "" : `${isXi()}`}`; // 呐 嵌套
```

- **模板字面量 最前面可以跟一个函数， 这个函数叫做 模板字符串的`tag`。🌊 神奇~**

```js
let person = "Mike";
let age = 28;
function myTag(strings, personExp, ageExp) {
  let str0 = strings[0]; // that
  let str1 = strings[1]; // is a
  // 最后还有一项， 不过它的值是 空字符串
  // let str2 = strings[2];
  let ageStr = "";
  if (ageExp > 99) {
    ageStr = "centenarian";
  } else {
    ageStr = "youngster";
  }
  return str0 + personExp + str1 + ageStr;
}
let outputStr = myTag`that ${person} is a ${age}`;
console.log(outputStr); // that Mike is a youngster
```

- `tag`函数的第一个参数 还有一个`raw`属性，它的值是 模板字符串 被转义之前的值，也可以使用内置的`String.raw`方法

  原始字符串`raw / value`。

  ```js
  let message1 = `Mu\nSt`;
  let message2 = String.raw`Mu\nSt`;
  console.log(message1); // Mu
  // St
  console.log(message2); // Mu\nSt
  ```

## 作用域

- **`variable` - 变量，是值的符号名称。 变量的名字叫标识符。`let x = 1; `中的`x`就是变量。**
- **`value` - 值，即数据，比如 字符串，数值，函数等。**
- **`name-binding` - 变量和值所建立的联系。`let x = 1;`**
- **`scope` - 作用域，指代码中 `name-binding`的有效范围。**

### 静态作用域

如果函数中的变量，没有在该函数中定义，就去**定义 🍓~**该函数的地方查找。

**静态作用域，也叫词法作用域，代码写完后，变量的作用域就确定不变了。**

**`JS`也是静态作用域 🐖~🍓🍓🍓**

```js
let x = 10;
function f() {
  return x;
}
function g() {
  let x = 20;
  return f();
}
console.log(g()); // 10
```

### 动态作用域

如果函数中的变量，没有在该函数中定义，就去**调用**该函数的地方查找。

**动态作用域，代码写完后， 变量的作用域还无法确定，他和调用他所在的函数有关。**

### `var`声明提前

**函数内所有使用`var`声明的变量在函数体内可见。 这意味着变量在声明之前已经可用，这个特性就叫声明提前，即函数中所有变量以及函数声明都会提升至函数体的顶部。**

```js
var x = 5;
function f() {
  // undefined  声明提前，但赋值不会。
  console.log(x); // undefined
  var x = 10;

  // 相当于 ~~~ ~~~
  // var x;
  // console.log(x);
  // x = 10;
}
f();
```

### 函数声明提前

```js
function f() {
  x();
  function x() {
    console.log(1);
  }
}
f();
```

**函数表达式 不可以提前**

```js
function f() {
  x();
  var x = function () {
    console.log(1);
  };
  // 相当于 ~~~ ~~~ ⚠️
  // var x;
  // x();
  // function() {}
}
f();
```

**函数声明提前 高于 变量声明提前 🍓🍓🍓**

```js
var double = 22;
function double(num) {
  return num * 2;
} // 这里 var声明 在 函数声明 后面，var声明 都就会将其覆盖掉，然后检测出是 number属性。
console.log(typeof double); // 'number'🍓

// 相当于 ~~~ ~~~
// function a() {};
// a = 1;
// typeof a; // 'number'
```

### 块级作用域

- **是指变量在指定块的作用域外部无法被访问，它位于 一对花括号 中。**

  > 语法和`var`语句一样，只是它使用`let`或者`const`来声明。

- **块级作用域 - 禁止重复声明**

  > **如果变量在语句块中已经有定义，则无法再使用`let`或者`const`进行重复声明，会报语法错误。**

- **使用`const`声明的原始类型，是常量，之后不能更改，不然会报类型错误。**

  **使用`const`声明的对象类型变量，变量本身无法赋值为其他类型，但他的属性可以修改。🐖~**

  ```js
  const obj = Object.freeze({});
  obj.prop = 123; // 冰冻(freeze)之后 是添加不了属性的。
  ```

- **`x`的暂时性死区，上面区域中的所有代码不能访问`x`**

  ```js
  var x = 1;
  if (true) {
    // ReferenceError: x is not defined。
    console.log(x);
    // 👆 x的暂时性死区 上面区域中的所有代码不能访问 x
    let x = 2;
  }
  ```

- **循环语句中的常量声明**

  > `for`循环中使用`const`因为声明了常量 所以`i++`修改会报错，只循环了一次。
  >
  > **`for...in / for...of` 中可以使用 `const`**

- 🍓🍓🍓 **全局块级绑定** 🍓🍓🍓

  - **使用`var`声明的变量会成为全局对象的属性，意味着可能会无意覆盖已存在的全局属性。**
  - **使用`let`和`const`声明的全局变量，不会添加到全局对象上。**

**最佳实践 🐖~🐖~🐖~**

1. **优先使用 `const`**
2. **如果之后改变，则使用 `let`**
3. **避免使用 `var`**

### 作用域链

**在`JS`的最顶层代码中，作用域链由一个全局对象组成，这个全局对象可以通过`this`访问到**

- 在没有被嵌套的作用域中，作用域链上有两个对象，第一个是包含局部变量的对象，第二个是全局对象。前者无法被`JS`代码访问，是不可见的内部实现。

- 在被嵌套的作用域中，作用域链上至少有三个对象。

- 了解**作用域链延长**的情形

  - **有些语句可以在作用域链的前端临时增加一个变量对象，该变量对象在代码执行完成后被移除。**

    **`try-catch` 语句中的 `catch` 块。**

    - `catch`语句会创建一个新的变量对象，它的值是被抛出的错误对象。
      在代码进入`catch`语句时，这个错误对象会被添加到 作用域的顶端，当执行完`catch`语句时，该对象不再可用。

    **`with` 语句。**

    - `with`可将某个对象添加到作用域链的顶端， 然后执行`with`语句块中的代码，
      执行完成后会把 作用域链恢复到原来的状态。

      ```js
      function f(foo, x, y) {
        with (foo) {
          console.log(x, y); // 1, 3
        }
        console.log(x, y); // 2, 3
      }
      f({ x: 1 }, 2, 3);
      ```

## 原型

### `prototype`

**每一个`JS`对象(`null` 除外) 都和另外一个对象相关联，这另外一个对象就是原型，每一个对象都从原型继承属性。**

```js
let o = {}; // - [[prototype]] - Object.prototype
let a = new Array(); // - [[prototype]] - Array.prototype
let p = { x: 1 },
  q = Object.create(p); // - [[prototype]] - p: { x: 1 }
```

- **获取对象的原型属性**

  **`Object.getPrototypeOf(子) === 父`**

  ```js
  Object.getPrototypeOf(someObj);
  let o = {};
  console.log(Object.getPrototypeOf(o) === Object.prototype); // true
  
  // 针对 某些浏览器 就可以。 o.__proto__ === Object.prototype  例如 火狐或者谷歌
  ```

### `__proto__`

`__proto__`属性 是可写的，但是不推荐直接定义去写入。

**推荐 ✨ `Object.setPrototypeOf(obj, prototype);`**

```js
let a = { x: 1 };
let o = {};
Object.setPrototypeOf(o, a);
Object.getPrototypeOf(o) === a; // true
```

- **`isPrototypeOf` - 检测是否为某个对象的原型**

  `父.isPrototypeOf(子)` - `someObj.isPrototypeOf(anotherObj);`

  ```js
  let a = { x: 1 };
  let o = Object.create(a);
  a.isPrototypeOf(o); // true
  Object.prototype.isPrototypeOf(o); // true
  ```

### `prototype` & `__ptoto__`

**`prototype` 和 `__ptoto__` 都是对象的属性。**

- **`prototype`是函数对象的属性** - 当成构造函数，定义它的原型对象。

- **`__ptoto__` 任意对象的属性** - 自身构造函数的原型对象

  > 函数也是对象, 所以函数也有 `__proto__`

### 对象区分

| **内置对象**   | **`Array / Date / Math / String / Number / Function` 等等** |
| -------------- | ----------------------------------------------------------- |
| **宿主对象**   | **`Window / History / HTML-document / global`等等**         |
| **自定义对象** | **自己创建的类(构造函数 ) `new`出来的对象**                 |

### `super`

**对象中的`super`关键字指向该对象的原型**

```js
let obj1 = {
  method1() {
    return "method1 1";
  },
};
let obj2 = {
  method2() {
    return super.method1();
  },
};
Object.setPrototypeOf(obj2, obj1);
console.log(obj2.method2()); // "method1 1"
```

### **`Object.create`**

**`Object.create(proto, [, propertiesObject]);`**

`Object.create`的第二个参数和`Object.definePrototype(obj, props)`的第二个参数是一样的

```js
const Car = Object.create(null);
Car.prototype = {
  getInfo: function () {
    return "A" + this.color + " " + this.desc + ".";
  },
};
const car = Object.create(Car.prototype, {
  color: {
    writable: true,
    configurable: true,
    value: "red",
  },
  rawDesc: {
    writable: true,
    configurable: true,
    value: "Porsche boxter",
  },
  desc: {
    configurable: true,
    get: function () {
      return this.rawDesc.toUpperCase();
    },
    set: function () {
      this.rawDesc = value.toLowerCase();
    },
  },
});
console.log(car.getInfo()); // 'A RED PORSCHE BOXTER.'
```

### 原型链

**自身有该属性的话 就不会向上查找， 就近原则。 🍓~ 就截至了~**

```js
let a = new Array(); -> Array.prototype -> Object.prototype -> null
// 一般最后都继承自 Object.prototype 的

// 自身 实例对象 上的属性
p.name ? p.name :
// p.__proto__ === Person.prototype 自身构造函数 或者 自身__proto__上查找属性
p.__proto__.name ? p.__proto__.name :
// p.__proto__.__proto__ === object.prototype / object.__proto__
p.__proto__.__proto__.name ? p.__proto__.__proto__.name :
// 最后查找最高层级 null 没有 就报错~
null.name;
```

> 🐖~ 为啥有`null`呢？
>
> 就是因为`Object.__proto__`也是一个对象，所以就死循环了。 `js`就判断再向上查找就是 空对象引用`Null`。

`new Perosn()`过程 - `Person`的实例对象，然后将 `Perosn.prototype` 赋值给 `new Perosn().__proto__` 🍓🍓🍓

**原型对象的属性被 所有实例 共享，不过多占用。**

```js
function Person() {}
Person.prototype.name = "GL";
Person.prototype.age = 18;
Person.prototype.sayName = function () {
  console.log(this.name);
};

const p1 = new Person();
const p2 = new Person();
p1.sayName();
p2.sayName();
console.log(p1.sayName === p2.sayName); // true
console.log(p1.sayName === Person.prototype.sayName()); // true
```

**原型对操作对象属性的影响**

| 属性描述符         | 数据描述符 | 存取描述符 | 描述                                                                                                                                   |
| ------------------ | ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **`configurable`** | **`Yes`**  | **`Yes`**  | **当且仅当`configurable`为`true`的时候，该属性才能够改变，同时该属性能从对象上被删除，默认为`false`**                                  |
| **`enumerable`**   | **`Yes`**  | **`Yes`**  | **当且仅当`enumerable`为`true`的时候，该属性才能够枚举，默认为`false`**                                                                |
| **`writable`**     | **`Yes`**  | **`No`**   | **当且仅当`writable`为`true`的时候，`value`的值才能被赋值运算符改变，默认为`false`**                                                   |
| **`value`**        | **`Yes`**  | **`No`**   | **`value`该属性对应的值，默认为`undefined`**                                                                                           |
| **`set`**          | **`No`**   | **`Yes`**  | **给属性 提供`setter`方法，如果没有`setter`则为`undefined`。 该方法将接受唯一参数，并将该参数的新值分配给该属性，默认为`undefined`。** |
| **`get`**          | **`No`**   | **`Yes`**  | **给属性 提供`getter`方法，如果没有`getter`则为`undefined`。 该方法返回值被用作属性值，默认为`undefined`。**                           |

- **查询属性**

  查询属性**会沿着对象的原型链一级一级往上查询，直到找到目标属性或者原型是`null`的对象为止。**

  ```js
  function Person() {}
  Person.prototype = {
    name: "Gl",
    age: 18,
  };
  const p1 = new Person();
  console.log(p1.age);
  console.log(p1.toString);
  ```

- **添加属性**

  首先**检测对象是否允许添加属性，如果允许，则在原始对象上创建属性或者更改已有的属性。**

  **添加属性操作不会修改原型链。**

  ```js
  // - 添加属性 - 只读属性 - 不允许添加的
  "use strict";
  function Person() {}
  Person.prototype = {
    name: "Gl",
    age: 18,
  };
  Object.defineProperty(Person.prototype, "from", {
    writable: false,
    value: "China",
  });
  const p1 = new Person();
  p1.from = "123";
  console.log(p1.from); // 'China'
  ```

  ```js
  // - 添加属性 - 属性在原型上已存在 - 不会修改原型链
  function Person() {}
  Person.prototype = {
    name: "John",
    age: 23,
  };
  const p1 = new Person();
  const p2 = new Person();
  p1.name = "Hunt";
  console.log(p1.name); // 'Hunt'
  console.log(p2.name); // 'John'
  ```

  ```js
  // - 添加属性 - setter
  function Person() {}
  Person.prototype = {
    firstName: "John",
    lastName: "Smith",
    set fullName(value) {
      let names = value.split(" ");
      this.firstName = name[0];
      this.lastName = name[1];
    },
  };
  const p1 = new Person();
  p1.fullName = "Nicholas Cage";
  console.log(p1.firstName); // Nicholas
  ```

- **删除属性**

  **`delete` - 运算符只能删除对象的自身属性，不能删除从原型继承而来的属性。**

- **检测属性**

  **`in` / `hasOwnProperty` / `propertyIsEnumerable`等方法来检测属性是否存在。**

  - **`in` 比 `hasOwnProperty` 多检测原型链 上的属性**
  - **`propertyIsEnumerable` 是 `hasOwnProperty` 的增强版， 是自身属性并且是可枚举属性时才返回`true`。**

- 扩展 - **枚举属性**

  - **可以使用`for/in` / `Object.keys` / `Object.getOwnPropertyNames` 来枚举对象的属性**
    - **`for/in` 是 自身以及原型的可枚举属性**
    - **`Object.keys` 是 自身可枚举属性**
    - **`Object.getOwnPropertyNames`是 自身 的所有属性 (可不可枚举都算)**

### 注意 ⚠️

- **性能**
  - **查询属性会遍历 原型链，有一定的性能问题。**
  - **要注意代码中的原型链的长度，并在必要时将其分解，以避免潜在的性能问题**
- **共享带来的问题**
  - **原型上的属性被所有实例共享，如果属性值是对象类型，则某个实例更改后会影响其他实例， 这不是我们所期望的效果。**
- **不要扩展原型**
  - **影响面太大，出错的可能性很高。**

**`JS`没有 继承 这个概念，是伪继承。其实就是 对象的检索机制。**

## `==` & `===`

### 使用场景

**`==` 就是可以 模糊的进行比较 比如`null / undefined`**

**`===` 就是我只需要 相同类型 的结果，进行比较**

**如果我们所有的比较都用`===`比较的话， 有些会比较麻烦，`JS`是弱类型，所以看情况来定。**

> **使用的场景，想要达到什么效果，想要判断那些限制~✨✨**

## 逻辑运算符

- `!(非运算符)` - **可以被转换成`false`的表达式有： `null / NaN / "" / 0 / undefined`**
- `&&(逻辑与)` - `cb && cb();`
- `||(逻辑或)` - `const keys = !(isArray(obj)) && Object.keys(obj), length = (keys || obj).length;`
- ` ，逗号运算符` - `a = (b = 1,c = 2);` - `a-2 / b-1 / c-2`

### 逻辑与 和 逻辑或 的区别

- **逻辑与 都成立会执行到最后，不成立我会返回遇到`false`的那一项。**

  ```js
  1 && 2; // 2
  1 && 2 && 0; // 0
  0 && 1 && 2; // 0
  ```

- **逻辑或 只返回成立的第一项，都不成立，返回最后一项。**

  ```js
  1 || 2 || 0; // 1
  0 || "" || false; // false
  0 || "" || 1 || false; // 1
  ```
