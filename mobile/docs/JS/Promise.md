# `JS` - `Promise`

> `Promise`是异步编程的一种解决方案，可以替代传统的解决方案 -- 回调函数和事件。
>
> `ES6`统一了用法，并原生提供了`Promise`对象。

## 体验异步

```js
function loadImg(src, resolve, reject) {
  // new Image的作用 - https://www.jianshu.com/p/14853aee567b
  // 统计网站流量 src属性做请求 new image() 创建图片不增加DOM渲染时间 只发送请求(get)。 | 缓存图片
  let image = new Image();
  image.src = src;
  image.onload = resolve;
  image.onerror = reject;
}

loadImg("https://img.gxsnay.com/avatar.jpg", () => {
  console.log("图片加载完了～");
});
console.log("123");
// 执行结果如下 ⬇️
// 123
// 图片加载完了～
```

- 异步执行 **是先加载先执行的, 没有执行顺序的。**

  所以出现了 **异步回调 - 回调地狱（`callback`嵌套）确保按顺序加载。**

  这个时候 **`Promise`** 出现了。 使得代码 更加易懂，然后可以**扁平化处理**

## `Promise` - `JS`的任务处理机制

### `promise` 的状态

```js
// pending 准备阶段
console.log(new Promise((resolve, reject) => {})); // Promise {<pending>}
// resolved 成功 状态
console.log(
  new Promise((resolve, reject) => {
    resolve("成功状态");
  })
); // Promise {<resolved>: "成功状态"}
// rejected 拒绝/失败 状态
console.log(
  new Promise((resolve, reject) => {
    reject("失败状态");
  })
); // Promise {<resolved>: "成功状态"}
```

### `JS` - 任务处理机制 (可以参考 - `Event Loop`)

- **奇怪的知识点 🤔**

  **给 `setTimeout` 设置 `0秒` 执行。 虽然设置的是 0 秒，但其实 `JS` 执行的时候是 `4ms` 执行的**

  - **在 `队列{FIFO}` 做任务轮询， 先进先出**

- **同步代码 > 微任务 > 宏任务**

  ⚠️ **每次执行 宏任务之前都会将 目前的微任务队列清空执行，然后再执行宏任务**

  ```js
  new Promise((resolve, reject) => {
    console.log("这里是同步代码"); // ⚠️🍓
    resolve(1); // 因为它 返回的是一个 promise 然后下面的 then 会等待执行
  }).then((res) => {
    console.log("res", res);
    console.log("这里只有上面 resolve 的通知之后 才会执行代码。");
  });
  ```

### 宏任务的提升 - 原来是误解

- 同步代码执行完成之后。**会将 异步 放入到主线程执行。**

  **⚠️ 此刻的在主线程代码 可以把它当作 正常机制处理 - 然后就各种循环这种机制调用了。 - `Event Loop`**

  ```js
  let promise = new Promise((resolve) => {
    setTimeout(() => {
      // ⚠️ 这里 setTimeout 已经拿到主线程来执行了。 所以 现在是主线程代码
      // 必须把 主线程里面代码执行完成之后 才能去只执行 微任务和宏任务
      resolve(); // 然后执行 微任务里面的 异步代码 - 下次执行会把它放置在主线程上
      console.log("setTimeout"); // ⚠️ 异步放在主线程里面 这里已经是同步代码了~
    }, 0);
    console.log("promise"); // 同步
  }).then((value) => {
    console.log("成功");
  });
  console.log("guolin"); // 同步
  // promise
  // guolin
  // setTimeout
  // 成功
  ```

## `Promise` 的单一状态和状态中转

- **`Promise` 的状态改变之后，就会触发后面的事件。**

  所以 **`Promise`状态是单一 而且 不可逆的**

  ```js
  let p1 = new Promise((resolve, reject) => {
    resolve("成功");
    reject("失败");
    // promise 状态改变之后是不可逆的 如果返回了成功 然后下面是失败 是无效的
    // 只要 状态改变 后面就触发了状态 所以promise 状态是单一的不可逆的
  });
  // p1 此刻是一个 promise
  new Promise((resolve, reject) => {
    resolve(p1); // 返回一个成功的promise 然后肯定走的 then
    // 如果 上面是 reject 那么p1 此刻是一个失败的promise类型的的结果 也会走 catch
  })
    .then((msg) => {
      console.log("then", msg);
    })
    .catch((err) => {
      console.log("err", err);
    });
  // then 成功
  ```

