# 「 记 」`Set`的一次遍历问题

`Set`的遍历代码如下：

```js
let set = new Set([1]);
let index = 2;

set.forEach((item) => {
  set.delete(1);
  set.add(1); // -a 造成死循环
  set.add(2); // -b 这样则不会死循环，为什么？🤔？
  set.add(index++); // -c 造成死循汗
  console.log(123);
});
```

`a、c`这两种都会造成死循环，`b`情况则不会。

## 分析

**「 由于`Set`数据结构成员都是唯一的。 」**

- `a` - `set.delete(1) -> set.add(1)`

  这样`set`下次循环的时候，会察觉还有值，会造成死循环。

  > **`Set.forEach`为什么会这样实现？在扩展中有解释（以及为什么）。👇**

- `b` - `set.delete(1) -> set.add(2)`

  不会死循环是因为「 结构成员都是唯一 」。所以`123`打印两次，第二次`add(2)`时视为无效。

- `c` - `set.add(index++)`

  是因为`add(2 -> 3 -> 4 -> 5...)`每次值不一样，所以死循环。

## `forEach`跳出循环

> `desc：` 分析问题的途中，想利用`forEach`进行调试。结果`return`并不能中止...
>
> 特此记录 📝 一下`forEach`跳出循环的问题。

- 使用`return`只能跳出 本次/当前 循环，类似`continue`效果，并不能终止整个循环。
- `forEach`不能使用`continue`和`break`来跳出循环。 -- 报错
- `forEach`可以通过`try-catch`抛出异常的方式跳出循环。 -- 偏方

**这是因为`forEach`本身无法跳出循环，必须遍历所有的数据才能结束。它传入的是一个回调函数，因此形成了一个作用域。**

> 它内部所定义的变量不会像`for`循环一样污染全局变量。

## 扩展

同样操作，`Object / Array`是不会出现死循环现象的。

```js
let obj = { a: 1 },
  arr = [1];

for (let key in obj) {
  // 只打印一次 key- a
  obj[index++] = index; // 不影响，不会出现死循环。
  console.log("key-", key);
}
// Object.keys(obj) 也同上面表现一致，只打印一次。

arr.forEach((_item) => {
  // 只打印一次 _item- 1
  // arr.push(1, 2, 3); // 不影响，不会出现死循环。
  // arr = [...arr, 1, 2, 3]; // 不影响，不会出现死循环。
  console.log("_item-", _item);
});
```

### `Array、Set`中`forEach`方法的区别？

> `Array / Object` 和 `Set`在遍历过程中的表现为什么不一致？
>
> 原因如下：👇

- `Array_forEach`

  [`Array_forEach`定义](https://tc39.es/ecma262/#sec-array.prototype.foreach)

  **`Array_forEach`是「 首先获取了`Array`的长度 🍓 」，然后使用循环访问每个元素。**

  **所以不是说新插入的元素不访问，而是因为插入的位置超过了`forEach`执行时的数组大小。😯**

  ```js
  let arr_1 = [1, 2];
  arr_1.forEach((_item_1) => {
    // 打印 1、5 -- 👆 验证了上面说法～
    console.log("_item_1", _item_1);
    arr_1.pop();
    arr_1.push(5);
  });
  ```

- `Set_forEach`

  [`Set_forEach`定义](https://tc39.es/ecma262/#sec-set.prototype.foreach)

  **`Set_forEach`是「 按照插入顺序依次访问各个元素 🍓 」。**

  **而且明确约定了，在`forEach`开始执行之后插入的元素也要被访问。**

  `Set numEntries to the number of elements of entries.` - 是`ECMA`中对于`Set_forEach`的描述。
