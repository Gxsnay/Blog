# `JS` - `Promise`\_简易版本

> `JS` 中 `Promise` 实现的简易版本详解。

## 声明 `Promise` 并绑定 `this`

```js
class Gl {
  // 因为状态的值是固定的 所以定义成静态属性
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  // executor - 翻译 - 执行者 的意思
  constructor(executor) {
    // executor - 就是 - resolve 和 reject
    // 我傻了 constructor 不就是传递 new 的时候传递的时候 传递的参数吗...
    this.status = Gl.PENDING; // 初始是 pending 状态
    this.value = null; // 初始返回值

    // ⚠️ 因为this 缘故 然后 bind 绑定下 this。 让里面的 this 就是当前的 this;
    // 🍓 这里是 绑定 `this` - `bind()方法`
    executor(this.resolve.bind(this), this.reject.bind(this)); // 执行
  }

  // 但是这样写就违背了 promise 的单一不可逆状态的 原则...
  // 因为这样写 从上往下 执行 就是 最下方的状态是哪个 就是哪个状态
  resolve(value) {
    // console.log(this); // undefined 因为 class 默认遵循的是严格属性
    // 然后 就是 undefined - 如果不是的话 这里面的 this 就是window

    this.status = Gl.FULFILLED;
    this.value = value;
  }

  reject(reason) {
    this.status = Gl.REJECTED;
    this.value = reason;
  }
}
```

## 状态保护 与 执行者异步捕获

- **执行者异步捕获 - 如果在调用代码的时候可能会出现错误，然后就需要 把状态改成 `reject`**
- **捕获错误，`try-catch`**

```js
try {
  executor(this.resolve.bind(this), this.reject.bind(this));
} catch (error) { // 🍓`执行者异步捕获` - amazing 😱 神奇
  this.reject(error)
}

resolve(value) {
  // 因为 这里 `promise` 的需求就是 状态单一 不可逆~
  // 🍓`状态保护` - 在这里加一个保护就可以了
  if (this.status === Gl.PENDING) {
    this.status = Gl.FULFILLED;
    this.value = value;
  }
}

reject(reason) {
  if (this.status === Gl.PENDING) {
    this.status = Gl.REJECTED;
    this.value = reason;
  }
}
```

## `then` 的基础构建

```js
then(onFulfilled, onRejected) { // 这两个函数构建好之后 就自动执行这俩函数
  // onFulfilled(this.value) // resolve()改变之后 然后获取到 传递的这个值
  // 但是如果这样写 我就算不传递值 这个值就是 initVal-> null 这样是不对的  需要等待 resolve 传递
  // 所以 这个onFulfilled 方法 不会被立即执行 需要等待 resolved 的状态改变

  // 在 `promise` 这两个状态是可以不传的 只是 占位 就可以了，可以单独处理 成功和失败
  // 也是 如果错误的时候 单独执行 .then 的第一个函数 不会报错的 ⬇️ 来处理一下
  if (typeof onFulfilled !== 'function') {
    // 如果不传 我们就给一个 默认值 封装一下函数
    // 🍓⚠️ 但是我们的 then 是可以链式的 所以我们这样是有点点问题的
    // -return this或者 return 这个 `class` 类名
    onFulfilled = () => {};
  }
  if (typeof onRejected !== 'function') {
    // 🍃 这样就不报错了
    onRejected = () => {};
  }

  // 然后就需要加判断
  if (this.status === Gl.FULFILLED) {
    onFulfilled(this.value);
  }
  if (this.status === Gl.REJECTED) {
    onRejected(this.value);
  }
}
```

## 实现 `then` 的 异步操作 和 异常捕获

- **如果 在 `then` 里面的成功回调函数 有错误了 那我们应该 将它放在 处理异常 里面去完成**

```js
// 🍓⚠️ 因为在 原生 `promise` 里面是异步执行的 所以我们需要处理一下
// 所以我们就需要将我们的任务 放置在 异步的任务队列里面 - setTimeout
then() {
  if (this.status === Gl.FULFILLED) {
    setTimeout(() => {
      try {
        onFulfilled(this.value);
      } catch (error) {
        onRejected(error);
      }
    });
  }
  if (this.status === Gl.REJECTED) {
    setTimeout(() => {
      try {
				onFulfilled(this.value);
      } catch (error) {
        onRejected(error);
      }
    });
  }
}
```

## `Promise` 的 `Pending` 状态处理

- **原生 `promise` 的时候 在同步代码里面写一个 `setTimeout` 是等待之后可以出来的**