## `Promise.then()` 的基本用法

**`Promise.then()` 返回的是 一个 `promise`**

```js
new Promise((resolve, reject) => {
  reject("错误");
})
  .then(null, (err) => {
    console.log("err", err); // 如果只关注失败前面是需要有的 随便填一个值即可
    // throw new Error('这样呢 接收什么') // 如果抛出错误在前 那么就相当于改变了 promise 的状态 所以会走catch
    return "1";
  })
  .then((res) => {
    console.log("res", res); // 这里又接收了一个1
  })
  .catch((err) => {
    console.log("err1", err);
  });
```

- **如果`promise.then`(这里呢什么也没有处理那么我们就会一直往后走)，`.then`(这里也是可以处理上一个返回结果的)**

  不过 一般不这么写 ✨✨✨

  **如果 第一个 `then` 不返回值，第二个`then` 也是会执行，只是 如果不返回值，接下来的`then`接收不到。**

  ```js
  let p1 = new Promise((resolve, reject) => {
    resolve("哈哈");
  });
  let p2 = p1.then(
    (value) => {
      console.log("value", value);
    },
    (reason) => console.log("reason", reason)
  );
  // console.log('p1', p1); // p1 Promise {<resolved>: "哈哈"} - 成功状态
  // console.log('p2', p2); // p2 Promise {<pending>} - 等待状态
  
  setTimeout(() => {
    // 这样的结果就是 'value 哈哈' - '1' - p1 - p2
    console.log(1);
    console.log("p1", p1); // p1 Promise {<resolved>: "哈哈"} - 成功状态
    console.log("p2", p2); // ⚠️ 此时 由于微任务已经.then了
    // 而且宏任务执行要清空目前已存在的微任务  所以这时p2的状态 - p2 Promise {<resolved>: undefined}
  });
  ```

  ```js
  let p1 = new Promise((resolve, reject) => {
    // resolve('哈哈');
    reject("😂哈哈哈");
  });
  // 改变一下子
  let p2 = p1.then(
    (value) => {
      console.log("value", value);
    },
    (reason) => console.log("reason", reason)
  );
  let p3 = p2.then(
    (a) => {
      // 这里的这个 处理是对 上一个promise 状态结果的处理
      // 无论成功失败 都跟我这个 promise 没有关系了 我只接受一个结果
      console.log("成功");
    },
    (err) => {
      console.log("失败");
    }
  );
  // p1 - p3 - reason 😂哈哈哈 - promise.js:144 成功
  
  console.log("p1", p1); // 此时打印 p1 就是 p1 Promise {<rejected>: "😂哈哈哈"}
  console.log("p3", p3); // p3 Promise {<pending>} 此刻的p3 又是 peding 状态
  ```

### **`then`返回值的处理技巧**

- **基础**

  ```js
  let p1 = new Promise((resolve, reject) => {
    resolve("第一个成功");
    // reject('第一个失败')
  })
    .then(
      (value) => {
        return "字符串";
      },
      (reason) => {
        return "失败的字符串";
      }
    )
    .then((res) => {
      console.log("res", res);
      // 如果p1返回的是 resolve 那么此刻的值就是 res 字符串
      // 如果p1返回的是 reject 那么此刻的值就是 res 失败的字符串
    });
  ```

- **如果 `return` 的是 `promise` 那就会根据 `promise` 返回的状态来做相对应的处理**

  ```js
  let p1 = new Promise((resolve, reject) => {
    resolve("第一个成功");
  })
    .then(
      (value) => {
        return new Promise((resolve, reject) => {
          // resolve('第一个成功')
          reject("第一个失败");
        });
      },
      (reason) => {
        return "失败的字符串";
      }
    )
    .then((res) => {
      // 如果 上面 return 的是 promise 那就会根据 promise 返回的状态来做相对应的处理
      // ⚠️ 其实很简单 就是如果返回的是 promise 的话 我就相当于 init了 然后根据 成功 失败 来做判断
      console.log("res", res);
      // 如果上面 返回的是 resolve 那么此刻的值就是 res 第一个成功
    })
    .catch((err) => {
      console.log("err", err);
      // 如果上面 返回的是 resolve 那么此刻的值就是 err 第一个失败
    });
  ```

  - **然后需要注意 `链式.then` 需要上一个 `then`方法 `return` 出来我们才能对其处理**
  - **如果不 `return` 那我们 `then` 就是对上一个 `then` 返回的 `promise` 进行处理**
  - **推荐 如果下面有要`.then`的链式操作 最好 `return` 或者 返回 `promise` 来进行处理 🍓**

