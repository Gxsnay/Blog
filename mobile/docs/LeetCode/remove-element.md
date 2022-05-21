# 每日算法 - 移除元素/移动零

> **`移除元素 & 移动零` 两道题，附题解、和官网地址。**

> 如果每天做一道算法题，那是不是每天都在进步？
>
> 目的：培养算法思维，了解常见的算法。

## 移除元素

**[27. 移除元素 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/remove-element/)**

> 给你一个数组 `nums` 和一个值 `val`，你需要 **[原地](https://baike.baidu.com/item/原地算法)** 移除所有数值等于 `val` 的元素，并返回移除后数组的新长度。
>
> 不要使用额外的数组空间，你必须仅使用 `O(1)` 额外空间并 **[原地 ](https://baike.baidu.com/item/原地算法)修改输入数组**。
>
> 元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。
>
> **说明:**
>
> 为什么返回数值是整数，但输出的答案是数组呢?
>
> 请注意，输入数组是以**「引用」**方式传递的，这意味着在函数里修改输入数组对于调用者是可见的。
>
> 你可以想象内部操作如下:
>
> ```js
> // nums 是以“引用”方式传递的。也就是说，不对实参作任何拷贝
> int len = removeElement(nums, val);
>
> // 在函数里修改输入数组对于调用者是可见的。
> // 根据你的函数返回的长度, 它会打印出数组中 该长度范围内 的所有元素。
> for (int i = 0; i < len; i++) {
>     print(nums[i]);
> }
> ```

### 示例 1：

```js
输入：`nums = [3,2,2,3], val = 3`
输出：`2, nums = [2,2]`
解释：函数应该返回新的长度 2, 并且 nums 中的前两个元素均为 2。你不需要考虑数组中超出新长度后面的元素。例如，函数返回的新长度为 2 ，而 nums = [2,2,3,3] 或 nums = [2,2,0,0]，也会被视作正确答案。
```

### 示例 2：

```js
输入：`nums = [0,1,2,2,3,0,4,2], val = 2`
输出：`5, nums = [0,1,4,0,3]`
解释：函数应该返回新的长度 5, 并且 nums 中的前五个元素为 0, 1, 3, 0, 4。注意这五个元素可为任意顺序。你不需要考虑数组中超出新长度后面的元素。
```

**提示：**

- **`0 <= nums.length <= 100`**
- **`0 <= nums[i] <= 50`**
- **`0 <= val <= 100`**

### `[JS]`题解：

```js
双指针 - 赋值;
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let k = 0,
    len = nums.length;
  for (let i = 0; i < len; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
};
```

```js
双指针 - 交换;
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  function swap(arr, i, k) {
    // 置换
    const temp = arr[i];
    arr[i] = arr[k];
    arr[k] = temp;
  }
  let k = 0,
    len = nums.length;
  for (let i = 0; i < len; i++) {
    if (nums[i] !== val) {
      if (i !== k) swap(nums, i, k);
      k++;
    }
  }
  return k;
};
```

```js
计数;
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let count = 0,
    len = nums.length;
  for (let i = 0; i < len; i++) {
    if (nums[i] === val) {
      count++;
    } else {
      nums[i - count] = nums[i];
    }
  }
  return len - count;
};
```

```js
改变顺序;
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let len = nums.length; // 指向 数组的 没有的最后一位
  for (let i = 0; i < len; ) {
    // i < len 就会跳出
    if (nums[i] === val) {
      nums[i] = nums[len - 1];
      len--;
    } else {
      i++;
    }
  }
  return len;
};
```

## 移动零

**[283. 移动零 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/move-zeroes/)**

> 给定一个数组 `nums`，编写一个函数将所有 `0` 移动到数组的末尾，同时保持非零元素的相对顺序。

### 示例 1：

```js
输入: `[0,1,0,3,12]`;
输出: `[1,3,12,0,0]`;
```

**说明:**

- **必须在原数组上操作，不能拷贝额外的数组。**
- **尽量减少操作次数。**

### `[JS]`题解：

```js
双指针 - 赋值;
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  let k = 0,
    len = nums.length;
  for (let j = 0; j < len; j++) {
    if (nums[j] !== 0) {
      nums[k] = nums[j];
      k++;
    }
  }
  for (let i = k; i < len; i++) {
    nums[i] = 0;
  }
  return nums;
};
```

```js
双指针 - 交换;
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  function swap(arr, i, k) {
    const temp = arr[i];
    arr[i] = arr[k];
    arr[k] = temp;
  }

  let k = 0,
    len = nums.length;
  for (let i = 0; i < len; i++) {
    if (nums[i] !== 0) {
      if (i !== k) swap(nums, i, k);
      k++;
    }
  }

  return nums;
};
```

```js
计数 - count;
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  let count = 0;
  let len = nums.length;
  for (let i = 0; i < len; i++) {
    if (nums[i] === 0) {
      count++;
    } else {
      nums[i - count] = nums[i];
    }
  }

  for (let i = len - count; i < len; i++) {
    nums[i] = 0;
  }

  return nums;
};
```
