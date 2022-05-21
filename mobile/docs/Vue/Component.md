# `Vue` - 组件

> 组件可以扩展`HTML`元素，封装可重用的代码。
>
> 组件系统让我们可以用独立可复用的小组件来构建大型应用，几乎任意类型的应用的界面都可以抽象为一个组件树。

## 组件注册

- **全局注册**

  **全局注册的组件可以在任何地方使用。**

  ```js
  Vue.component("custom-a", {
    render() {
      return <div>xxx</div>;
    },
  });
  ```

  **全局注册的组件 会在后续打包 都打包进去。 可能会导致 体积过大。 🍓🍓🍓**

- **局部注册**

  **局部注册的组件只能在 当前组件中 使用。**

  ```jsx
  <pro-child></pro-child>
  import ProChild from './ProChild.vue'
  {
    components: {
      ProChild,
    }
  }
  ```

  如果局部注册的组件 在很多地方中使用。

  - 可以使用 `webpack <-> require.context()` 来批量的导入组件。

    > `require.context()` 里面 可以通过 正则匹配 来匹配`vue`文件。
    >
    > 这样就可以规定其中一个文件夹里的是`Vue`的全局组件， 其余还是 手动引入，这样就 约定大于规范了。

  - 然后在`Vue.component()`来全局注册组件。

  - 但是这样解决不了 全局注册导致体积过大的问题。

- **按需载入**

  `babel-plugin-import`

  `babel-plugin-component (Element)`

  `import { Button } from 'component';`

  > 具体可参考`API`

## 生命周期

- **`beforeCreate`**

  **`data、methods 和 DOM` 节点不可以访问，值都是`undefined`。**

- **`created`**

  **一般来做 数据初始化请求取 发送。🍓**

  **可以访问`this`实例挂载的数据 然后`Vue`就进行了解析和渲染的过程。**

  **🍓🍓 已经具有响应式的`data`， 可以发送`events`。 可以在这里发送请求**

- **`beforeMount`**

  **模板已经编译好 但是模板 还没有 根据数据 进行渲染，`ref` 还是不可以访问**

  **模板编译后，渲染之前触发。`SSR`中不可用。基本 用不上这个`Hook`。🍓**

- **`mounted`**

  **渲染完毕 `Dom` 可以访问, `ref` 可以进行访问。**

  **渲染之后触发，可以访问 组件中的`DOM` 以及 `$ref`, `SSR`中不可用。🍓**

  > 一般在用于需要在 `vue` 中嵌入非`vue`的组件时 (例如 插入 富文本编辑器 `swiper` 啥的)， 不建议用于发送请求。

- **`beforeUpdate`**

  **`data`被修改时触发。虚拟 DOM 重新渲染`dispatch`。**

  **在数据改变后，模板改变前触发。 切勿使用它 监听数据 的变化。 (使用计算属性和`watch`监听)🍓**

- **`updated`**

  **`data` 更新完成虚拟`DOM` 渲染完成。**

  **在数据改变后，模板改变后触发。 常用于重渲染后的打点，性能检测或者触发`Vue`组件中非`Vue`组件的更新。🍓**

- **`beforeDestroy`**

  **组件卸载之前 调用。 然后`Vue`解除绑定，销毁子组件 以及 事件监听**

  **组件卸载前触发，可以在此时清理事件、计时器、或者 取消订阅操作 🍓**

- **`destroyed`**

  **组件卸载完成之后调用。**

  **卸载完毕后触发， 可以做最后的 打点 或 事件触发操作。🍓**

## 动态组件

**组件相同的时候 可以通过`computed`来切换，组件不同的时候 可以通过 动态组件去注册。**

```jsx
import component1 from './component1';
import component2 from './component2';
<component :is="compoentName"></component>
{
  // 动态组件的话 不需要注册
  // components: {
  //   component1,
  //   component2
  // },
  computed: {
    compoentName() {
      return true ? component1 : component2;
    }
  }
}
```

