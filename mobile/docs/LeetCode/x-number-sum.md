# 每日算法 - `x`数之和

> 两数之和是`LeetCode`的第一题，几乎是每个同学必刷的。所以，我这个随笔贴的第一篇算法记录，就非它莫属啦。
>
> **`两数之和 & 两数之和II & 三数之和 & 四数之和`四道题，附题解、和官网地址。**

> 如果每天做一道算法题，那是不是每天都在进步？
>
> 目的：培养算法思维，了解常见的算法。

## 两数之和

**[1. 两数之和 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/two-sum/)**

> 给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 和为目标值 `target` 的那 两个 整数，并返回它们的数组下标。
>
> 你可以假设每种输入只会对应一个答案。但是，**数组中同一个元素在答案里不能重复出现。**
>
> 你可以按任意顺序返回答案。

### 示例 1：

```js
输入：`nums = [2,7,11,15], target = 9`
输出：`[0,1]`
解释：因为 `nums[0] + nums[1] == 9` ，返回 `[0, 1] `。
```

### 示例 2：

```js
输入：`nums = [3,2,4], target = 6`
输出：`[1,2]`
```

### 示例 3：

```js
输入：`nums = [3,3], target = 6`
输出：`[0,1]`
```

**提示：**

- **`2 <= nums.length <= 104`**
- **`-10^9 <= nums[i] <= 10^9`**
- **`-109 <= target <= 109`**
- **只会存在一个有效答案**

**进阶：你可以想出一个时间复杂度小于 O(n2) 的算法吗？**

### `[JS]`题解：

```js
双层for循环嵌套;
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
};
```

```js
利用数组方法判断 - 本质上也是 双层for循环嵌套
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    let nums_j = target - nums[i];
    let j = nums.indexOf(nums_j);
    if (j !== -1 && i !== j) { // 判断边界~
      return [i, j];
    }
  }
};
```

```js
空间换时间 - 边存边查~ 可利用`Map`或者`Object`
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const len = nums.length;
  const obj = {};
  for (let i = 0; i < len; i++) {
    let nums_j = target - nums[i];
    if (obj[nums_j] || obj[nums_j] === 0) {
      return [i, obj[nums_j]];
    } else {
      obj[nums[i]] = i;
    }
  };
};
```

```js
空间换时间 - 双for循环平级，时间复杂度为n~
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const len = nums.length;
  const obj = {};
  for (let i = 0; i < len; i++) {
    obj[nums[i]] = i;
  };
  for (let i = 0; i < len; i++) {
    let nums_j = target - nums[i];
    if (obj[nums_j] && obj[nums_j] !== i) {
      return [i, obj[nums_j]];
    }
  };
};
```

## 两数之和 II - 输入有序数组

**[167. 两数之和 II - 输入有序数组 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/)**

> 给定一个已按照 非递减顺序排列 的整数数组 `numbers` ，请你从数组中找出两个数满足相加之和等于目标数 `target` 。
>
> 函数应该以长度为 `2` 的整数数组的形式返回这两个数的下标值。`numbers` 的下标 从 `1` 开始计数 ，所以答案数组应当满足 `1 <= answer[0] < answer[1] <= numbers.length ` 。
>
> 你可以假设每个输入 只对应唯一的答案 ，而且你 **不可以 重复使用相同的元素**。

### 示例 1：

```js
输入：`numbers = [2,7,11,15], target = 9`
输出：`[1,2]`
解释：`2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2。`
```

### 示例 2：

```js
输入：`numbers = [2,3,4], target = 6`
输出：`[1,3]`
```

### 示例 3：

```js
输入：`numbers = [-1,0], target = -1`
输出：`[1,2]`
```

**提示：**

- **`2 <= numbers.length <= 3 * 10^4`**
- **`-1000 <= numbers[i] <= 1000`**
- **`numbers` 按 非递减顺序 排列**
- **`-1000 <= target <= 1000`**

- **仅存在一个有效答案**

### `[JS]`题解：

```js
二分查找;
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (numbers, target) {
  let len = numbers.length;
  let l,
    r = len - 1,
    m;
  let numbers_j;

  for (let i = 0; i < r; i++) {
    numbers_j = target - numbers[i]; // 目标值
    l = i + 1; // 🍓l - 永远都等于 i + 1 这里也是len - 1 的原因~
    while (l <= r) {
      m = (l + r) >> 1; // 中位数
      if (numbers_j > numbers[m]) {
        // 更新起点
        l = m + 1;
      } else if (numbers_j < numbers[m]) {
        // 更新终点
        r = m - 1;
      } else {
        // 等于 则取值
        return [i + 1, m + 1];
      }
    }
  }
};
```

```js
双指针;
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (numbers, target) {
  let len = numbers.length;
  let l,
    r = len - 1;
  for (l = 0; l < r; ) {
    if (numbers[l] + numbers[r] > target) {
      r--;
    } else if (numbers[l] + numbers[r] < target) {
      l++;
    } else {
      return [l + 1, r + 1];
    }
  }
};
```

## 三数之和

**[15. 三数之和 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/3sum/)**

