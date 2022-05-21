# 每日算法 - [ 反转 / 回文 / 删除 ]链表

> **`反转链表 / 回文链表 / 删除链表中的节点 / 移除链表元素 / 删除排序链表中的重复元素` 五道题，附题解、和官网地址。**

> 如果每天做一道算法题，那是不是每天都在进步？
>
> 目的：培养算法思维，了解常见的算法。

## 反转链表

**[剑指 Offer 24. 反转链表 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/)**

> 定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

### 示例 1：

```markdown
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

**提示：**

**`0 <= 节点个数 <= 5000`**

**注意**：本题与主站 206 题相同：https://leetcode-cn.com/problems/reverse-linked-list/

### `[JS]`题解：

[反转链表-循环♻️-图解](https://img.gxsnay.com/reverse-link.png)

```js
循环♻️置换
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  let cur = head;
  let pre = null;
  let temp;
  while(cur) {
    temp = cur.next;
    cur.next = pre;
    pre = cur;
    cur = temp;
  }
  return pre;
};
```

[反转链表-递归♻️-图解](https://img.gxsnay.com/reverse-link-2.png)

```js
递归;
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 *
 * 递归三步骤
 * 1. 求解基本问题，找到跳转递归的条件。
 * 2. 将大问题 如何变成 小问题。
 * 3. 小问题的解 如何变成 大问题的解。
 */
var reverseList = function (head) {
  if (head === null || head.next === null) return head; // 1
  let res = reverseList(head.next); // 2 - 递归到最后，一层一层解套。
  head.next.next = head; // 3
  head.next = null; // 3
  return res;
};
```

## 回文链表

**[234. 回文链表 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/palindrome-linked-list/)**

> 给你一个单链表的头节点 `head` ，请你判断该链表是否为回文链表。如果是，返回 `true` ；否则，返回 `false` 。

### 示例 1：

![img](https://assets.leetcode.com/uploads/2021/03/03/pal1linked-list.jpg)

```markdown
输入：head = [1,2,2,1]
输出：true
```

### 示例 2：

![img](https://assets.leetcode.com/uploads/2021/03/03/pal2linked-list.jpg)

```markdown
输入：head = [1,2]
输出：false
```

**提示：**

- **链表中节点数目在范围`[1, 105]`内**
- **`0 <= Node.val <= 9`**

**进阶：你能否用`O(n)`时间复杂度和`O(1)`空间复杂度解决此题？**

### `[JS]`题解：

```js
数组存取 双指针/栈 - for
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
  let arr = [], cur = head;
  while(cur !== null) {
    arr.push(cur.val);
    cur = cur.next;
  };
  let i, j;
  for (i = 0, j = arr.length - 1; i < j; (i++, j--)) {
    if (arr[i] !== arr[j]) return false;
  }
  return true;
};
```

```js
数组存取 双指针/栈 - while
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
  let arr = [], cur = head;
  while(cur !== null) {
    arr.push(cur.val);
    cur = cur.next;
  };
  while(head !== null) {
    if (head.val !== arr[arr.length - 1]) return false;
    arr.pop();
    head = head.next;
  };
  return true;
};
```

```js
快慢指针 + 反转链表。
快慢指针是 O(1) 的空间复杂度，因为只在链表上进行操作。
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
  if(head === null || head.next === null) return true;
  let slow = head;
  let fast = head;

  // 快慢指针 其实就是一个 确定时间点位置的一个工具，在不知道长度的情况下，确定中间位置。
  while(fast.next !== null && fast.next.next !== null) {
    fast = fast.next.next;
    slow = slow.next;
  } // 这一段其实就是为了确定 慢指针到了 中间位置。

  // 反转链表 可查看👆
  let rev = reverse(slow.next);
  while(rev !== null) {
    if (head.val !== rev.val) return false;
    head = head.next;
    rev = rev.next;
  }
  return true;
};