切换组件之后`compoentName`切换之后。 数据无法保留。**如果想要保存组件数据， 需要使用`keep-alive`。**

```js
<keep-alive>
  <component :is="compoentName"></component>
</keep-alive>
```

### `keep-alive`

**`keep-alive`组件可以缓存当前子组件生成的组件实例，通过`vm.$el`获得先前的`DOM`元素，并直接插入到 页面中。**

- **`Props`**
  - `include` - 字符串 或 正则表达式。只有名称匹配的组件 会被缓存。
  - `exclude` - 字符串 或 正则表达式。 任何名称匹配的组件 都不会被缓存。
  - `max` - 数字。 最多可以缓存 多少组件实例。
- **子组件`Life Hook`**
  - `activated` - 切换走的时候调用，`keep-alive`内组件缓存成功后调用。
  - `deactivated` - 当前激活的时候调用，`keep-alive`内组件加载成功后调用。

## 自定义指令

**🍓🍓🍓 一般都是 将`DOM/BOM`操作和逻辑解耦，以便于代码`methods`方法更方便做单元测试。**

```jsx
Vue.directive("demo", {
  // 只调用一次， 指令第一次绑定到元素时 调用
  // 在这里可以 进行一次性 的初始化设置
  bind: (el, binding, vnode) => {},

  // 被绑定元素 插入到 父节点时调用
  // (仅保证 父节点存在， 但不一定已被 插入文档中)
  inserted: (el, binding, vnode) => {},

  /* 🎈
   * bind 中 el.parentNode 为 null
   * inserted 中可通过 el.parentNode 刚问当前节点的 父节点
   * inserted 钩子函数的频率 要高于 bind 函数。
   */

  // 所在组件的 VNode 更新时调用
  // 但是可能发生在其 子VNode 更新之前
  // 指令的值 可能发生了改变，也可能没有
  // 但是可以通过 比较更新前后的值 来忽略 不必要的模板更新
  update: (el, binding, vnode, oldVnode) => {},

  // 指令所在组件的 VNode 及其 子VNode 全部更新后 调用
  componentUpdate: (el, binding, vnode, oldVnode) => {},

  /*
   * 可以根据比较 oldVnode 和 VNode 之间的差异来判断模板是否需要更新
   * 以减少不必要的模板更新， 从而一定程度上 提高组件性能
   */

  // 只调用一次，指令与元素 解绑时 调用。
  unbind: (el, binding, vnode) => {},
});

<div v-demo></div>;
```

### 钩子函数参数说明

**除了`el`之外，其他参数都应该是只读的，切勿进行修改。 如果需要在钩子之间共享数据，建议通过元素的`dataset`来进行。**

```js
(
  // 指令所 绑定的元素，可以用来直接操作 DOM
  el,

  // binding 一个对象，包含以下属性
  {
    // 指令名， 不包括 v- 前缀
    name,
    // 指令的绑定值，例如： v-my-directive="1 + 1" 中， 绑定值为 2
    value,
    // 指定绑定的前一个值， 仅在 update 和 componentUpdate 钩子中可用
    oldValue,
    // 字符串形式的指令表达式。 例如： v-my-directive="1 + 1" 中， 表达式为 1 + 1
    expression,
    // 传给指令的参数，可选。 例如： v-my-directive:foo 中， 参数为: "foo"
    arg,
    // 一个包含修饰符的对象 例如： v-my-directive.foo.bar 中 修饰符对象为 { foo: true, bar: true }
    modifiers,
  },

  // Vue 编译生成的 虚拟节点
  vnode,

  // 上一个虚拟节点， 尽在 update 和 componentUpdate 钩子中可用
  oldVnode
) => {};
```

- **当我们的`methods`中存在操作`DOM/BOM`的逻辑时，就该思考可否抽象成一个 自定义指令?**

  **这样更容易被 单元测试。 🍓🍓🍓**