- **在本次实现的 代码里面 就出不来了，在本次实现中的状态是 `pending` 因为我们的代码是立即执行 然后又只判断了 成功失败 处理**

```js
constructor() {
  this.callbacks = []; // 在这里定一个 callback 列表 等待执行完成之后 再拿出来执行
}

resolve(value) {
  // 异步完成结果之后 改变状态 就会执行这个方法
  this.callbacks.map(item => {
    item.onFulfilled(value); // 因为这里在 then 里面 push 进去的时候是
    // 成功失败状态的 key-value
  })
}

reject(reason) {
  this.callbacks.map(item => {
    item.onRejected(reason);
  })
}

then() {
  // if() { ... }
  console.log(this); // 是pending状态
  if (this.status === Gl.PENDING) {
    // 处理 准备状态 处理之后执行的函数
    // 如果处于 准备 状态的时候 那肯定会执行这个方法
    console.log('3'); // 这个是可以打印出来的
    this.callbacks.push({
      onFulfilled,
      onRejected
    })
  }
  // if() { ... }
}
```

## `pending` 的状态异常处理

- **如果在 `pending` 里面出现 错误 还是要交给 错误方法来统一进行处理**

```js
then() {
  // if() { ... }
  if (this.status === Gl.PENDING) {
    this.callbacks.push({
      onFulfilled: value => { // 因为在 上面 传递来value 参数了
        try {
          onFulfilled(value) // 上面是 push 的对象属性 这里是执行的函数
        } catch (error) {
          onRejected(error)
        }
      },
      onRejected: reason => {
        try {
          onRejected(reason)
        } catch (error) {
          onRejected(error)
        }
      },
    })
  }
  // if() { ... }
}
```

## `pending` 的异步处理技巧

- **在 `promise` 的同步里面 `resolve('123')` `console.log('223')` 那肯定是先输出同步 `223`**

  **然后 `.then` 异步了 然后再输出 `123`**

- **在我们的实现代码里面 `resolve()` 调用之后 会立刻执行 所以顺序执行了 ⬇️ 修改如下**

  **因为我们改变 `pending` - `resolve` 状态之后 回调用 `resolve` 方法 然后在执行成功的时候 变成异步 就完事了**

```js
resolve() {
  setTimeout(() => { // 然后就会在 异步之后 又把这里的异步放在主线程 等待执行 等下面的同步执行完成 然后再执行
    this.callbacks.map(item => {
      item.onFulfilled(value);
    })
  });
}

reject() {
  setTimeout(() => {
    this.callbacks.map(item => {
      item.onRejected(reason);
    })
  });
}
```

## `then` 链式操作

### **`new Promise` 之 `then`的链式操作 原理分析**

```js
new Promise((resolve, reject) => {
  reject("拒绝");
})
  .then(
    (value) => {
      console.log(value);
      return "成功1";
    },
    (reason) => {
      console.log(reason);
      return "失败1";
    }
  )
  .then(
    (value) => {
      console.log(value); // 失败
      // ⚠️ 原生 promise 的处理 - 上面接受完失败之后 处理完失败之后 然后在这里 `then` 会接收到
      // 失败处理完之后的 数据 - 不会走到 reject 里面去了
    },
    (err) => {
      console.log(err);
    }
  );
```

- **⚠️🍓 `then` 返回的是一个 `promise`**

- **⚠️🍓 如果之前返回的是 拒绝的`promise` 并不会影响我们的 接下来的 `then` 新返回的 `promise`**

- **⚠️🍓 例如 我们 第一个 `then` 接受到失败处理完失败。 `return` 的是 成功的 `promise`**

### 实现 `promise` 的链式操作

