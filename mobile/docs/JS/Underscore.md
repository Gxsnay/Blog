# `JS` - `Underscore`

> `Underscore.js`工具库的组织结构解析。

## 链式语法

**`$('.box').css().animate()` - 后续操作的都是 `wrapper` 包装对象**

**`underscore` 和 `jQ` 有些差异**

`[1,2,3,3].unique().map().filter() // [6]` - 链式调用之后，我拿到的是 处理过后的数据

**`wrapper`包装对象** 就是每次我们调用之后，**返回当前的包装对象。**

## `Code`

**语法风格：迭代器函数(处理函数)，每一项都会执行这个函数。**

```js
_.map([1, 2, 3], function (num) {
  return num * 3;
});
```

**`_`是函数(那就是对象)`map`作为`_`的静态方法**

```js
_([1, 2, 3]).map(function (num) {
  return num * 3;
}); // 调用的另外一种形式
```

```js
_([1, 2, 3]); // 构造函数，调用之后会创建实力对象。👇
```

> `_()`创建实例对象 通过`无new化`的构建方式，`map`是作为实例对象的方法。

### `Guide`

**`Java Stream`流式编程**

**流式处理**

**流是一系列数据项，一次只生成一项，程序可以从输入流中一个一个读取数据项，然后以同样的方式将数据项写入输出流，一个程序的输出流很可能是另一个程序的输入流。**

**镜头切到 👇`JS` - 流式处理**

```js
// 也是 链式语法🍓🍓🍓~
// [1,2,3]
[1, 2, 3, 3].unique().map();
// unique的输出，就是map函数的输入。
```

### `Underscore`组织结构

- **作用域包裹 - 立即执行函数。**

  > 现在就可以配合 **单个文件 + `const / let` 进行设置。**

  **目的：**

  - **避免全局污染：**所有库的逻辑，库所定义和使用的变量全部被封装到了该函数的作用域中。
  - **隐私保护：**但凡是在立即执行函数中声明的函数、变量等，除非是自己想暴露，否则绝无可能在外部获得。

- **`_`对象**

  **`underscore`有下划线的意思，所以 通过`_`变量来标示自身。**

  **`_`是一个函数对象，之后所有的 api 都会被挂载到这个对象上， 如 `_.each / _.map` 等**