- **进阶 - 加深理解 `.then(Promse.then()).then` 处理**

  ```js
  let p1 = new Promise((resolve, reject) => {
    resolve("第一个成功");
  })
    .then(
      (value) => {
        return new Promise((resolve, reject) => {
          // resolve('第一个成功')
          reject("第一个失败");
        }).then(null, (r) => {
          console.log("r", r);
          return "222";
        });
      },
      (reason) => {
        return "失败的字符串";
      }
    )
    .then((res) => {
      console.log("res", res);
    })
    .catch((err) => {
      console.log("err", err);
    });
  // 这里 return new Promise.then 了之后 那就会紧接着对其进行处理
  // 然后 最下面的 then 是对 return new Promise.then(这里面返回值的一个处理)
  // console.log('r', r);  之后不 return 就是下面这个结果
  // r 第一个失败
  // res undefined
  
  // console.log('r', r);  之后 返回 return '222' 则是下面的结果
  // r 第一个失败
  // res 222
  ```

  **总之要记得`return` 后面的`.then()` 就是对前面的 `return` 的处理，如果`return `的是 `promise` 那则是会根据状态返回 来进行操作。**

## 其他类型的 `Promise` 封装

```js
let p1 = new Promise((resolve, reject) => {
  resolve("第一个成功");
})
  .then(
    (value) => {
      // return { name: '123' } // 如果返回的是一个普通对象 那下面 then 接收的就是一个普通对象
      // return { // 如果 返回的是 then方法 这时候的then 就会被封装成 promise 然后下面接收
      //   then(resolve, reject) {
      //     resolve('这是个对象')
      //   }
      // }
      // class Gl {
      //   then(resolve, reject) {
      //     resolve('我是 class 里面的then方法')
      //   }
      // }
      // return new Gl(); // 因为 new 出来的实例对象里面 有then 方法 所以就会被接收到
      return class {
        // 返回的 class 里 有静态的 then 方法 所以也会被接收到
        static then(resolve, reject) {
          resolve("我是 class 里面的then方法");
        }
      };
    },
    (reason) => {}
  )
  .then((value) => {
    // 对应返回 普通对象 时候的打印 - value {name: "123"}
    // 对应返回 对象里面 特殊的方法 then 的时候的打印 - value 这是个对象
    // 对应返回 new class 里面有then方法 的时候打印 - value 我是 class 里面的then方法
    // 对应返回 class 里面有 静态的then方法 的时候打印 - value 我是 class 里面的静态方法
    console.log("value", value);
  });
// ⚠️注意： 最下面的then 接收的时候 会检查 类呀或者对象呀 里面有没有 then 方法 然后会直接调用
// 但是需要 以 promise 的形式返回 然后才会被接收到  如果 不返回状态 那也会执行 上面 then 方法里面的代码
```

## `Promise`的企业级理解 - 愚见

- **🍓 突然想起 我们接收的后台参数 不就是在 `axios` 里面拦截器 统一返回成`promise`然后再处理的吗 - `return Promise.resolve(结果)`**
- **😱 `amazing` 神奇**
- **💦 不过好像 `axios` 返回的就是 `promise` 哈哈哈 虽然但是 还是要封装一下的 - 但是可以对 `ajax` 啥的进行封装 使用 `.then`**

- **针对与 之前的 回调地狱 各种嵌套**

  - **如果有 一个协议需要上一个协议 请求后的结果的时候 就最好是 扁平化调用一下**

    **`.then(value => axios(协议请求 - 取第一个协议返回的结果)).then(value => 第二个协议做处理)`**

## `Promise`的错误监测 和 `catch`的使用

- **`reject('错误1')` - 基础的**
- **`reject(new Error('错误1'))` - 自己 `new ` 一个错误类型**
- **`throw new Error('fail')` - 自己抛出错误类型也是可以的**
- **`gl + 1 ` - 不明变量 也会被 `catch` 或者 `err` 接收到**

