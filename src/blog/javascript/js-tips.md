# JS 实用小技巧

## MDN 快速搜索
- 浏览器地址栏输入：`mdn.io`
- [http://mdn.io/for...of](http://mdn.io/for...of)
- [http://mdn.io/array](http://mdn.io/array)
- [http://mdn.io/zh/array](http://mdn.io/zh/array)
## 字符串转数组
```js
let str = "asdfghjkl";

str.split(''); //  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
Array.from(str); //  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
[...str]; //  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
Array.of(...str); //  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
Object.values(str); // ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
```
## 数组转字符串
```js
let arr = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];

arr.join(''); // 'asdfghjkl'
''.concat(...arr); // 'asdfghjkl'
arr.toString(); // 'a,s,d,f,g,h,j,k,l'
arr.toLocaleString(); // 'a,s,d,f,g,h,j,k,l'
arr + []; // 'a,s,d,f,g,h,j,k,l'
arr + ''; // 'a,s,d,f,g,h,j,k,l'
```
```js
// 拓展：join() 和 toString() 都可以将多维数组转成普通字符串。
let arr = [1, [2, 3], [4, 5]];
arr.join(); // '1,2,3,4,5'
arr.toString();  // '1,2,3,4,5'
```
## Array.prototype.map()
```js {3,7,11}
// 字符串数组转换为数值型数组
let arr = [1, 2, 3];
arr.map(String); // ['1', '2', '3']

// 数值数组转换为字符串型数组
let arr = ['1', '2', '3'];
arr.map(Number); // [1, 2, 3]

// 数值型数组转换为布尔值
let arr = [0, 1, 1, 1, 0];
arr.map(Boolean); // [false, true, true, true, false]

// 混合类型转换对比
let arr = [1, 0, '1', '-1', '0', true, false, 'true', 'false', null, undefined, NaN, ''];
arr.map(String);
// ['1', '0', '1', '-1', '0', 'true', 'false', 'true', 'false', 'null', 'undefined', 'NaN', '']
arr.map(Number);
// [1, 0, 1, -1, 0, 1, 0, NaN, NaN, 0, NaN, NaN, 0]
arr.map(Boolean);
// [true, false, true, true, true, true, false, true, true, false, false, false, false]
```
## Array.prototype.filter()
```js
// 移除所有的 “false” 类型元素（false, null, undefined, 0, NaN, an empty string）
let arr = [1, 0, false, 'true', {}, null, undefined, NaN, '', , 'false'];
arr.filter(Boolean); // [1, 'true', {}, 'false']
```
## JSON.parse()
```js {1,2}
JSON.parse('true'); // true
JSON.parse('false'); // false
JSON.parse(true); // true
JSON.parse(false); // false
```
## JSON.stringify()
```js {10,11}
const obj = {
  a: 1,
  b: [
    {
      a: 2,
    },
  ],
};

console.log(JSON.stringify(obj, ["b"], 2));  // 过滤
console.log(JSON.stringify(obj, null, 2));

// node 环境
console.dir(obj, {
  showHidden: false,
  depth: 99,
  colors: true,
});
```
## 模板字符串嵌套
```js
const a = 20, b = 30, c = '三', d = '日';
const res = `今天星期${Math.random() > 0.5 ? `${c}` : `${d}`}，签到人数${Math.random() > 0.5 ? `${a}` : `${b}`}人`;
console.log(res);
```
## 多属性字符串拼接
```js
// 借助 Object.values()
const obj = {
  a: 'vue',
  b: '',
  c: 'router',
  d: 'react',
  e: '',
  f: 'redux',
};
Object.values(obj).filter(Boolean).join('-');
// 'vue-router-react-redux'
```
## 给方法传一个空参数
```js
method(...['parameter1', , 'parameter3']);
```
## 对象数组过滤出指定属性
```js
const foo = [
  { id: 1 } ,
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 }
];

foo.map(i => i.id); // [1, 2, 3, 4, 5]
```
```js
const foo = [
  {
    id: 1,
    children: [
      { id: 1 },
      { id: 2 },
    ]
  },
  {
    id: 2,
    children: [
      { id: 3 },
      { id: 4 },
    ]
  }
]

foo.flatMap(i => i.children.map(i => i.id)); // [1, 2, 3, 4]
```
## 对象过滤掉指定参数
```js
const obj = {
  id: '1',
  name: 'tom',
  age: 12,
}
const { id, ...rest } = obj;
console.log(rest); // { name: 'tom', age: 12 }
```
## 数据类型判断

- [typeof](https://mdn.io/zh/typeof)
- [**instanceof**](https://mdn.io/zh/instanceof)
- [Object.prototype.toString()](https://mdn.io/zh/Object.prototype.toString())
  - 返回的数据格式为 [object Object] 类型，可通过这一特点进行任意类型判断。
```js
// 任意数据类型判断
function typeJudgment(variable) {
  return Object.prototype.toString.call(variable).slice(8, -1);
}

typeJudgment()   		// 'Undefined'
typeJudgment(null) 	// 'Null'
typeJudgment(true)  // 'Boolean'
typeJudgment('') 		// 'String'
typeJudgment(1)  		// 'Number'
typeJudgment({}) 		// 'Object'
typeJudgment([]) 		// 'Array'
typeJudgment(function(){}) // 'Function'
typeJudgment(new Date())   // 'Date'
typeJudgment(/a/)		// 'RegExp'
typeJudgment(BigInt(1))		// 'BigInt'
typeJudgment(Symbol(1))		// 'Symbol'
```
## async/await 异常捕获
```js
(async () => {
  // promise 返回值
  const fetchData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("success");
      });
    });
  };
  // 抽离公共方法
  const awaitWrap = (promise) => {
    return promise.then((data) => [null, data]).catch((err) => [err, null]);
  };

  const [err, data] = await awaitWrap(fetchData());
  console.log(err, data);
})();
```
> 参考资料：[async/await 优雅的错误处理方法 - 掘金](https://juejin.cn/post/6844903767129718791#comment)
