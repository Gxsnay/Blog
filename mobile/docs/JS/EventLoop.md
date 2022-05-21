# `JS` - `EventLoop`

> `JavaScript`有一个基于事件循环`EventLoop`的并发模型，事件循环负责执行代码、收集和处理事件以及执行队列中的子任务。
>
> 浏览器和`NodeJS`基于不同的技术实现了各自的`EventLoop`。

## `JS` - 单线程

**`JS`的单线程， 同一个时间只能做一件事。**

- 因为`JS`的主要用途就是操作`DOM`和用户互动。如果 `JS` 同时有两个线程，一个线程添加 DOM 一个线程删除 DOM。那应该 执行 哪个线程呢？
  **所以 为了避免复杂性。从一开始，`JS`就是单线程。**
- **`HTML5`提出`Web Worker`标准，允许`JS`脚本创建多个线程，但是子线程完全受主线程控制，且不得操作`DOM`。所以，这个新标准并没有改变`JavaScript`单线程的本质。**

## 任务队列

- **如果有多任务需要执行，要么就是排队、 新建进程 或者 新建线程。**
- 目前 `JS` 单线程。是所有任务都需要 排队，前一个任务结束，后一个任务才会执行。如果前一个任务 耗时 很长，那后一个任务 **就不得不** 等着。
  后来 `JS` 设计者意识到，**主线 可以完全不管 `I/O` 设备，挂起处于等待中的任务，先运行排在后面的任务。**等到 `I/O` 设备有结果了，再回头把挂起的任务继续执行下去。
- 于是，`JS` 的所有任务分为两种。
  - **同步任务(`在主线程上排队执行的任务。只有前一个任务执行完毕，才能执行后一个任务`)**
  - **异步任务(`不进入主线程，而进入 任务队列 的任务。任务队列会通知，某个异步任务可以执行了，该任务才会进入主线程执行异步。`)**

## 进程与线程

### 进程

- **进程是线程的容器。进程是资源分配的最小单位。**

  **我们启动一个服务，运行一个实例，就是开一个服务进程。**

- **多进程就是进程的复制(`fork`)，`fork`出来的每个进程都拥有自己独立的空间地址，数据栈，一个进程无法访问另一个进程里定义的变量，数据结构。 **
  **只有建立了 `IPC` 通信，进程之间才可数据共享。**

### 线程

- 线程是操作系统能够进行运算调度的最小单位， **首先我们要清楚，线程是隶属于进程的，被包含与进程之中。一个线程只能隶属于一个进程，但一个进程是可以拥有多个线程。**

#### 单线程

**单线程就是一个进程只开一个线程**

- `JS` 就属于单线程，在使用单线程语言切勿有过多耗时的同步操作，否则线程会造成阻塞，导致后续无法处理。 **请尽可能的 利用 `JS` 异步操作的特性。**
- **`Node.js` 虽然是单线程模型，但是基于事件驱动 异步非阻塞模式，可以应用于高并发场景。**

## `process` 模块

- **`Node.js` 中的进程 `Process` 是一个全局的对象，无需 `require` 直接使用。**
  - **`process.env`：环境变量，例如通过 `process.env.NODE_ENV ` 获取不同环境项目配置信息**
  - **`process.nextTick`：这个在谈及 `EventLoop` 时经常为会提到。**
  - **`process.pid`：获取当前进程`id`**
  - **`process.ppid`：当前进程对应的父进程**
  - **`process.cwd()`：获取当前进程工作目录，**
  - `process.platform`：获取当前进程运行的操作系统平台
  - `process.uptime()`：当前进程已运行时间，例如：`pm2` 守护进程的 `uptime` 值
  - `进程事件`： `process.on(‘uncaughtException’,cb)` 捕获异常信息、` process.on(‘exit’,cb）`进程推出监听
  - `三个标准流`： `process.stdout` 标准输出、 `process.stdin` 标准输入、 `process.stderr` 标准错误输出
  - `process.title` 指定进程名称，有的时候需要给进程指定一个名称

## `Event Loop`

- **主线程从 任务队列 中读取事件。这个过程是循环不断的。 所以整个的这种运行机制又称为 `Event Loop`**

- `Event Loop` 是一个 执行模型，在不同地方有不同的实现。浏览器和`NodeJS`基于不同技术实现了各自的 `Event Loop`