```js
new Promise((resolve, reject) => {
  reject("错误1"); // 基础的
  // ⚠️ 相当于 内部 做了一个 try {} catch (error) {} 监测
}).then(null, (err) => {
  console.log("err", err);
});
```

- ✨✨✨**如果多个` .then` 调用的话 处理错误 其实就是 最后调用一下 `catch` 就可以**

  - **多个 ` .then` 链式调用 可以每个都写 `catch` 来捕获 也可以 最后调用 `catch` 来做统一处理**
  - **推荐 最后写 catch 来做统一捕获**

  ***

  - **因为如果连续两个 `catch` 第二个只会捕获临近没有 错误处理 的代码 不会操作已经有错误处理的代码了。**

  - **如果 `catch` 之前 没有错误处理 那就都会走 `catch` 来进行错误处理**
  - **如果 `catch` 之前 有错误处理的回调， 那就走 临近的 下一个进行错误处理 并 之后的错误处理不会捕获 之前的错误处理**

  ***

## 自定义错误处理

- **继承了 `Error` 之后 就可以使用 对应的错误处理了**

  ```js
  class paramError extends Error {
    constructor(msg) {
      super(msg);
      this.name = "paramError";
    }
  }
  // 打印的时候 因为 new Error 是对象 然后 可以 打印 new Error().message 来进行 错误消息 提示
  //  神奇 ⚠️ -  也可以在错误处理的时候 进行  instanceof 判断
  // 返回 reject(new ParamError('参数错误'))
  // 然后 前端 catch 的时候 判断 if (err instanceof paramError) { ...然后做相对应的处理 }
  ```

## 使用 `finally` 实现异步加载动画

- **`finally`无论成功还是失败的时候 始终会执行(只要执行完成)**

  **可以用来做 加载动画 的，不关心成功失败 只要完成就可以结束动画**

  ```
  .then() & .catch() & .finally
  ```

- 🍓⚠️🍃 **奇怪的知识**

  **`html`里面 标示 `id` 的  标签 可以在 `JS` 里面直接使用**

  ```jsx
  <div id="id1"></div>;
  id1.innerHTML = "1"; // 是可以 input 进去的
  ```

## 使用 `Promise` 封装

### **异步加载图片**

```js
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      resolve();
    };
    image.onerror = reject;
    document.body.appendChild(image);
  });
}

loadImage("...url").then(
  (value) => {},
  (reason) => {
    console.log("reason", reason);
  }
);
```

### `setTimeout` 定时器

```js
function timeout(delay = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

timeout(2000)
  .then(() => {
    console.log("哈哈哈");
  })
  .then(() => {
    console.log("如果不返回 第二个 then 还是会执行的");
    // 只是接受不到值
  });
// 打印如下 ⬇️
// 哈哈哈
// 如果不返回 第二个 then 还是会执行的
```

### 构建 扁平化的 `setInterval`

```js
function interval(delay = 1000, callback) {
  return new Promise((resolve) => {
    let id = setInterval(() => {
      console.log("1");
      callback(id, resolve);
    }, delay);
  });
}

interval(100, (id, resolve) => {
  console.log(12);
  clearInterval(id);
  resolve("2"); // 这块拿的就是 Promise().resolve() 然后上面 return promise 所以 2 这个结果 下面 .then 是可以接收到的
}).then((val) => {
  console.log(val); // 2 竟然打印了...
});
```

## `script` 脚本中的 `Promise` 加载引擎。

```js
// 不推荐这样写 ❌
new Promise().then(
  new Promise().then() // tag:1
).then() // 这里的 .then 接受的是 tag:1 里面的 .then()
// 推荐这样写 ✅
new Promise().then(
  return new Promise()
).then() // 推荐这样写 这样和 tag:1 的结果类似
```

## `Promise.resolve()` - 缓存后台数据

