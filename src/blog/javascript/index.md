# JS 日常整理

## toLocaleString()

::: tip 介绍
toLocaleString() 方法返回这个数字在特定语言环境下的表示字符串。<br/>
语法：numObj.toLocaleString([locales [, options]])
:::

```js
let number = 123456789;
console.log(number.toLocaleString());
// 123,456,789

number = 12345.6784;
console.log(number.toLocaleString());
// 12,345.678

number = 12345.6785;
console.log(number.toLocaleString());
// 12,345.679

// nu 扩展字段要求编号系统，e.g. 中文十进制
console.log(number.toLocaleString("zh-Hans-CN-u-nu-hanidec"));
//  一二三,四五六.六七九
```
> 参考资料：[MDN - Number.prototype.toLocaleString()](https://mdn.io/Number.prototype.toLocaleString())

## Math 常用的属性和方法

::: danger 注意
`Math`不是一个构造器。`Math`的所有属性与方法都是静态的。
:::

1.  ::: tip Math.PI
    `Math.PI`表示一个圆的周长与直径的比例，约为 3.14159。
    :::

2.  ::: tip Math.abs()
    `Math.abs()`函数返回给定数字的绝对值。
    :::

    ```js
    Math.abs("-1"); // 1
    Math.abs(-2); // 2
    Math.abs(null); // 0
    Math.abs("string"); // NaN
    Math.abs(); // NaN
    ```

3.  ::: tip Math.ceil()
    `Math.ceil()`函数返回大于或等于一个给定数字的最小整数。既`向上取整`。
    :::

    ```js
    Math.ceil(0.95); // 1
    Math.ceil(1.05); // 2
    Math.ceil(-1.05); // -1
    Math.ceil(1); // 1
    ```

4.  ::: tip Math.floor()
    `Math.floor()`返回小于或等于一个给定数字的最大整数。既`向下取整`。
    :::

    ```js
    Math.floor(45.95); // 45
    Math.floor(45.05); // 45
    Math.floor(45); // 45
    Math.floor(-45.05); // -46
    Math.floor(-45.95); // -46
    ```

5.  ::: tip Math.max()
    `Math.max()`函数返回一组数中的最大值。如果给定的参数中至少有一个参数无法被转换成数字，则会返回`NaN`。如果没有参数，则结果为 `-Infinity`。
    :::

    ```js
    Math.max(); // -Infinity
    Math.max(3, -1, 1, 2, 3, 4, 5); // 5
    Math.max(3, -1, 1, 2, 3, 4, 5, "", false); // 5
    Math.max(3, -1, 1, 2, 3, 4, 5, "", false, undefined); // NaN

    const arr = [3, -1, 1, 2, 3, 4, 5];
    Math.max.apply(null, arr); // 5
    Math.max(...arr); // 5
    ```

6.  ::: tip Math.min()
    `Math.min()`函数返回一组数中的最小值。如果给定的参数中至少有一个参数无法被转换成数字，则会返回`NaN`。如果没有参数，结果为 `Infinity`。
    :::

    ```js
    Math.min(); // Infinity
    Math.min(3, -1, 1, 2, 3, 4, 5); // -1
    Math.min(3, -1, 1, 2, 3, 4, 5, "", false); // -1
    Math.min(3, -1, 1, 2, 3, 4, 5, "", false, undefined); // NaN

    const arr = [3, -1, 1, 2, 3, 4, 5];
    Math.min.apply(null, arr); // -1
    Math.min(...arr); // -1
    ```

7.  ::: tip Math.pow()
    `Math.pow(x, y)`函数返回基数 x 的指数 y 次幂，即 x<sup>y</sup>。<span style="color:red">等价于 `x`y`。</span>
    :::

    ```js
    Math.pow(2, 10); // 1024
    2 ` 10; // 1024
    Math.pow(4, 0.5); // 2
    Math.pow(4, -0.5); // 0.5
    Math.pow(-7, 0.5); // NaN
    ```

8.  ::: tip Math.random()
    `Math.random()`函数返回一个浮点数, 伪随机数在范围从 0 到小于 1，也就是说，从 0（包括 0）往上，但是不包括 1（排除 1），然后您可以缩放到所需的范围。
    :::

    ```js
    Math.random();
    Math.floor(Math.random() * 3);
    ```

9.  ::: tip Math.round()
    `Math.round()`函数返回一个数字四舍五入后最接近的整数。
    :::

    ```js
    Math.round(20.49); // 20
    Math.round(20.5); // 21
    Math.round(-20.5); // -20
    Math.round(-20.51); // -21
    Math.round(-20.49); // -20
    ```

10. ::: tip Math.sqrt()
    `Math.sqrt()`函数返回一个数的平方根。y^2 = x。如果参数 number 为负值，则返回 `NaN`。
    :::

    ```js
    Math.sqrt(9); // 3
    Math.sqrt(2); // 1.414213562373095
    Math.sqrt(1); // 1
    Math.sqrt(0); // 0
    Math.sqrt(-1); // NaN
    Math.sqrt(-0); // -0
    ```

11. ::: tip Math.trunc()
    `Math.trunc()`函数会将数字的小数部分去掉，只保留整数部分。<span style="color:red">等价于 ~~（无 +0、-0 区分）。</span>`Math.trunc()`的执行逻辑很简单，仅仅是删除掉数字的小数部分和小数点，不管参数是正数还是负数。传入该方法的参数会被隐式转换成数字类型。
    :::

    ```js
    Math.trunc(13.37); // 13
    Math.trunc(42.84); // 42
    Math.trunc(0.123); //  0
    Math.trunc(-0.123); // -0
    Math.trunc("-1.123"); // -1
    Math.trunc(NaN); // NaN
    Math.trunc("foo"); // NaN
    Math.trunc(); // NaN

    ~~-0.95; // 0
    ~~0.95; // 0
    ~~-1.05; // -1
    ~~-1.95; // -1
    ~~45.95; // 45
    ~~45.05; // 45
    ```

> 参考资料：[MDN - Math](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)

## 数值数组去重
::: danger 注意
`Set()` 的成员值都是唯一的，可以过滤重复的 `Number`、`String`、`Boolean`、`undefined`、`null`、`NaN`， 无法过滤重复的 `Object`。
:::

```js
let arr = [1, 2, 5, 3, 3, 1, 4, 9, 7, 1, 5];

console.log([
  ...new Set([
    1,
    1,
    "3",
    "3",
    NaN,
    NaN,
    undefined,
    undefined,
    null,
    null,
    true,
    true,
    {},
    {},
  ]),
]);
// [1, "3", NaN, undefined, null, true, {}, {}]
```

- 通过 `Set()` 和 扩展运算符
```js
[...new Set(arr)];
// [1, 2, 5, 3, 4, 9, 7]
```

- 通过 `Array.from()`
```js
Array.from(new Set(arr));
// [1, 2, 5, 3, 4, 9, 7]

// 拓展：
[...new Set([1, 1, "3", "3", NaN, NaN, undefined, undefined, null, null, true, true, {}, {}])];
// [1, "3", NaN, undefined, null, true, {}, {}]
```

- 通过 `Array.prototype.filter()` 和 `Array.prototype.indexOf()`
```js
function unique(_arr) {
  return _arr.filter((item, index, array) => (array.indexOf(item) === index))
}
unique(arr); // [1, 2, 5, 3, 4, 9, 7]
```

- 通过 `Array.prototype.reduce()` 和 `Array.prototype.includes()`
```js
function unique(_arr) {
  return _arr.reduce((result, item) => {
    return result.includes(item) ? result : [...result, item];
  }, [])
}
unique(arr); // [1, 2, 5, 3, 4, 9, 7]
```

---

## 对象数组去重
```js
const objArr = [
  {id: 1, name: '小米'},
  {id: 2, name: '小米2'},
  {id: 5, name: '小东'},
  {id: 2, name: '小米2'},
  {id: 1, name: '小米'},
  {id: 8, name: '小红'},
  {id: 10, name: '小西'},
  {id: 12, name: '小明'},
  {id: 8, name: '小红'}
]
```

- 通过 `Array.prototype.reduce()`
```js
Array.prototype.uniqueArr = function (key) {
  if (!Array.isArray(this)) return;
  let temp = {};
  return this.reduce((result, next) => {
    temp[next[key]] ? '' : (temp[next[key]] = true) && result.push(next);
    return result;
  }, [])
}
objArr.uniqueArr("id");
```

- 通过 `Array.prototype.filter()` 和 `Set()`/`Map()`
```js
Array.prototype.uniqueArr = function (key) {
  if (!Array.isArray(this)) return;
  let set = new Set();
  return this.filter(item => {
    return !set.has(item[key]) && set.add(item[key]);
  })
  // let map = new Map();
  // return this.filter(item=>{
  //   return !map.has(item[key]) && map.set(item[key], 1);
  // })
}
objArr.uniqueArr("id");
```

---

## 数组扁平化
:::tip 注意
`Array.prototype.join()` 和 `Array.prototype.toString()` 都可以将多维数组转成普通字符串。
:::

```js
let arr = [1, [2, 3], [4, 5]];
arr.join(); // '1,2,3,4,5'
arr.toString();  // '1,2,3,4,5'
```

- 通过 `Array.prototype.concat()` 和 扩展运算符
```js
let arr = [1, [2, 3], [4, 5]];
[].concat(...arr);
// [1, 2, 3, 4, 5]
```

- 通过 `Array.prototype.join()`/`Array.prototype.toString()` 和 `String.prototype.split() `
```js
let arr = [1, [2, 3], [4, 5], [6, [7, 8, [9, 10]]]];
arr.join().split(",").map(Number);
arr.toString().split(",").map(Number);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

- 通过` Array.prototype.flat()`
```js
let arr = [1, [2, 3], [4, 5], [6, [7, 8, [9, 10]]]];
arr.flat(); // [1, 2, 3, 4, 5, 6, [7, 8, [9, 10]]]
arr.flat(2); // [1, 2, 3, 4, 5, 6, 7, 8, [9, 10]]
arr.flat(Infinity); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

- 通过 `Array.prototype.reduce()`
```js
let arr = [1, [2, 3], [4, 5], [6, [7, 8, [9, 10]]]];
function flatten(_arr) {
  return _arr.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}
flatten(arr);  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```
> 参考资料：[数组扁平化](https://zhuanlan.zhihu.com/p/344241682)、[Array.prototype.flat()](https://mdn.io/zh/Array.prototype.flat())