```jsx
// 实操代码：
/**
  * 1. v-resize 指令，监听窗口大小改变， 通过监听函数 onResize 相应
  * 2. 可通过 direction 控制监听页面高度 或者 宽度的变化 v-resize:[direction].quiet="onResize"
  * 3. 可通过修饰符 .quiet 来控制是否只在 指令初始化的时候 响应 onResize 函数
  */
<div v-resize="onResize">window width is: {{ length }}</div>
{
  data() {
    return {
      direction: 'verical',
      length: 0,
    }
  },
    methods: {
      onResize(length) {
        this.length = length;
      };
    }
}
Vue.directive('resize', {
  inserted: (el, binding, vnode) => {
    const callback = binding.value;
    const direction = binding.arg;
    const modifiers = binding.modifiers;

    const result = () => {
      return direction === 'verical' ? window.innerHeight : window.innerWidth;
    }
    const onResize = () => callback(result());

    window.addEventListener('resize', () => onResize);

    if (!modifiers || !modifiers.quiet) {
      onResize(); // 就默认调用一次
    }

    // 除了 el 以外， 其他数据都是 只读的
    // 所以我们可以 把 共享的数据 放置在 el 上
    el._onResize = onResize;
  },
  unbind: (el, binding, vnode) => {
    if (el._onResize) {
      window.removeEventListener('resize', () => el._onResize);
      delete el._onResize;
    }
  },
})
```

## 双向绑定

**`v-model` / 表单处理 / 自定义组件 `v-model` 双向绑定**

**`Vue` 是 单向数据流 的**

**父 <=> `prop/$emit()` <=> 子 / `.sync`**

> `.sync` 修饰符的双向绑定是通过 ( `v-bind:msg + v-on:update:msg` ) 实现的。

### 表单处理

- `v-model`

  **用于在表单元素`input / textarea`及`select`上创建 双向数据绑定的语法糖。**

  - **`<select>`元素**，使用 `value`属性(作为`prop`)和`change`事件(作为`$emit()`传递)， 来实现的`v-model`。
  - **`<textarea>`和`<input>`**使用`value`属性(作为`prop`)和`input`事件(作为`$emit()` 传递)， 来实现的`v-model`。

  - **如果想监听`input / textarea`上的`change`事件 => `.lazy`修饰符。**

    ```jsx
    <input v-model.lazy="msg"> // 在 change 时 而非 Input 时 更新
    ```

  - **`<input type="checkbox">`和`<input type="radio">`**

    **使用`checked`属性(作为 `prop`)和`change`事件(作为`$emit()`传递)， 来实现的 `v-model`**

    ```jsx
    <input type="text":value="text" @input="text = $event.target.value" />
    {
      data() {
        return text: ''
      }
    }
    // 👆 代码... 如果 中文、日文等 需要拼接合成的，也会显示在输入框里。
    // v-model 则不会。合成了之后 才会显示。这样在搜索的时候减少了不必要的开销和请求，还有 ui 样式的问题等等。
    ```

  - **`v-model.lazy` 是 屏蔽`Input`事件，调用了`change`事件。 `input / textarea`**

  - **`v-model.trim` 屏蔽空格**

  - **`v-model.number` 将字符串转换成`number`**

### 自定义组件 `v-model` 双向绑定

```js
// 父组件 `parent-com`
{ <child-com :selectd="selected" :list="list"></child-com> }
 import childCom from 'childCom';
{
  components: { childCom },
  data() {
    return {
      selected: '',
      list: [],
    }
  }
}
```

```js
// 子组件 child-com
{
  model: {
    prop: 'selected',
    event: 'change'
  }, // 约定了 prop event
  // 那么 props 传递的时候 就需要有 selected
  props: ['list', 'selected'],
  data() {
    return {
      showBottom: false,
    }
  },
  methods: {
    select(i) {
      this.showBottom = false;
      this.$emit('change', i);
    }
  }
}
```

### 组件设计

