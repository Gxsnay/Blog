# `JS` - `Code`

> `Promise` / `单例模式` / `观察者模式` / `Flat` / `module模块化` / `New` - `Apply` - `Call` - `Bind` / `常用函数` 的实现

## `Promise`

```js
class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(executor) {
    this.status = MyPromise.PENDING;
    this.value = null;
    this.callbacks = [];

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.FULFILLED;
      this.value = value;
      this.callbacks.forEach((item) => {
        item.onFulfilled();
      });
    }
  }

  reject(reason) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.REJECTED;
      this.value = reason;
      this.callbacks.forEach((item) => {
        item.onRejected();
      });
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : () => this.value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : () => {
            throw new Error(this.value);
          };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === MyPromise.PENDING) {
        this.callbacks.push({
          onFulfilled: (value) => {
            this.parse(promise2, onFulfilled(value), resolve, reject);
          },
          onRejected: (reason) => {
            this.parse(promise2, onRejected(reason), resolve, reject);
          },
        });
      }
      if (this.status === MyPromise.FULFILLED) {
        setTimeout(() => {
          this.parse(promise2, onFulfilled(this.value), resolve, reject);
        });
      }
      if (this.status === MyPromise.REJECTED) {
        setTimeout(() => {
          this.parse(promise2, onRejected(this.value), resolve, reject);
        });
      }
    });

    return promise2;
  }

  catch(onErrorCb) {
    return this.then(null, onErrorCb);
  }

  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason;
        })
    );
  }

  parse(promise, result, resolve, reject) {
    if (promise === result) throw new Error("Chaining Cycle");
    if (
      (result && typeof result === "object") ||
      typeof result === "function"
    ) {
      let used;
      try {
        let then = result.then;
        if (typeof then === "function") {
          then.call(
            result,
            (y) => {
              if (used) return;
              used = true;
              this.parse(promise, y, resolve, reject);
            },
            (r) => {
              if (used) return;
              used = true;
              reject(r);
            }
          );
        } else {
          if (used) return;
          used = true;
          resolve(result);
        }
      } catch (error) {
        if (used) return;
        used = true;
        reject(result);
      }
    } else {
      resolve(result);
    }
  }

  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      if (value instanceof MyPromise) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let values = [];
      promises.forEach((promise) => {
        promise
          .then((value) => {
            values.push(value);
            if (values.length === promises.length) {
              resolve(values);
            }
          })
          .catch((reason) => {
            reject(reason);
          });
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.map((promise) => {
        promise
          .then((value) => {
            resolve(value);
          })
          .catch((reason) => {
            reject(reason);
          });
      });
    });
  }
}
```

## `Only` - 单例模式