```js
(function (root) {
  // 构造函数
  var _ = function (obj) {
    // 数据源
    // 因为调用的时候不知道是作为 普通函数 还是 构造函数 来调用
    // 所以 需要强制来 将其当作 构造函数 来调用 new 一个实例对象
    if (this instanceof _) {
      return this;
    }

    // 如果 当前调用的 this 不是 _ 的实例对象，就会 new 一个实例对象来使用。
    // 这种方式 是最简洁有效的 无new化 的实例构建方式
    // new 的时候传递 obj 参数，这样的话，就可以以 实例对象的形式获取到参数
    if (!(this instanceof _)) {
      return new _(obj);
    }

    // this 指向的就是 _构造函数的 实例对象
    this._wrapped = obj;
  };

  // [1, 2, 3, 3] - 数组去重
  // 如果有 字母 ['a', 'A'] 想要让其 不区分大小写 去重 增加第二个参数。
  // indexOf 对字母 是区分大小写的
  // array 其实就是 数据源 或者 上一道链式调用处理后的结果
  _.unique = function (array, cb) {
    let result = [];
    let i = 0;
    while (i < array.length) {
      // 这里我就去判断 callback 有没有传 传递了我就把 函数的处理结果给 target
      const target = cb ? cb(array[i]) : array[i];
      if (result.indexOf(target) === -1) {
        result.push(target);
      }
      i++;
    }
    return result;
  };
  console.log(
    _.unique([1, 2, 3, 3, "A", "a"], function (item) {
      return typeof item === "string" ? item.toLocaleLowerCase() : item;
    })
  );

  /**
   *	map 是 _ 的静态方法
   *	_().map() 有可以是 实例对象 的方法
   *	jQuery 实现的是 无new化 的构建方法，是利用 共享原型 来实现的。🍓~
   *
   *	所以我们需要将 方法挂载到 构造原型上面，来实现方法共用， 不过多占用内存。
   * _.prototype.map = function() {};
   */
  // _.map() & _().map() 都可以调用 所以我们需要实现这种方式，参数传递也有两种方式
  // _.mixin() 函数将解决该问题
  _.map = function () {};

  _.each = function (array, cb) {
    for (let i = 0; i < array.length; i++) {
      // 拿到_每一个key，进行 函数传参调用执行
      // array[i] 就是 key 值
      cb.call(array, array[i]); // this - 重新指向
    }
  };

  // 返回一个 keys 的数组 <=> 获取 _ 上的 静态属性
  _.keysArr = function (obj) {
    var result = [];
    for (let key in obj) {
      result.push(key);
    }
    return result;
  };

  // 开启链式调用的函数
  /**
   * _([1,2,3]).chain().map()
   * [1,2,3] 数据源就会被存储到this上，执行 _().chain 的时候，就会被 mixin 带入到原型上
   * 然后 因为没有 argument 所以只有 this._wrapped 然后将其传入到 chain()函数中 就是 形参obj
   */
  _.chain = function (obj) {
    // 特殊的实例对象 只是扩展一个 属性作为标示，_chain
    // 😂 这里就类似于 Vue 的 $bus
    let instance = _(obj); // 重新创建一个 _ 实例对象
    instance._chain = true; // 特殊的属性，代表 我们开启链式调用的一个凭证。
    return instance; // 带着_chain参数的一个新的 实例对象
  };

  // 不是扩展方法，只是一个静态方法。
  var result = function (instance, obj) {
    if (instance._chain) {
      // 将 函数的处理结果 赋值给 _wrapped，修改数据源后，方便下个 函数调用。这样就可以进行 链式调用。
      instance._wrapped = obj;
      return instance;
    }
    // 这里就是之后没有链式调用的时候 返回 函数处理后的结果 - end result
    return obj;
  };

  // 停止链式调用 直接返回 最终的数据处理的结果
  _.prototype.value = function () {
    return this._wrapped;
  };

  /**
   * 1. 找到 _ 静态属性，[map, unique ... ]
   * 2. 遍历数组，将数组中的每一项成员都 扩展到 _.prototype 原型对象上面去
   * 3. 然后 就只需要关注_函数上来扩展哪些静态属性就好了，mixin函数会自动扩展到原型上
   */
  _.mixin = function (obj) {
    _.each(_.keysArr(obj), function (key) {
      // 拿到 _ 上的 静态方法函数
      let funItem = obj[key];

      // _.prototype[key] = funItem; 是不可以的，因为语法的风格导致数据传参是不一致的。
      // --- _.map([1, 2, 3],fn) - 静态方法是两个都传递的 /  _([1, 2, 3]).map(fn) 实例方法是包裹后调用回调函数的
      // 这里拿到所有的key值， 然后重新进行赋值函数
      _.prototype[key] = function () {
        // 这里直接执行 _ 原有的静态函数，那就可以得到两个相同的 函数了。
        // funItem();

        /**
         * 处理两种 不同 语法风格 的类型
         * 就需要去找到 e.g _.unique = function(array, cb) {} 里面的 array & cb
         * 因为 _([1, 2, 3]).map(fn) 原型方式是这样调用的 所以要找到 数组 和 函数。
         * this._wrapped - 通过上面new的时候设置，就可以拿到 数据源
         * arguments[0] - 可以拿到 _([1, 2, 3]).map(fn) 里面的 fn函数。
         * 拿到之后合并在一起，即可 通过 静态方法的方式 来统一做处理
         */
        let args = [this._wrapped];
        // 数组合并 因为 使用的是 apply 函数，所以 会将 arguments 的所有项 都提取出来。
        // 这里考虑到 如果不传递 或者 *传递很多参数*的时候。 使用 apply 🍓🍓🍓。 不是所有的api都只是传递一个 cb 的
        Array.prototype.push.apply(args, arguments); // 😱 amazing~ 神奇~🍓
        // return func.apply(this, args); // 这里 return 的只是函数调用的结果 不是一个_对象 所以 目前不能链式调用

        // 🍓链式调用 chain()
        /**
         * _([1,2]).chain().map() - .chain() 之后，就说明要开启链式调用了。
         * result - 这里函数 传入的 this，就可以判断 是否需要链式调用，因为带着 _chain 标示了
         * func.apply(this, args) - 也就只是 数据处理 某道工序 之后的结果。
         */
        return result(this, func.apply(this, args));
      };
    });
  };

  // 自己调用一下自己 用来扩展 该原型
  _.mixin(_);
  // 参数root扩展一个 _ 属性，挂载到全局。
  root._ = _;
})(this);
```

```html
<script>
  _.map(); // 可以打印到
</script>
```

**`Underscore`里面的`template` 模版函数里面的 解析和正则，也是一个亮点。**