```js
// 实现 `promise` 的链式操作
then() {
  // 这样 .then()之后 我们 return new Gl() 就可以 - 接收到一个新的 异步了。
  return new Gl((resolve, reject) => {
    if (this.status === Gl.PENDING) {
      this.callbacks.push({
        onFulfilled: value => {
          // 需要改变状态 让下次的 `then` 和 `catch` 来进行接收
          try {
            let result = onFulfilled(value)
            resolve(result);
          } catch (error) {
            reject(error) // `then` 新增 `promise` 异常处理
          }
        },
        onRejected: reason => {
          try {
            let result = onRejected(reason) // ⚠️ 成功失败 都不影响下次 then 操作
            // 所以 都要用 resolve 去抛
            resolve(result);
          } catch (error) {
            reject(error) // `then` 新增 `promise` 异常处理
          }
        },
      })
    }
    if (this.status === Gl.FULFILLED) {
      setTimeout(() => {
        try {
          let result = onFulfilled(this.value);
          resolve(result);
        } catch (error) {
          reject(error); // `then` 新增 `promise` 异常处理
        }
      });
    }
    if (this.status === Gl.REJECTED) {
      setTimeout(() => {
        try {
          let result = onRejected(this.value);
          resolve(result); // 拒绝的 然后错误处理之后 就是默认是成功的了~
        } catch (error) {
          reject(error); // `then` 新增 `promise` 异常处理
        }
      });
    }
  })
}

// ------------------------------ promise ---------------------------
let l = new Gl((resolve, reject) => {
  reject('失败了')
}).then(res => {
  return '成功2'
}, reason => {
  return '失败2'
}).then(res => {
  console.log('res1', res); // res1 失败2 这里接收的是 上一个失败处理完成之后的 成功状态
})

// ------------------ `then` 新增 `promise` 异常处理 -----------------
// 解决 上一个 `then` 发生的错误 我们需要交给 下一个 `then` 和 `catch` 来进行处理
let g = new Gl((resolve, reject) => {
  resolve('成功了')
}).then(value => {
  // 同样 我们抛出异常 throw new Error('fail') // 我们也是可以接收到的
  console.log(aq);
}).then(value => {
  console.log('value', value);
}, err => {
  console.log('err', err);
})
```

## 实现 `then` 的 穿透传递

```js
let g = new Gl((resolve, reject) => {
  resolve("成功了");
})
  .then()
  .then(
    (value) => {
      console.log("value", value);
    },
    (err) => {
      console.log("err", err);
    }
  );

if (typeof onFulfilled !== "function") {
  onFulfilled = () => this.value;
}
if (typeof onRejected !== "function") {
  onRejected = () => {
    throw this.value;
  };
}
```

## `then` 返回 `promise` 的处理

```js
onFulfilled: (value) => {
  try {
    let result = onFulfilled(value);
    if (result instanceof Gl) {
      // 然后在 拒绝的时候 返回 `promise` 也可以在下一次 成功的时候 接收到了～
      result.then(resolve, reject); // 然后可以简写成这个样子
      // value => {
      //   resolve(value)
      // }, reason => {
      //   reject(reason)
      // }
      // )
    } else {
      resolve(result);
    }
  } catch (error) {
    reject(error);
  }
};
```

## `then` 代码的 冗余 优化

```js
// 封装函数 - 解决代码 冗余
parse(result, resolve, reject) {
  try {
    if (result instanceof Gl) {
      result.then(resolve, reject)
    } else {
      resolve(result);
    }
  } catch (error) {
    reject(error);
  }
}

// - 调用 -
this.parse(onFulfilled(this.value), resolve, reject)
```

## `promise` 返回类型的约束

### 原生 `promise`

```js
let promise = new Promise((resolve, reject) => {
  resolve("解决");
});
let p = promise.then((value) => {
  console.log(p); // 这里面 也是可以打印到这个 p 的 因为 .then 里面的是 异步后执行
  // return p; // 但是这样是 不可以的 在本身 js-promise 当中 不允许返回自己。
});
console.log(p);
```

### 在 `return new Gl()` 更改如下。

```js
let promise = new Gl();
return promise

this.parse(promise, onFulfilled(this.value), resolve, reject)
parse() {
  if (promise === result) {
    throw new Error('Chaining cycle detected');
  }
};
```

## 实现 `resolve` 与 `reject`

### `resolve` 返回 普通值的情况

```js
class Gl {
  static resolve(value) {
    return new Gl((resolve, reject) => {
      resolve(value);
    });
  }
}
```

### `resolve` 返回 `promise`值 的情况

```js
// 先看 `promise` 的处理
let p = new Promise((resolve, reject) => {
  resolve(`成功`); // 如果返回成功 那then 或者 then 的第一个参数 就可以接收到
  reject("失败"); // 就需要使用 catch 或者 then的第二个参数 去接收。
});
// `Promise.resolve` 这这里 如果接收的是一个 promise 值的话 就会按照 promise 的成功失败 去做对应的处理
Promise.resolve(p).then(
  (value) => {
    console.log("value", value);
  },
  (err) => {
    console.log("err", err);
  }
);

// --------------------- 手写 `promise` ⬇️ ---------------------
class Gl {
  static resolve(value) {
    return new Gl((resolve, reject) => {
      if (value instanceof Gl) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }
}
```