> 给你一个包含 `n` 个整数的数组 `nums`，判断 `nums` 中是否存在三个元素 `a，b，c `，使得 `a + b + c = 0 `？请你**找出所有和为 `0` 且不重复的三元组**。
>
> **注意：答案中不可以包含重复的三元组。**

### 示例 1：

```js
输入：`nums = [-1,0,1,2,-1,-4]`
输出：`[[-1,-1,2],[-1,0,1]]`
```

### 示例 2：

```js
输入：`nums = []`
输出：`[]`
```

### 示例 3：

```js
输入：`nums = [0]`
输出：`[]`
```

**提示：**

- **`0 <= nums.length <= 3000`**
- **`-105 <= nums[i] <= 105`**

### `[JS]`题解：

```js
暴力循环嵌套;
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  let res = [];
  let len = nums.length;
  if (len < 3) return res; // 判断边界

  nums.sort((a, b) => a - b);
  for (let i = 0; i < len - 2; i++) {
    if (nums[i] > 0) break; // 如果第一个就大于0 直接跳出... 就是没有
    if (i > 0 && nums[i] === nums[i - 1]) continue; // 答案不包含重复 所以跳过 - 去重
    for (let j = i + 1; j < len - 1; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      for (let k = j + 1; k < len; k++) {
        if (k > j + 1 && nums[k] === nums[k - 1]) continue;
        const addRes = nums[i] + nums[j] + nums[k];
        if (addRes === 0) {
          res.push([nums[i], nums[j], nums[k]]);
        }
      }
    }
  }

  return res;
};
// 也可以利用对象去重 - 虽然这道题不适用。
function dup(arr) {
  let obj = {};
  arr.forEach((item) => {
    obj[item] = item;
  });
  // 😯 - 这里返回 Object.values 是为了保证 value 的类型。
  // 如果使用 Object.keys 则 return 后数组内都为 字符串类型了。
  return Object.values(obj);
}
```

```js
三指针求和;
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  let res = [];
  let len = nums.length;
  if (len < 3) return res; // 判断边界
  let i, l, r, sum;

  nums.sort((a, b) => a - b);
  for (i = 0; i < len - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    // 双指针移动
    for (l = i + 1, r = len - 1; l < r; ) {
      sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) {
        l++;
        while (l < r && nums[l] === nums[l - 1]) l++; // 去重
      } else if (sum > 0) {
        r--;
        while (l < r && nums[r] === nums[r + 1]) r--; // 去重
      } else {
        // 相等的情况下
        res.push([nums[i], nums[l], nums[r]]);
        l++;
        r--;
        while (l < r && nums[l] === nums[l - 1]) l++; // 去重
        while (l < r && nums[r] === nums[r + 1]) r--; // 去重
      }
    }
  }

  return res;
};
```

## 四数之和

**[18. 四数之和 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/4sum/)**

> 给你一个由 `n` 个整数组成的数组 `nums` ，和一个目标值 `target` 。请你**找出并返回满足下述全部条件且不重复的四元组 `[nums[a], nums[b], nums[c], nums[d]] ：`**
>
> - **`0 <= a, b, c, d < n`**
> - **`a、b、c 和 d 互不相同`**
> - **`nums[a] + nums[b] + nums[c] + nums[d] == target`**
>
> **你可以按 任意顺序 返回答案 。**

### 示例 1：

```js
输入：`nums = [1,0,-1,0,-2,2], target = 0`
输出：`[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]`
```

### 示例 2：

```js
输入：`nums = [2,2,2,2,2], target = 8`
输出：`[[2,2,2,2]]`
```

**提示：**

- **`1 <= nums.length <= 200`**
- **`-10^9 <= nums[i] <= 10^9`**
- **`-10^9 <= target <= 10^9`**

### `[JS]`题解：

```js
指针求和;
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
  let res = [];
  let len = nums.length;
  if (len < 4) return res;

  let l, r, sum;
  nums.sort((a, b) => a - b);
  for (let i = 0; i < len - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    const min1 = nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3];
    if (min1 > target) break;
    const max1 = nums[i] + nums[len - 3] + nums[len - 2] + nums[len - 1];
    // 跳过本次不跳出 是因为 nums[i] 是依次递增的~
    if (max1 < target) continue;

    for (let j = i + 1; j < len - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;

      const min2 = nums[i] + nums[j] + nums[j + 1] + nums[j + 2];
      if (min2 > target) break;
      const max2 = nums[j] + nums[len - 3] + nums[len - 2] + nums[len - 1];
      if (max2 < target) continue;

      for (l = j + 1, r = len - 1; l < r; ) {
        sum = nums[i] + nums[j] + nums[l] + nums[r];

        if (sum > target) {
          r--;
          while (l < r && nums[r] === nums[r + 1]) r--;
        } else if (sum < target) {
          l++;
          while (l < r && nums[l] === nums[l - 1]) l++;
        } else {
          res.push([nums[i], nums[j], nums[l], nums[r]]);
          l++;
          while (l < r && nums[l] === nums[l - 1]) l++;
          r--;
          while (l < r && nums[r] === nums[r + 1]) r--;
        }
      }
    }
  }

  return res;
};
```