**稳定-多页面公用 / 不稳定-当前页面独有**

**共用的组件抽取出来，其余各自还是各自的`content`。**

### `slot` - 插槽

**`v-slot` 简写为 `#:header`。**

- **具名插槽**

  ```jsx
  <template v-slot:header>   父
  <slot name="header">   		 子

  {
    // name="default" 如果name不写 那么默认就是 default
  }

  ```

- **编译作用域**

  > **父级模板里的所有内容都是在 父级作用域 中编译的。**
  >
  > **子模版里面的所有内容 都是在 子作用域 中编译的。**

  ```vue
  <template>
    <div>
      <slot-layout>
        /** * 这里的 content 对于 slotLayout 是不可见的~ *
        父级模板里的所有内容都是在 父级作用域 中编译的 * 子模版里面的所有内容
        都是在 子作用域 中编译的 */
        <template #:default>{{ content }}</template>
      </slot-layout>
    </div>
  </template>
  <script>
  import slotLayout from 'slotLayout';
  {
    components: { slotLayout },
      data() {
        return {
          content: 'Hello Slot'
        }
      }
  }
  </script>
  ```

- **作用于插槽**

  ```js
  // sLay.vue
  <template>
    <s-load url="https://xxx" #default="{data}">
      <div>
        123
  		{{ data.name }}
  		</div>
  	</s-load>
  </template>
  import sLoad from 'sLoad';
  {
    components: { sLoad },
  }
  
  // sLoad
  <template>
    <div>
    <div v-if="loading">加载中...</div>
  	{/* data 传递给 外层 */}
  	{/* 组件 预留内容 外层调用根据 需求 实时编写~ */}
  	<slot v-else :data="data"></slot>
  </div>
  </template>
  {
    props: ['url'],
      data() {
      return {
        loading: true,
        data: {}
      }
    },
    created () {
      setTimeout(() => {
        this.loading = false;
        this.data = { name: 'xxx' }
      }, 1000);
    },
  }
  ```

## 组件通信

### 组件跨层级访问

- **子组件 访问 外层组件**

  - **子组件 直接修改 外层组件数据是 不允许的。**

  - **可以通过`$emit()` 一层一层 向上通知，然后让外层组件自己修改数据。**

  - **`$root`(可以访问当前组件的根组件)，`$parent`(可以访问 当前组件 的父组件)。**

    可以直接修改数据，也可以访问方法/计算属性等。

    ```js
    // element code
    dispath: (componentName, eventName, params) => {
      const parent = this.$parent || this.$root;
      const name = parent.$options.componentName;
  
      while (parent && (!name || name !== componentName)) {
        // 遍历去找 然后找到自身的 目标父组件
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.componentName;
        }
      }
  
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    };
    ```

- **父组件 访问 子组件**

  - **`$ref`**

    > `this.$refs.refName.fn();`

    只能在`mounted`生命周期钩子函数被调用之后才能使用。

    `$parent`和`$root`在各个生命周期钩子函数 都可以使用，**但是这样就造成了强耦合，父子组件必须成对使用。**

### 依赖注入

> 声明了当前组件依赖的父组件们(直系的父组件)的外部`prop`有哪些。

```js
{ // 父级定义
  provide() {
    return {
      fish: {
        love: 'tama'
      }
    }
  }
}
{ // 子级 不论 嵌套多少层 都可以直接使用
  inject: ['fish'],
  methods: {
    say() {
      console.log(this.fish.love);
    }
  }
}
// vue2.0/src/core/instance/inject.js - 源码路径
	// 里面也是 while循环 然后层层找 .$parent里面的属性 然后调用方法，所以就是 就近原则。
```

- `vue2.0/src/core/instance/inject.js` - 源码路径

  里面就声明了`while`循环，然后层层找`.$parent`里面的属性，然后调用方法，所以就是**就近原则。**

  - **优点**
    - 祖先组件不需要知道哪些后代组件使用它提供的属性。
    - 后代组件不需要知道被注入的属性来自哪里。
  - **缺点**
    - **组件间的 耦合较为紧密，不易重构。**
    - **提供的属性是非响应式的。**