```js
class AudioPlayer {
  // 声明一个全局类
  constructor(opt = {}) {
    // 这块没看懂
    this.audioEle = document.createElement("audio"); // createElement() 方法通过指定名称创建一个元素
    // 创建一个 音频 标签
  }

  /**
   * 单例模式
   * @param {*} opts
   * @description 在类中添加一个静态成员变量用于保存单例实例。
   */
  static getInstance(opts = {}) {
    // 增加一个 线程锁
    if (!this.instance) {
      this.instance = new AudioPlayer(opts);
    }
    // 能尽早 return 就不要使用 else 更好的处理和语义化
    return this.instance;
  }

  play(src) {
    // 播放
    if (this.src != src) {
      // 如果目前传递进来的 src 不等于目前存着的 src
      // init-play-methods ~
      this.src = src;
      this.currentTime = 0;
    }
    this.audioEle.play(); // 调用这个
    return this; // 链式调用
  }

  pause() {
    // 暂停
    if (!this.paused) {
      this.audioEle.pause();
    }
    return this;
  }

  on(opts = {}) {
    // 绑定事件
    const { timeupdate = null } = opts;
    if (typeof timeupdate == "function") {
      // addEventListener() 方法用于向指定元素添加事件句柄。
      // -> params-1 必须。字符串，指定事件名。 不使用on前缀~ 使用'click' 而不是 'onclick'
      // -> params-2 必须。指定要事件触发时执行的函数。
      // -> params-3 可选。布尔值，指定事件是否在捕获或冒泡阶段执行。  默认 false。
      // 使用 removeEventListener() 方法来移除 addEventListener() 方法添加的事件句柄。
      this.audioEle.addEventListener("timeupdate", () => {
        // timeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发。
        // 常与 Audio/Video 对象的 currentTime 属性一起使用，该属性返回音频/视频（audio/video）的播放位置（以秒计）。
        if (this.LastCurrentTime != this.currentTime) {
          // 这里因为 toFixed 了 所以这样是一秒调用一次
          this.LastCurrentTime = this.currentTime;
          timeupdate(this.LastCurrentTime);
        }
      });
    }
  }

  // 对象里面是有 get set 方法的 很强大
  // 播放地址
  get src() {
    return this.audioEle.src || "";
  }
  set src(value) {
    this.audioEle.src = value;
  }

  // playbackRate 属性设置或返回视频的当前播放速度。
  get playbackRate() {
    if (this.src) {
      return this.audioEle.playbackRate;
    } else {
      return 1;
    }
  }
  set playbackRate(value) {
    this.audioEle.playbackRate = value;
  }

  // paused 属性返回视频是否已暂停。
  get paused() {
    if (this.src) {
      return this.audioEle.paused;
    } else {
      return true;
    }
  }

  // currentTime 属性设置或返回视频播放的当前位置（以秒计）。
  get currentTime() {
    // 当前播放长度
    if (this.src) {
      return this.audioEle.currentTime.toFixed(0);
    } else {
      return 0;
    }
  }
  set currentTime(value) {
    this.audioEle.currentTime = value;
  }

  // duration 属性返回当前视频的长度，以秒计。
  get duration() {
    // 音频长度
    if (this.src) {
      return this.audioEle.duration;
    } else {
      return 0;
    }
  }

  // ended 属性返回音频是否已结束。
  // 如果播放位置位于音频的结尾时，则音频已结束。
  get ended() {
    if (this.src) {
      return this.audioEle.ended;
    } else {
      return true;
    }
  }

  // 对象的 code 属性包含了音频/视频的错误状态。
  get error() {
    return this.audioEle.error;
  }

  // loop -> 属性是一个 boolean（布尔） 属性。 - loop 属性规定当视频结束后将重新开始播放。
  get loop() {
    if (this.src) {
      return this.audioEle.loop;
    } else {
      return false;
    }
  }
  set loop(value) {
    this.audioEle.loop = value;
  }
}

const createInstance = function (opts = {}) {
  return AudioPlayer.getInstance(opts);
};

/**
 * 默认实例
 */
const audio = createInstance();

audio.AudioPlayer = AudioPlayer;
/**
 * 自定义实例
 * 应用场景：初始化默认参数
 * 一个应用建议仅使用一个实例，如需自定义请自行构建单例模式
 */
audio.create = function (opts = {}) {
  return createInstance(opts);
};

module.exports = audio;
```

## `Event` - 观察者模式

```js
class Event {
  constructor() {
    this.list = {};
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Event();
    }
    return this.instance;
  }

  on(key, fn) {
    (this.list[key] || (this.list[key] = [])).push(fn);
    return this;
  }
  emit() {
    const key = Array.prototype.shift.call(arguments),
      fns = this.list[key];
    for (let i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, arguments);
    }
    return this;
  }
  off(key, fn = null) {
    const fns = this.list[key];
    if (fn) {
      fns.forEach((_fn, index) => {
        fn === _fn && fns.split(index, 1);
      });
    } else {
      fns.length = 0;
    }
    return this;
  }
}

function createEvent() {
  return Event.getInstance();
}
const objA = createEvent();
objA
  .on("mOne", () => {
    console.log("打印第一个方法");
  })
  .on("mTwo", () => {
    console.log("打印第二个方法");
  })
  .emit("mOne")
  .off("mOne")
  .emit("mOne")
  .emit("mTwo");
```

## `Clone` - 深拷贝

```js
function deepClone(obj) {
  if (typeof obj !== object || obj == null) return obj;
  const cObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cObj[key] = deepClone(obj[key]);
    }
  }
  return cObj;
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
const obj1 = {
  x: 1,
  y: {
    a: {
      b: 1,
    },
  },
  z: [1, 2, 3],
};
const obj2 = deepClone(obj1);
obj2.z.push(5);
obj2.y.a = { b: 2 };
console.log("obj2", obj2);
console.log("obj1", obj1);
```