function reverse(head) {
  if (head === null || head.next === null) return head;
  let cur = head;
  let pre = null;
  let tmp;
  while(cur !== null) {
    tmp = cur.next;
    cur.next = pre;
    pre = cur;
    cur = tmp;
  }
  return pre;
};
```

```js
😯(amazing~ 神奇) - 利用字符串拼接
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
  let a = '', b = '';
  while(head !== null) {
      a = a + head.val;
      b = head.val + b;
      head = head.next;
  };
  return a === b;
};
```

## 删除链表中的节点

**[237. 删除链表中的节点 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/delete-node-in-a-linked-list/)**

> 请编写一个函数，用于 删除单链表中某个特定节点 。在设计函数时需要注意，你无法访问链表的头节点`head` ，只能直接访问 要被删除的节点 。
>
> **题目数据保证需要删除的节点 不是末尾节点 。**

### 示例 1：

![img](https://assets.leetcode.com/uploads/2020/09/01/node1.jpg)

```markdown
输入：head = [4,5,1,9], node = 5
输出：[4,1,9]
解释：指定链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9
```

### 示例 2：

![img](https://assets.leetcode.com/uploads/2020/09/01/node2.jpg)

```markdown
输入：head = [4,5,1,9], node = 1
输出：[4,5,9]
解释：指定链表中值为  1  的第三个节点，那么在调用了你的函数之后，该链表应变为 4 -> 5 -> 9
```

### 示例 3：

```markdown
输入：head = [1,2,3,4], node = 3
输出：[1,2,4]
```

### 示例 4：

```markdown
输入：head = [0,1], node = 0
输出：[1]
```

### 示例 5：

```markdown
输入：head = [-3,5,-99], node = -3
输出：[5,-99]
```

**提示：**

- **链表中节点的数目范围是`[2, 1000]`**
- **`-1000 <= Node.val <= 1000`**
- **链表中每个节点的值都是唯一的**
- **需要删除的节点`node`是 链表中的一个有效节点 ，且 不是末尾节点**

### `[JS]`题解：

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */
var deleteNode = function (node) {
  const delNode = node.next;
  node.val = delNode.val;
  node.next = delNode.next;
  delNode.next = null;
};
```

## 移除链表元素

**[203. 移除链表元素 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/remove-linked-list-elements/)**

> 给你一个链表的头节点 `head` 和一个整数 `val` ，请你删除链表中所有满足 `Node.val == val` 的节点，并返回 **新的头节点** 。

### 示例 1：

![img](https://assets.leetcode.com/uploads/2021/03/06/removelinked-list.jpg)

```markdown
输入：head = [1,2,6,3,4,5,6], val = 6
输出：[1,2,3,4,5]
```

### 示例 2：

```markdown
输入：head = [], val = 1
输出：[]
```

### 示例 3：

```markdown
输入：head = [7,7,7,7], val = 7
输出：[]
```

**提示：**

- **列表中的节点数目在范围`[0, 104]`内**

- **`1 <= Node.val <= 50`**

- **`0 <= val <= 50`**

### `[JS]`题解：

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function (head, val) {
  let dummyHead = new ListNode(null);
  // 加了个虚拟 头节点
  // 删除链表中间节点 和 删除头节点是不一样的
  dummyHead.next = head;
  let prev = dummyHead;
  while (prev.next !== null) {
    if (prev.next.val === val) {
      let delNode = prev.next;
      prev.next = delNode.next;
      delNode.next = null;
      // prev.next = prev.next.next;
    } else {
      prev = prev.next;
    }
  }
  return dummyHead.next;
};
```

## 删除排序链表中的重复元素

**[83. 删除排序链表中的重复元素 / `leetcode`链接 🔗](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/)**

> 存在一个按升序排列的链表，给你这个链表的头节点 `head` ，请你删除所有重复的元素，使每个元素 **只出现一次** 。
>
> 返回同样按升序排列的结果链表。

### 示例 1：

![img](https://assets.leetcode.com/uploads/2021/01/04/list1.jpg)

```markdown
输入：head = [1,1,2]
输出：[1,2]
```

### 示例 2：

![img](https://assets.leetcode.com/uploads/2021/01/04/list2.jpg)

```markdown
输入：head = [1,1,2,3,3]
输出：[1,2,3]
```

**提示：**

- **链表中节点数目在范围`[0, 300]`内**

- **`-100 <= Node.val <= 100`**
- **题目数据保证链表已经按升序排列**

### `[JS]`题解：

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function (head) {
  // 删除后面的节点 所以我们就不需要使用 虚拟节点
  let cur = head;
  while (cur !== null && cur.next !== null) {
    if (cur.val === cur.next.val) {
      let delNode = cur.next;
      cur.next = delNode.next;
      delNode.next = null;
    } else {
      cur = cur.next;
    }
  }
  return head;
};
```
