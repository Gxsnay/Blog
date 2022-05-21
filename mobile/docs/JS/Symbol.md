# `JS` - `Symbol`

> `Es6` 引入了一种新的原始数据类型 `Symbol` ，表示独一无二的值，最大的用法是用来定义对象的唯一属性名。
>
> `Es6` 数据类型除了 `Number` 、 `String` 、 `Boolean` 、 `Object`、 `null` 和 `undefined` ，还新增了 `Symbol` 。

**`Symbol` 代表唯一值**

**`Symbol` 是一个原始类型 是没有`new`的**

**`Symbol`不能转换成字符串或者数值 (报类型错误)， 转换成布尔的时候是`true`**

> `es6` 内置了`11个 symbol` 叫`well-known symbol`
>
> 他们都是`Symbol`函数的属性，指向内部使用的方法和属性， 可以通过他们改变语言的原生行为。

## 声明定义 `Symbol` 的的几种方式

```js
let gl = Symbol(); // () 里面可以添加 一些描述 e.g: Symbol('郭霖')
console.log(typeof gl); // symbol
console.log(gl); // Symbol()
console.log(gl.toString()); // Symbol()
console.log(gl.description); // description 就是提供一个 symbol 的描述

let a = Symbol();
let b = Symbol();
console.log(a === b); // false;
```

## `Symbol.for` - 共享 `Symbol`

**`Symbol.for()` 方法使用时，就是看有没有注册 `Symbol` 有的话就返回 没有就注册一个新的。**

```js
let a1 = Symbol.for("gl"); // 这里声明了 gl 描述的 symbol值
let b1 = Symbol.for("gl"); // 这里再次声明的时候 先去查找有没有相同描述的 如果有就直接引用了~
console.log(a1); // Symbol(gl)
console.log(a1 === b1); // true

let uid = Symbol.for("uid");
let obj = {
  [uid]: "123",
};
console.log(object[uid]); // '123'
console.log(uid); // Symbol(uid)
let uid2 = Symbol.for("uid");
console.log(uid === uid2); // true
console.log(obj[uid2]); // '123'
console.log(uid2); // Symbol(uid)
console.log(Symbol("uid") === Symbol("uid")); // false
```

## `Symbol.keyFor()`

**`Symbol.keyFor()` - 这个只跟 `Symbol.for` 有关系，如果只是指定了个 `Symbol` 值 会打印 `undefined`**

```js
let a = Symbol.for("gl"); // 这里会在全局的定义里面进行保存~
console.log(Symbol.keyFor(a)); // gl
let ab = Symbol("gl"); // 这个是只是没有定义在全局~
console.log(Symbol.keyFor(ab)); // undefined

let uid3 = Symbol("uid"); // for - keyFor 是对应的
console.log(Symbol.keyFor(uid3)); // "undefined"
```

### `Object.getOwnPropertySymbols()`

**可以使用`Object.getOwnPropertySymbols()`方法查找对象的`symbol`属性**

```js
let id = Symbol.for("id");
let obj1 = {
  [id]: "123",
};
let symbols = Object.getOwnPropertySymbols(obj1);
console.log(symbols.length); // 1
console.log(symbols[0]); // Symbol(id)
console.log(obj1[symbols[0]]); // '123'
```

### `Symbol.hasInstance`

**`Symbol.hasInstance`用来判断给定的对象 是否是 该函数的实例，它是函数原型上面的方法。**

```js
let a = 12;
a instanceof Number; // false
Number[Symbol.hasInstance](a); // false
Object.defineProperty(Number, Symbol.hasInstance, {
  value: function (n) {
    return typeof n === "number";
  },
});
a instanceof Number; // true
```

### `Symbol.isConcatSpreadable`

**`concat()`方法用于合并两个或者多个数组，默认数组元素是展开的，它的值是`undefined`**

**如果不想展开，则将它的值设置为`false`**

```js
let a = ["a", "b"];
let n = [1, 2];
console.log(a.concat(n, 3)); // [a, b, 1, 2, 3] 共有 5 个元素
console.log(a[Symbol.isConcatSpreadable]); // undefined
n[Symbol.isConcatSpreadable] = false;
console.log(a.concat(n, 3)); // [a, b, [1, 2], 3] 共有 4 个元素
// 对类数组也适用，只要有 length 属性。 合并的时候根据 length 的值，
// - 查找 obj[0]到obj[length - 1] 的值进行合并，所以 obj 也要有 0 到 length-1 的属性值
let c = {
  0: "a",
  1: "b",
  2: "c", // 这个值不会被合并 因为 length 属性的h值是 2
  length: 2,
  [Symbol.isConcatSpreadable]: true,
};
let r = ["abc"].concat(c);
console.log(r.length); // 3;
console.log(r); // ['abc', 'a', 'b']
```

## 使用 `Symbol` 解决字符串耦合的问题~

```js
let obj = {
  gl: { name: "gl" },
  gl: { name: "guolin" },
};
console.log(obj); // 同样的字符串类型 后面的就会把前面的覆盖掉~

let user1 = {
  name: "gl",
  key: Symbol(),
};
let user2 = {
  name: "gl",
  key: Symbol(),
};
let obj = {
  [user1.key]: { name: "gl1" },
  [user2.key]: { name: "gl2" },
};
console.log(obj); // {Symbol(): {…}, Symbol(): {…}} // 这样就有两个属性了~
console.log(obj[user2.key]); // { name: 'gl2' }
```

## `Symbol` 在缓存容器中的使用

```js
class Cache {
  static data = {};
  static set(name, value) {
    return (this.data[name] = value);
  }
  static get(name) {
    console.log(this.data[name]);
    return this.data[name];
  }
}

// Cache.set('name', 'gl')
// Cache.get('name') // gl
let user = {
  name: "apple",
  key: Symbol("User 信息"),
};
let cart = {
  name: "apple",
  key: Symbol("购物车信息"),
};
Cache.set(user.key, user);
Cache.set(cart.key, cart);
Cache.get(user.key); // {name: "apple", key: Symbol(User 信息)}
Cache.get(cart.key); // {name: "apple", key: Symbol(购物车 信息)}
```

## `Symbol` - 扩展性与对象属性保护

```js
let sybom = Symbol("这是一个 symbol 类型");
let gl = {
  name: "gl",
  [sybom]: "www.baidu.com", // 这类的属性类似与 私有属性 - 受保护的~
};
for (const key in gl) {
  console.log(key); // name
}
for (const key of Object.keys(gl)) {
  console.log(key); // name - 也打印不到~
}
```

## 遍历对象里面的`Symbol`属性

```js
for (const key of Object.getOwnPropertySymbols(gl)) {
  console.log(key); // Symbol(这是一个 symbol 类型)
}
// 如果要遍历 对象里面的 所有属性
for (const key of Reflect.ownKeys(gl)) {
  console.log(key); // name Symbol(这是一个 symbol 类型)
}
```

```js
let site = Symbol("这是一个 Symbol ");
class User {
  constructor(name) {
    this.name = name;
    this[site] = "gl";
  }
  getName() {
    console.log(`${this[site]} - ${this.name}`);
    return `${this[site]} - ${this.name}`;
  }
}
let ls = new User("李四");
ls.getName(); // gl - 李四
// 但是 这个属性是隐藏的
for (const key in ls) {
  console.log(key); // name 这样是打印不到的~
  // 如果是 对象的私有属性 不想再外部访问到 就使用 Symbol 属性来进行设置
}
```