> **取巧版深拷贝 - `JSON.parse(JSON.stringify(obj))`**

## `Flat` - 展开

**`const arr = [1, [2, [3, [4, [5]]]]]`**

### 只展开一层

```js
Array.prototype.flat1 = function () {
  return this.reduce((pre, cur) => pre.concat(cur), []);
};
const arr1 = arr.flat1();
console.log("arr1", arr1); // [1, 2, Array(2)]
```

### 可指定层级

```js
Array.prototype.flat2 = function (deep = 0) {
  const rcs = (arr, deep) => {
    return +deep
      ? arr.reduce(
          (pre, cur) =>
            pre.concat(Array.isArray(cur) ? rcs(cur, deep - 1) : cur),
          []
        )
      : Array.from(arr);
  };
  return rcs(this, deep);
};
const arr2 = arr.flat2(3);
console.log("arr2: ", arr2); // [1, 2, 3, 4, Array(1)]
```

### `toString` 默认展开所有

```js
Array.prototype.flat3 = function () {
  return this.toString()
    .split(",")
    .map((item) => +item);
};
const arr3 = arr.flat3();
console.log("arr3: ", arr3); // [1, 2, 3, 4, 5]
```

### `forEach` 指定层级

> **`forEach` 遍历数组会自动跳过空元素，但是下标不会变**
>
> ```js
> [1, , 3].forEach((item, index) => console.log(item, index)); // 1-0 3-2
> ```

```js
Array.prototype.flat4 = function (deep = 0) {
  const result = [];
  (function flat(arr, deep) {
    arr.forEach((item) => {
      if (Object.prototype.toString.call(item) === "[object Array]" && +deep) {
        flat(item, deep - 1);
      } else {
        result.push(item);
      }
    });
  })(this, deep);
  return result;
};
const arr4 = arr.flat4(3);
console.log("arr4: ", arr4); // [1, 2, 3, 4, Array(1)]
```

### `for...of...` 指定层级

> **`for...of...` 遍历数组不会跳过空元素，需要判断。**
>
> **`void` (后面声明任意返回都是 `undefined`)，不适用 `undefined `是因为 `undefined `会在局部变量会被重写。**
>
> ```js
> let a;
> void 1 === a; // true
> a = 1;
> void 1 === a; // false
> ```

```js
Array.prototype.flat5 = function (deep = 0) {
  const result = [];
  (function flat(arr, deep) {
    for (let item of deep) {
      if (Array.isArray(item) && +deep) {
        flat(item, deep - 1);
      } else {
        item !== void 0 && result.push(item);
      }
    }
  })(this, deep);
  return result;
};
const arr5 = arr.flat5(3);
console.log("arr5: ", arr5); // [1, 2, 3, 4, Array(1)]
```

### 使用堆栈`stack`

```js
Array.prototype.flat6 = function () {
  // [...this], Array.from(this), Array.prototype.slice.call(this) // 类数组转数组
  const stack = Array.from(this);
  const result = [];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      result.push(...next);
    } else {
      result.push(next);
    }
  }
  return result.reverse();
};
const arr6 = arr.flat6();
console.log("arr6: ", arr6); // [1, 2, 3, 4, 5]
```

## `module` - 模块化

```js
let module = (function () {
  const moduleList = {};

  function define(name, modules, action) {
    modules.map((m, i) => {
      modules[i] = moduleList[m];
    });

    moduleList[name] = action.apply(null, modules);
  }

  return { define };
})();

module.define("gl", [], function () {
  return {
    first(arr) {
      return arr[0];
    },
    max(arr, key) {
      return arr.sort((a, b) => b[key] - a[key])[0];
    },
  };
});

module.define("lesson", ["gl"], function (gl) {
  let data = [
    { name: "js", price: 199 },
    { name: "css", price: 79 },
  ];
  console.log(gl.max(data, "price"));
});
```

## `New - Apply - Call - Bind`

### `New`