```js
console.log(Promise.resolve("哈哈哈")); // Promise {<resolved>: "哈哈哈"} - 成功状态
Promise.resolve("哈哈哈").then((res) => {
  // 这样写 默认就是成功 的
  console.log(res); // 哈哈哈
});

// 一样的数据 - 存下缓存 - 防止重复请求
function query(name) {
  // 函数本来也是对象 可以往里面 压属性
  const cache = query.cache || (query.cache = new Map());
  if (cache.has(name)) {
    console.log("🍓走缓存了");
    return Promise.resolve(cache.get(name).data);
  } else {
    return axios("...url").then((res) => {
      cache.set(name, res);
      console.log("没有走缓存");
      return res.data;
    });
  }
}
```

### `Promise.resolve`手写类似代码

```js
Promise.gl = function (value) {
  return new Promise((resolve) => {
    resolve(value);
  });
};
console.log(Promise.gl("郭霖")); // Promise {<resolved>: "郭霖"}
```

## `Promise.reject()` 的使用

```js
// 对象里面 包括 then 方法 这样也是可以调用的
let gl = {
  then(resolve, reject) {
    resolve("郭霖");
  },
};
Promise.resolve(gl)
  .then((value) => {
    // 会自动寻找对象里的 then 方法 然后进行调用
    console.log(value); // 郭霖
    Promise.resolve("郭霖");
  })
  .then((value) => {
    if (value != "成功") {
      // throw new Error('fail') // 可以这么写
      return Promise.reject("参数错误"); // 也可以这么写 这里需要写 return 需要接受 promise还是value值类型
    }
  })
  .catch((reason) => {
    console.log("reason", reason); // reason Error: fail
  });
```

## `Promise.all()` 批量获取

**需要所有都返回成功 `all` 才会成功 如果有一项失败了那 `all` 就整体失败了~**

```js
Promise.all([p1, p2])
  .then((res) => {
    console.log("res", res);
  })
  .catch((err) => {
    // ⚠️ 这里如果 p1 p2 没有对其进行处理，在 all里面 是可以统一处理的
    // ⚠️ 如果其中一项 例如-p1-已经做出了处理 那么就已经是解决状态 然后然后没有继续 return 那就接受的就是 undefined
  });

// `Promise.all()` 是需要 所有都返回成功之后 才会成功。
// `promise.allSettled()` 是成功 失败都可以 都会给保存下来。
//    如果 失败了 也会保存下来 然后都会走 `.then` 只不过 成功和失败 返回的状态不同 判断 status === 'fulfilled' 成功的~
// 返回来的结构就是 { status: 状态, value: 返回来的值 }
```

## `Promise.race` 获取最快

**这个就是我可以接收多个 `promise` 但是我只取 最快的一个 `promise`**

```js
// 后台请求超时处理 - 封装一下
function query(url, delay = 2000) {
  let promises = [
    // axios(url),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("请求超时");
      }, 2000);
    }),
  ];
  return Promise.race(promises);
}
query("www.//...", 3000)
  .then((value) => {
    console.log("value", value);
  })
  .catch((error) => {
    console.log("error", error);
  });
```

## `Promise` 队列原理

```js
let promise = Promise.resolve(); // 是 依次执行的  然后等上一个状态返回才会执行下一个 then 和 promise 的
// 原理就是 队列中的每一个成员都是 promise 然后下一个需要等上一个的状态改变。
```

### 使用 `map` 实现 `promise` 队列

- **总之就是 每次 赋值给 `promise` 变量， 因为每次 `then` 执行下一次都获取到上一次 `promise` 返回的结果**

```js
function queue(num) {
  let promise = Promise.resolve();
  num.map((item) => {
    promise = promise.then((_) => {
      // ⚠️ 这块是主要的 promise 每次都赋值 然后一次队列调用
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(item);
          resolve(); // 改变状态之后 结合定时器 就可以实现 依次打印了
        }, 1000);
      });
    });
  });
}
// 总之就是 每次 赋值给 promise 变量， 因为每次 then 执行下一次都获取到上一次 promise 返回的结果
// setTimeout 只是模拟 api调用的时耗。 然后每次都1秒后 返回状态 然后下个then 接收到 接着执行
queue([1, 2, 3, 4, 5]); // 这里参数 可以换成 promise 数组 然后就可以实现 多个promise 依次执行的功效了
```

### 使用 `reduce` 来实现 `promise` 队列

- **保证 `then` 是连续的， 每次的 `promise` 又是一个新的 `promise` 就可以了**