- 浏览器的`Event Loop`是在`html5`的规范中明确定义。

  `NodeJS`的`Event Loop`是基于`libuv`实现的。可以参考`Node`的[官方文档](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)以及`libuv`的[官方文档](http://docs.libuv.org/en/v1.x/design.html)。

### 宏任务

**宏队列`macrotask`。** 一些异步任务的回调会依次进入`macro task queue`，等待后续被调用，这些异步包括：

- `setTimeOut`
- `setInterval`
- `setImmediate` - `Node`独有
- `requestAnimationFrame` - 浏览器独有
- `I/O`
- `UI rendering` - 浏览器独有

**同步代码执行的时候，宏任务里面的异步也在同时执行，但是还不会在主队列中显示。**

```js
// 首先执行 同步代码
// - 然后宏任务 已经开始执行了
// - 然后同步代码执行完成之后，宏任务 立刻就输出了，因为已经执行完毕了
setTimeout(() => {
  console.log("定时器");
}, 2000);
console.log("郭霖");
setTimeout(() => {
  // TODO:gl
  console.log("定时器1");
}, 1000);

for (let index = 0; index < 1000; index++) {
  console.log("object");
} // 这里 循环完成之后 上面的 setTimeout 会立即打印 然后进行输出 不需要等待 2秒 了 🍓
// ⚠️ 这里如果 两个异步 那肯定就是都 已经执行了
// 然后 setTimeout异步 谁执行时间短 谁先来。 api协议同理
```

### 微任务

**微队列`microtask`也叫`jobs`。** 另一些异步任务的回调会依次进入`micro task queue`，等待后续被调用，这些异步任务包括：

- `process.nextTick` - `Node` 独有
- `Promise`
- `MutationObserver`

**微任务 的任务处理**

- 优先级对比： **`同步代码 > 微任务 > 宏任务`** 🍓

- 🍓🍓🍓 **每次执行 宏任务 都要把已经 存在队列(微任务队列)里面的微任务清空**

## 代码执行 - 理解

- **每次执行下一个 宏任务，都会先确保 微任务队列 是空的(清空)。才会执行。**

  **⚠️ `new Promise((resolve) => { console.log(2) })` 这段`console`是 同步代码。**

  ```js
  setTimeout(() => {
    console.log("1"); // 异步 - 宏任务
  }, 0);
  
  new Promise((resolve, reject) => {
    console.log("2"); // 同步代码
    resolve();
  }).then(() => {
    console.log("3"); // 异步 - 微任务
  });
  
  console.log("object"); // 同步代码
  // 1 => 2 object 然后宏任务有 ['1'] 微任务有 ['3'] 然后执行宏任务需要先把 微任务清空才会执行 so~ `2 obj 3 1`
  // 2 object 3 1
  ```

  ```js
  setTimeout(() => {
    console.log(1); // 2 - 异步 - 宏任务
    new Promise((resolve) => {
      resolve();
    }).then(() => {
      new Promise((resolve) => {
        resolve();
      }).then(() => {
        console.log(2); // 3 - 异步 - 微任务
      });
      console.log(3); // 3 - 异步 - 微任务
      // 执行了 3 之后 紧接着又定义了一个 2 的微任务 然后微任务就有2了
    });
  });
  
  new Promise((resolve) => {
    console.log(4); // 1 - 同步
    resolve();
  }).then(() => {
    console.log(5); // 2 - 异步 微任务
  });
  setTimeout(() => {
    console.log(6); // 3 - 异步 宏任务
  });
  console.log(7); // 1 - 同步
  
  // promise.then 就可以理解成 定义了一个微任务~
  // 宏任务 [1,6] [] [6]
  // 微任务 [5]   [][3] [2]
  // 然后 执行宏任务6的时候 因为 微任务又东西 所以就 先执行了2
  // 4 7 5 1 3 2 6
  ```

## DOM 渲染任务

**`script` 放在`DOM`渲染的后面 `window.onload = () => {};` 以防止不会出现空白页**

## 任务共享内存

**异步任务队列 是一个一个一次调用进入到 主线程，来完成相对应任务处理**

**所以 任务 是共享内存的。 都是主线程的内容，都会放到主线程来执行。 🍓🍓🍓**

- 进度条实例体验 任务轮询

  ```js
  function handle() {
    let i = 0;
    (function run() {
      // 这里也应用了 闭包的概念
      if (++i <= 100) {
        // 这里就 引用了 任务共享内存的原理
        setTimeout(run, 100); // 这样也是会调用执行 函数的
      }
    })();
  }
  ```

## 任务拆分

**任务拆分成多个子任务进行，以免 同步的时候造成阻塞**

- **任务拆分成 多个子任务 - 把一个复杂的任务拆分成多个小任务**

  ```js
  // 累加数字 也是神奇
  function gl() {
    for (let i = 0; i < num; i++) {
      count += num--; // 累加...
    }
    console.log(count);
  }

  let num = 987654321;
  let count = 0;
  gl();

  console.log("郭霖"); // 后面的结果是无法立即输出的 因为是同步 会等上面完事才可以输出
  ```

- **宏任务 拆分成多个子任务**

  ```js
  function gl() {
    for (let i = 0; i < 10000000; i++) {
      // ⚠️ 这里换成小的值 先执行一部分
      if (num <= 0) break;
      count += num--; // 累加...
    }
    if (num > 0) {
      console.log(count);
      setTimeout(gl); // 然后将其放置到 异步里面去执行 - 然后不影响下面的代码执行
      // 这样写 - 是可以执行函数的
    } else {
      console.log(count); //这里打印的就是 最终的计算结果
    }
  }

  let num = 100;
  let count = 0;
  gl();

  console.log("我是下面的代码");
  ```

- **`promise` 微任务处理复杂业务**

  **如果想要并行执行，就可以 放在异步任务中去执行 - 然后 同步代码 不需要等待执行**

  ```js
  function sum(num) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 这块定义了一个 宏任务
        let count = 0;
        for (let index = 0; index < num; index++) {
          count += num--;
        }
        resolve(count);
      });
    });
  }
  
  async function gl(num) {
    // let res = await sum(num)
  
    // 也可以放到 微任务 里面 - 上面的函数就不需要了👆
    let res = await Promise.resolve().then((_) => {
      let count = 0;
      for (let index = 0; index < num; index++) {
        count += num--;
      }
      return count;
    });
  
    console.log(res);
  }
  
  gl(987654321);
  console.log("郭霖");
  ```