## `promise` 的 `All` 方法实现

### 原生 `promise`

```js
let p1 = new Promise((resolve) => {
  resolve("郭霖");
});
let p2 = new Promise((resolve, reject) => {
  resolve("p2");
});

Promise.all([p1, p2]).then(
  (valueAll) => {
    console.log(valueAll);
  },
  (reason) => {
    // 如果又一个 失败状态 那就不对了
    console.log("err", reason);
  }
);
```

### 手写 ` promise - all` 方法 ⬇️

```js
class Gl {
  static all(promises) {
    // all 返回的也是一个 promise 不然怎么会有 then呢
    return new Gl(resolve, (reject) => {
      promises.forEach((promise) => {
        let values = [];
        promise.then(
          (value) => {
            values.push(value); // 成功一个 就 压入一个
            if (values.length === promises.length) {
              resolve(values);
            }
          },
          (reason) => {
            reject(reason); // 任何一个promise失败了 就用总的返回的 new Gl - reject 来对错误进行处理
          }
        );
      });
    });
  }
}
```

## `promise`的`race`的静态方法实现

- `race` 呢就是 `谁快用谁的` - 不管返回的是失败还是成功 失败走失败的调用 然后也是第一个返回失败后 就不再调用了

### 原生 `promise`

```js
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p1");
  }, 2000);
});

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('p2')
    reject("p2 - error");
  }, 1000);
});

Promise.race([[p1, p2]]).then(
  (res) => {
    console.log(values); // p2
  },
  (reason) => {
    // 如果失败的时候 就需要写这个函数啦
    console.log(reason); // p2 - error
  }
);
```

### 手写 `promise - race` 方法 ⬇️

```js
static race(promises) {
  return new Gl((resolve, reject) => {
    promises.map(promise => {
      // 因为这块之前已经定义了 promise 返回状态 改变之后 就不会再输出值了
      promise.then(value => {
        resolve(value)
      }, reason => {
        reject(reason)
      })
    })
  })
}
```

## 贴一下最后实现的 全部代码

```js
class Gl {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(executor) {
    this.status = Gl.PENDING;
    this.value = null;
    this.callbacks = [];

    // console.log(this); // 这里的 this 给到了 new 绑定的
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.status === Gl.PENDING) {
      this.status = Gl.FULFILLED;
      this.value = value;
      setTimeout(() => {
        this.callbacks.map((item) => {
          item.onFulfilled(value);
        });
      });
    }
  }

  reject(reason) {
    if (this.status === Gl.PENDING) {
      this.status = Gl.REJECTED;
      this.value = reason;
      setTimeout(() => {
        this.callbacks.map((item) => {
          item.onRejected(reason);
        });
      });
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== "function") {
      onFulfilled = () => this.value;
    }
    if (typeof onRejected !== "function") {
      onRejected = () => this.value;
    }

    let promise = new Gl((resolve, reject) => {
      if (this.status === Gl.PENDING) {
        this.callbacks.push({
          onFulfilled: (value) => {
            this.parse(promise, onFulfilled(value), resolve, reject);
          },
          onRejected: (reason) => {
            this.parse(promise, onRejected(reason), resolve, reject);
            // try {
            //   let result = onRejected(reason) // ⚠️ 成功失败 都不影响下次 then 操作
            //   // 所以 都要用 resolve 去抛
            //   resolve(result);
            // } catch (error) {
            //   reject(error)
            // }
          },
        });
      }
      if (this.status === Gl.FULFILLED) {
        setTimeout(() => {
          this.parse(promise, onFulfilled(this.value), resolve, reject);
        });
      }
      if (this.status === Gl.REJECTED) {
        setTimeout(() => {
          this.parse(promise, onRejected(this.value), resolve, reject);
        });
      }
    });
    return promise;
  }

  parse(promise, result, resolve, reject) {
    if (promise === result) {
      throw new Error("Chaining cycle detected");
    }
    try {
      if (result instanceof Gl) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  }

  static resolve(value) {
    return new Gl((resolve, reject) => {
      if (value instanceof Gl) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }

  static reject(value) {
    return new Gl((resolve, reject) => {
      reject(value);
    });
  }

  static all(promises) {
    return new Gl((resolve, reject) => {
      let values = [];
      promises.forEach((promise) => {
        promise.then(
          (value) => {
            values.push(value);
            if (values.length === promises.length) {
              resolve(values);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }

  static race(promises) {
    return new Gl((resolve, reject) => {
      promises.map((promise) => {
        promise.then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }
}
```