> 1. **一个新对象被创建**
> 2. **该对象的 `__proto__` 属性指向该构造函数的原型， 即 `fn.prototype`**
> 3. **将执行上下文 `this` 绑定到新创建的对象中**
> 4. **如果构造函数有返回值，那么这个返回值将取代第一步中新创建的对象**

```js
function New(fn, ...args) {
  // 1. 创建新对象
  const result = {};
  // 2. 该对象的 __proto__ 属性指向该构造函数的原型
  if (fn.prototype !== null) {
    Object.setPrototypeOf(result, fn.prototype);
  }
  // 3. 将执行上下文的 this 绑定到新创建的对象中
  const fnResult = fn.apply(result, args);
  // 4. 如果该构造函数有返回值 那么这个返回值将取代第一步中新创建的对象 否则返回该对象
  if (
    (typeof fnResult === "object" || typeof fnResult === "function") &&
    fnResult !== null
  ) {
    result = fnResult;
  }
  return result;
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayHi = function () {
    console.log(name, age);
  };
}
const p = New(Person, "GL", 20);
p.sayHi();
```

### `Call`

```js
Function.prototype.call1 = function (thisP, ...args) {
  if (typeof this !== "function") throw new TypeError("error");
  const fn = Symbol("fn");
  thisP = thisP || window;
  thisP[fn] = this;
  const result = thisP[fn](...args);
  delete thisP[fn];
  return result;
};
```

### `Apply`

```js
Function.prototype.apply1 = function (thisP, args) {
  if (typeof this !== "function") throw new TypeError("error");
  if (!Array.isArray(args)) throw new TypeError("params type error");
  const fn = Symbol("fn");
  thisP = thisP || window;
  thisP[fn] = this;
  const result = thisP[fn](...args);
  delete thisP[fn];
  return result;
};
```

### `Bind`

```js
Function.prototype.bind1 = function (thisP, ...args) {
  if (typeof this !== "function") throw new TypeError("error");
  return (...params) => this.apply1(thisP, args.concat(params));
};
```

## 常用函数

### `memozition`

**缓存函数是指将上次的结算结果缓存起来，当下次调用的时候，如果遇到相同的函数，就直接返回缓存中的数据。**

> **实现原理 - 把参数和对应的结果数据都存到一个对象中，调用的时候，判断参数对应的数据是否存在，存在就返回对应的结果数据。**
>
> **应用场景 - 需要大量重复计算，或者大量计算又依赖于之前的结果。**

```js
let memoize = (function (fn) {
  let cache = {};
  return function (key) {
    if (!cache[key]) {
      cache[key] = func.apply(this, arguments);
    }
    return cache[key];
  };
})(
  // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
  // 使用缓存函数实现 斐波那契 数列
  function () {
    let count = 0;
    let fibonacci = function (n) {
      count++;
      return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
    };

    let memoize = function (fn, hasher) {
      let memoize = function (key) {
        let cache = memoize.cache;
        let address = "" + (hasher ? hasher.apply(this, arguments) : key);
        if (!cache[address]) cache[address] = func.apply(this, arguments);
        return cache[address];
      };
      memoize.cache = {};
      return memoize;
    };
    fibonacci = memoize(fibonacci);
    for (let i = 0; i <= 10; i++) {
      fibonacci(i);
    }
    console.log(count);
  }
)();
```

### `curry`

**柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术**

> 可以公用参数。

```js
let curry = (reg) => (str) => reg.test(str);
let hasSpace = curry(/\s+/g);
hasSpace("hello world"); // true
hasSpace("hello"); // false
hasSpace("I Love China"); // true
```

### 偏函数

> **柯里化是将一个多参数函数转换成多个单参数函数 也就是将一个 `n`元函数转换成 `n` 个一元函数**
>
> ```js
> f(a, b, c) = f(a)(b)(c);
> ```
>
> **偏函数则是固定一个函数的一个或者多个参数 也就是将一个 `n`元函数转换成一个 `n-x` 元函数**
>
> ```javascript
> f(a, b, c) = f(a, b)(c);
> ```

使用`bind`实现

```js
let add = (x, y) => x + y;
let rst = add.bind(null, 1);
rst(2);
```