### 组件之间的透传以及组件二次封装(样式问题)

- **样式之间的修改透传**

  - **去掉`scoped`**
  - **`>>>`**
  - **`::deep`**

- **组件二次封装 「自定义`v-model`」**

  - 父组件

    ```jsx
    <custom-input
      v-model="value"
      @blur="customBlur"
      ></custom-input>
    // components ...
    {
      customBlur() {
        console.log('customBlur is run');
      },
    }
    ```

  - 子组件

    ```jsx
    // 方法1
    <div> // 这个是基础版本 一个一个传递方法 和 自定义 v-model
      <el-input v-model="value"
        @input="$emit('input', value)"
        @blur="$emit('blur')"></el-input> // 5
    </div>
    {
      model: {
        prop: 'initValue', // 1
          event: 'input' // 2
      },
      props: ['initValue'], // 3
        data() {
        return {
          value: this.initValue // 4
        }
      }
    }
    
    // 方法2
    <div>
      <el-input
        v-bind="$attrs"
        v-on="$listeners"
        ></el-input>
    </div>
    // 下面方法，什么都不写，就可以做成透传方法和自定义 v-model 了。
    	// v-bind="$attrs" 来传递父组件上的 prop class 和 style。
    	// v-on="$listeners" 来传递父组件上的 事件监听器 和 事件修饰符。
    .el-input >>> .el-input_inner {
      border: none;
    }
    ```

## 插件

### `Mixin`模式

`Mixins`是可以轻松被一个子类 或 一组子类继承功能的类，目的是函数复用。

- **`Vue.mixin`** - 全局注册`Mixin`

  **全局注册的`Mixin`会影响到 所有创建的`Vue`实例。**

  ```js
  const mixin = {
    created: function() {
      console.log('mixin created');
    },
    methods: {
      foo: function() { console.log('mixin foo'); },
      config: function() { console.log('mixin config'); },
    }
  }
  Vue.mixin(mixin); // 全局注册
  // 组件自身
  {
    created: function() {
      console.log('component created');
      this.config();
    },
    methods: {
      config: function() { console.log('component config'); },
    }
  }
  // 打印如下
  // mixin created
  // mixin created
  // mixin created ... (因为在全局注册 每个组件 的 created 都会被打印一下)
  // component created
  // component config
  ```

  **同名钩子函数将合并为一个数组，混入对象的钩子，在组件自身钩子之前 调用 🍓🍓🍓**

  **二者的`methods / components / directivers` 将合并为同一对象，若对象键值冲突时，取组件对象的键值对(就近原则) 🍓🍓🍓**

### 插件

**`Vue.use( plugin )`**

> `.use(vuex)`等等...，这是在安装 第三方插件。

**`Vue.use`接收一个函数或者提供`Install`方法的对象作为参数。**

```js
// vuex 源码
export default function (Vue) {
  const version = Number(Vue.version.split(".")[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit }); // beforeCreate 钩子函数 是在组件最初 初始化 的时候被调用。
    // 并且插件的 beforeCreate 钩子函数 也会在具体组件的 beforeCreate 钩子函数前 触发。
  } else {
    /*...*/
  }

  function vuexInit() {
    // Vuex 的单例模式
    const options = this.$options;
    if (options.store) {
      // 一开始设置 options.store
      this.$store =
        typeof options.store === "function" ? options.srore() : options.store;
    } else if (options.parent && options.parent.$store) {
      // 当其他节点 进入的时候 就 从父节点获取 store
      this.$store = options.parent.$store;
    }
  }
}
```

## 组件复用

### `Mixins`