```js
function queue(num) {
  num.reduce((promise, n) => {
    return promise.then((_) => {
      // 这块每次返回 就是一个 新的 new Promise() 对象
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(n);
          resolve();
        }, 1000);
      });
    });
  }, Promise.resolve());
}
queue([1, 2, 3, 4, 5]);
```

### 使用 `promise` 队列来渲染数据

```js
// eg:
class User {
  ajax() {
    // 请求数据的方法
  }
  render(users) {
    users.reduce((promise, user) => {
      return promise
        .then((_) => {
          return this.ajax(user); // 这块是封装的ajax方法然后是返回数据的方法
        })
        .then((user) => {
          // 这块是 自动将数据渲染到页面 获取一个 渲染一个的意思
          return this.view(user);
        });
    }, Promise.resolve());
  }
  view() {
    // 渲染页面的方法
  }
}

new User().render(["params-eg"]);
```

## `async-await` 语法糖

- **⚠️ `await` 必须要在 async 声明的函数中才可以生效 不然会报错**

- **`async 函数` 这个就相当于 我们 `new Promise()` 的做法**

- **`await promise` 这个就相当于 我们 `.then()` 的做法**

  ```js
  async function gl() {
  } // 这个就相当于 我们 new Promise() 的做法
  console.log(gl()); // Promise {<resolved>: undefined} ⚠️ - 这里的 promise 状态是已解决的状态async function gl() {
  } // 这个就相当于 我们 new Promise() 的做法
  console.log(gl()); // Promise {<resolved>: undefined} ⚠️ - 这里的 promise 状态是已解决的状态
  ```

### `promise` 的语法糖 `async`

```js
async function gl() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("guolin");
    }, 1000);
  });
}
gl().then((v) => console.log(v)); // guolin
```

### `then` 的语法糖 `await`

```js
async function gl() {
  // let name = await 'guolin'; // 这里相当于 Promise.resolve('guolin') 但这里是 promise的 类型
  // console.log(name); // guolin

  let name = await new Promise((resolve) => {
    // await 就是 then 的简写
    setTimeout(() => {
      resolve("guolin"); // 如果不改变状态 resolve 那就永远无法 输入 name 一直在等待
    }, 1000);
  });
  console.log(name); // guolin
  // await 其实就是 避免频繁的 new Promise() 的写法
}
gl();
```

### `async` 延时函数

```js
async function slepp(delay = 2000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

async function show() {
  for (const user of ["g", "l"]) {
    await slepp(); // 因为这里在等 promise 的状态改变 2秒后改变 然后输出内容
    console.log(user); // 每隔两秒 打印 g 然后 l
  }
}
show();
```

### `class` 与 `async` 的结合使用

```js
class User {
  constructor(name) {
    this.name = name;
  }
  then(resolve, reject) {
    // 如果一个类中 包含有一个 then 方法
    // 那在于 promise 使用的时候 就会包装成一个 promise 的then方法
    // resolve();

    // 如果里面有 异步调用操作方法 那么即使调用完了下面也不会打印
    // 需要 改变一下状态， 如果有需要使用的值 传递就可以了
    resolve(); // 然后改变状态之后 下面await 就会释放执行了
  }
}

async function get() {
  await new User();
  console.log("guolin"); // 如果 User里面的 then 方法 没有返回状态 后面的 打印是不会执行的
  // await 会等待 promise 返回的状态之后才打印
}
get();
```

- **异步封装在类的 内部**

```js
class User{
  // get(name) {
  //   let user = ajax(`请求调用的api`);
  //   user.name += '-guolin'；
  //   console.log(user); // 这里这样写 异步了 然后 user.name很有可能是 undefined
  //   return user;
  // }

  // 使用 then 也行 async await 更好更直观
  async get(name) {
    let user = await ajax(`请求调用的api`); // 这样就保证执行了 同步了
    user.name += '-guolin'；
    console.log(user);
    return user;
  }
}
new User().get('guolin1').then(value => {
  console.log(value); // await 就是 then 的语法糖
  // 这里的 then 就可以接收到 上面的 return 的结果了
})
```

## `async-await` 的几种声明方式

- **`async function get() { await ... }` - 函数声明**

- **`let get = async function() { await ... }` - 函数表达式的声明**

- **对象声明**

  ```js
  let gl = { // 对象声明
    async get() {
      await ...
    }
  }
  gl.get().then(...)
  ```

- **`class` 声明**

  ```js
  class Gl { // class 声明
    async get() { await ... }
  }
  new Gl().get().then(...)
  ```

## ⚠️🍓 `async - await` 的错误处理

### `async` 的错误处理

```js
new Promise((resolve, reject) => { // 普通 promise 的错误处理
  throw new Error('fail')
}).catch(err => {
  // ⚠️🍓 这里的 catch 除了 捕获协议上的错误
  // 🍓 也会捕获 代码里面发生的错误 相当于 内部隐形的一个 try catch
  console.log(err); // Error: fail
})

async function gl() {
  console.log(a);
  // throw new Error('fail') // 自己抛出的也会处理
}
gl().catch(err => { // 因为 async 是 promise 语法糖 这样也是可以对错误进行处理的
  console.log(err); // ReferenceError: a is not defined
})

async function g() {
  return ajax(url...)
}
g().then(null, err => {
  console.log(err); // 也是可以捕获到 api协议 的错误的
})
```

---

**🍓 不仅要考虑 成功之后数据的处理 更好考虑 出错误的时候的错误处理 保证用户体验和方便代码排错**

**🍓 不仅要考虑 成功之后数据的处理 更好考虑 出错误的时候的错误处理 保证用户体验和方便代码排错**

**🍓 不仅要考虑 成功之后数据的处理 更好考虑 出错误的时候的错误处理 保证用户体验和方便代码排错**

---

### `await` 的错误处理

- **单个错误处理**

  ```js
  async function gl() {
    // await 后面一般情况下 也跟的是个 promise
    let data = await ajax(url...)
    return data;
  }

  // 在外面进行的 错误处理
  gl().then(...成功的处理).catch(err => {
    console.log(err); // 这样也是可以对 await 接收到的错误 进行处理的
  })

  // 在内部进行的 错误处理 try catch
  async function gl() {
    // try里面的代码报错的时候,catch里面的代码才会执行,finally里面的代码永远会执行
    try {
      let data = await ajax(url...)
      console.log('111'); // 如果上面的异步错误了 这里是打印不到的 因为会阻断
      return data;
    } catch (error) {
      // 可以在这块进行错误处理
      console.log(error);
    } finally { // 无论有无异常里面代码都会执行
      // ...这里是 try catch 之后 都会调用代码  也可以写在这里
    }
    // ⚠️ 如果 处理完错误了之后
    console.log('222'); // 在这里是 就可以打印到了
  }
  ```

- **如果是 多个异步 的情况下**

  ```js
  // 把多个 统一放置到 try catch 里面
  try {
    let user = await ajax(url...)
    let user1 = await ajax(url...)
  } catch (error) {
    // 这里 无论谁发生错误 catch 都会接收到
  }
  // 也可以都放在 外面进行处理
  gl().then().catch(err => {
    // 这里也可以接收到 里面的错误
    // 但是 你需要返回 await 的数据 因为... await 是 then 的语法糖 相当于 then 操作
    // 之前 promise.then 如果有错误 最后统一处理也是可以的
  })
  ```

## 🍓🍌🍉`await` 并行执行的技巧

**正常情况下 `await` 下面代码都需要等待 `await` 返回之后才可以被执行**

```js
async function gl() {
  // ⚠️ p1 p2 都是 异步
  // let h1 = await p1;
  // console.log(h1);
  // let h2 = await p2;
  // console.log(h2);
  // // 这里这样写 就是 等待p1执行 然后p2执行

  // 方法1 - 达到并行 - 限制性 最后等待结果 然后 实现并行执行的效果
  let h1 = p1;
  console.log(h1);
  let h2 = p2;
  console.log(h2);
  // 这里就是 p1 p2 是在同时执行 只不过是比较 自身执行快慢的问题
  // 然后在下面执行 await 因为上面已经在执行了
  let h1Value = await h1; // await 是当作 then 来执行的
  let h2Value = await h2;
  console.log(h1Value, h2Value); // 这里就看到 h1 h2 同时执行了 amazing 😱 神奇

  // 方法2 - Promise.all() = 达到并行
  let res = Promise.all([p1(), p2()]);
  console.log(res); // 这里 也可以同时接收到结果
}
```