```js
// 例如：校验不同种类的`input`框然后表单提交的时候校验。
// 不需要一个一个写验证方法 可以通过 mixin 来将一个 通用的函数 同步到组件去。
{ // 组件
  import validateMixin from './mixin';
  mixins: [validateMixin],
  methods: {
    blur() {
      this.validate();
    }
  }
}
{ // mixin
  methods: {
    validate() {
      // 校验逻辑
    };
  }
}
```

**同名钩子函数将合并为一个数组，混入对象的钩子，在组件自身钩子之前 调用 🍓🍓🍓**

**二者的`methods / components / directivers` 将合并为同一对象，若对象键值冲突时，取组件对象的键值对(就近原则) 🍓🍓🍓**

- **缺陷：** - 打破了原有组件的封装。
  - 增加了组件的复杂度。
  - 可能会出现 **命名冲突** 的问题。
  - 仅仅只是对逻辑的复用，模板不能复用。

### `HOC`高阶组件

**装饰者模式的一种实现**

**函数接收一个组件作为参数，并返回一个新组件；可复用的逻辑在函数中实现。**

```jsx
{ // HOC 组件
  import Vue from 'vue';
  const ValidateHoc = Component => { // 这里的Component 和 下面 <Component></Component> 对应
    return Vue.component(`hoc-${Component.name}`, {
      data: () => ({ errMsg: '' }),
      methods: {
        validate() {
          // 校验逻辑
          return true
        }
      },
      render() {
        return (
          <div>
            <Component on-blur1="{ this.validate }"></Component> // 接收 blur1 方法 然后调用校验
            {/* 共用的模板 固定下来 */}
            { this.errMsg }
          </div>
        )
      }
    })
  }
}
{ // input 组件
  <template>
    <input type="text" @blur="$emit('blur1')"/> // 传递方法
  </template>
}
{ // 外层组件 (组装 HOC 组件 和 Input组件)
  import CustomInput from './CustomInput';
  import ValidateHoc from './ValidateHoc';

  const ValidateInput = ValidateHoc(CustomInput); // ValidateHoc 装饰函数

  export default {
    name: 'app',
    render() {
      return <ValidateInput />
    }
  }
}
```

**相比较`Mixin`的优点： **

- 模板可复用
- **不会出现命名冲突， 本是上是一个`HOC`，套了一层父组件。**

**缺点：**

- 组件**复杂度高，多层嵌套**，调试会很痛苦。

### `Renderless`组件 - `slot`插槽

**复用的逻辑沉淀在包含`slot`插槽的组件中。**

**接口由插槽`Prop`来暴露。**

```jsx
{ // out-component
  <template>
    <div>
      {/* FIXME: 组件复用~ */}
      <s-validate #default="{ validate }" :value="value" :rule="rule">
        <input type="text" @blur="validate" v-model="value"/>
      </s-validate>
      <s-validate #default="{ validate }" :value="textVal" :rule="textRules">
        <textarea type="text" @blur="validate" v-model="textVal"/>
      </s-validate>
    </div>
  </template>

  import sValidate from './sValidate';
  export default {
    data: () => (
      value: 'hi',
      rules: [
        test: function(value) {
            return /\d+/.test(value);
        },
        message: "请输入一个数字"
      ],
      textVal: 'textVal',
      textRules: [
        test: function(value) {
          return !!value;
        },
        message: "请输入内容"
      ],
    ),
    components: {
      sValidate
    }
  }
}

{ // in-component
  <template>
    <div>
      <slot :validate="validate"></slot>
      {{ errMsg }}
    </div>
  </template>
  export default {
    props：['value', 'rules'],
    data: () => ( errMsg: '' ),
    methods: {
    validate() {
      let validate = this.rules.reduce((pre, cur) => {
     	  let check = cur && cur.test && cur.test(this.value);
     	  this.errMsg = check ? "" : cur.message;
          return pre && check;
        }, true);
        return validate;
    	}
    }
	}
}
```

**优点：**

- **模板可复用。**
- **不会出现命名冲突。**
- **符合 依赖倒置 原则。**
- **复用的接口来源清晰。**
