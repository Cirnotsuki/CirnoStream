[![npm](https://img.shields.io/npm/v/cirnostream.svg )](https://www.npmjs.com/package/cirnostream)
[![npm](https://img.shields.io/npm/dt/cirnostream.svg)](https://www.npmjs.com/package/cirnostream)
[![GitHub stars](https://img.shields.io/github/stars/cirnotsuki/cirnostream.svg?style=social&label=Stars&style=for-the-badge)](https://github.com/cirnotsuki/cirnostream/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/cirnotsuki/cirnostream.svg?style=social&label=Fork&style=for-the-badge)](https://github.com/cirnotsuki/cirnostream/network)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

`
The document is poorly written and you are welcome to refine your documentation in the process of using it to better help others.
`
# Install
First make sure you have installed the latest version of node.js (You may need to restart your computer after this step).
```
npm install cirnostream
```
# Usage
## Node Environment
```javascript
import CirnoStream from 'cirnostream';
// get the Constructor
const { Stream } = CirnoStream;
// this is The deault delay of CirnoStream
const DefaultDelay = 1000;
// Create Normally
const stream = new Stream(DefaultDelay);
// By CirnoStream's create function
const stream = CirnoStream.create(DefaultDelay);
// create in Vue's main.js
Vue.use(CirnoStream);
// in Vue components, try it.
this.$stream.push(() => { console.log('Awsome! it works in Vue!'); });
```
## Brower Environment
```html
<script src="https://raw.githubusercontent.com/Cirnotsuki/cirnostream/main/build/cirnostream.min.js"></script>
```

* **Stream** 方法
|   方法名   |   参数            |   描述    |
|   ----    |   ----            |   ----    |
| on        | String: eventName | 执行指定事件内的方法，通过这种方式执行的事件并不会引发事件计数 |
| get       | String: eventName | 获取指定事件，返回事件的对象 |
| delete    | String: eventName | 删除指定事件，将事件从事件流中去除。 |
| start     | Number: delay     | 事件流结束或暂停之后重新启动事件流，如果传入了参数则作为重启后的事件流的执行间隔。 |
| pause     | Number: delay     | 用于暂停事件流，传入参数后将在一定时间后自动重启事件流。事件恢复时会回调当前时间戳。 |
| resume    | Number: delay     | 恢复事件流，只有当事件流处于停止状态该方法才会生效 |
| close     |                   | 关闭事件流，该方法会清空事件流中所有的事件，并结束事件流当前的 Timeout 事件。|
| changeDelay  | String: eventName, Number: delay | 改变指定事件的执行间隔。|
| push      | 见下方描述       | 向事件流中添加事件，会按照该事件规定的延迟执行事件中设定的方法。 |

* **Stream.push** 方法参数
|  参数名     | 类型              | 默认值  | 描述 |
|  ----      | ----              | ----    | ---- |
| opt        | 见下方描述         | 见下方描述| 见下方描述。
| delay      | Number            | 1000ms  | 每次调用事件方法的间隔 |
| eventName  | String 或 Boolean |          | 传入字符串时则作为该事件的名称，为布尔值时则作为参数keepGoing 的值|
| keepGoing  | Boolean           |          | 传入值为 true 时，该事件会按照设置的间隔不断执行，直到手动清除该事件为止。|
| returnValue| String            |          | 执行该方法后将会返回插入的事件名称。 |

* **opt 传入值为对象时，参数属性见下方描述；传入值为方法时，则将传入的方法作为事件的方法调用；传入值为列表时，传入的值将作为事件的 EventList**

* **Stream.push(opt)** 对象参数
|  参数名    | 类型      | 默认值 | 描述 |
|  ----     | ----      | ----  | ---- |
| repeat    | Number    | 1     | 事件的重复次数，设为 0 时则事件会重复进行，stream.push 参数 keepGoing 为 true 时将强制重复执行事件|
| delay     | Number    | 1000  | 事件的执行间隔，事件的执行间隔将不会大于事件流的执行间隔。|
| onProcess | Boolean   | false | 用于耗时较久的事件，该变量需手动设置，为 true 时即使事件处于触发期也不会触发事件。|
| created   | Function  |       | 如果设定了该方法，将在事件对象创建完毕之后触发 |
| handler   | Function  |       | 事件要执行的方法，执行方法时将回调事件本身作为参数。|
| onclose   | Function  |       | 当通过 stream.delete 或 event.close 方法销毁事件，将会执行设定中的 onclose 方法，回调事件本身作为参数。|
| eventList | Array     | []    | 由 Function 组成的列表，所有项将会被格式化为可执行方法，事件触发时将优先执行该列表内的方法。|

* created, handler 和 onclose 执行时将回调事件对象的部分只读属性
|  参数名    | 类型     | 描述 |
|  ----     | ----     | ---- |
| name      | String   | 事件的名称，eventName 有传入字符串时则使用该值，否则则使用自定义的值，为空时创建一个GUID |
| type      | String   | 描述回调事件的类型，一般搭配 Switch Case 使用 |
| remain    | Number   | 事件的剩余执行次数，该值为 0 且事件不在事件流中重复执行时则自动销毁事件 |
| runtime   | Number   | 事件在事件流中执行过的次数，一般搭配 event.close 方法使用 |
| keepGoing | Boolean  | 为 true 时事件将在事件流中重复触发。 |
| createTime| Number   | 事件在事件流中的插入时间，用来比对事件是否处于触发期，事件触发后将刷新该值。 |
| close     | Function | 在事件流中销毁该事件，回调 onclose 方法。|
| freeze    | Function | 暂停事件在事件流中的触发，设置事件对象属性 onProcess 为 true |
| release     | Function | 恢复事件在事件流中的触发，设置事件对象属性 onProcess 为 false |

* 引用方式
```javascript
import CirnoStream from 'cirnostream';
// get the Constructor
const { Stream } = CirnoStream;
// this is The deault delay of CirnoStream
const DefaultDelay = 1000;
// Create Normally
const stream = new Stream(DefaultDelay);
// By CirnoStream's create function
const stream = CirnoStream.create(DefaultDelay);
// create in Vue's main.js
Vue.use(CirnoStream);
// use as an Vue global variable.
this.$stream
// 参数定义
stream.push(Object|Function|Array: opt, Number: delay = 1000, String|Boolean: eventName, Boolean: keepGoing);
// 对象参数设置
opt = { 
    name: { type: String, default: uuid.v4() },,
    repeat: { type: Number, default: 1000 },
    delay: { type: Number, default: 1000 },
    eventList:  { type: Array, default: () => [] },,
    handler: null,
    onclose: null,
}
```
* 事件的快捷使用方法如下，事件如果未设定重复执行，将在执行完毕后自动销毁。
```javascript
// 添加一个默认 1000ms 延时的方法
stream.push(() => { dosth });
// 添加一个默认 1000ms 间隔重复执行的方法
stream.push(() => { dosth }, true);
// 添加一个 2000ms 延时的方法
stream.push(() => { dosth }, 2000);
// 添加一个以 2000ms 间隔重复执行的方法
stream.push(() => { dosth }, 2000, true);
// 添加一个以 EventAlpha 为事件名， 2000ms 间隔重复执行的方法
stream.push(() => { dosth }, 2000, 'EventAlpha', true);
// 添加一个事件列表，以 2000ms 为延时按顺序执行列表中的事件。
stream.push([
    () => { doA },
    () => { doB },
    () => { doC },
], 2000, 'ListedEvent');
```
* 以参数对象的方式添加事件
```javascript
// 添加一个名为 "EventObject" 并以 2000ms 间隔执行 3 次的事件
stream.push({
    name: 'EventObject',
    repeat: 3,
    delay: 2000,
    created: (event) => { dosth },
    onclose: (event) => { dosth },
    handler: (event) => { dosth },
});
```
* 事件流操作方法
```javascript
// 手动执行对应事件的方法
stream.on(String: eventName);
// 输入参数名返回对应的原始参数事件, 修改该对象内的属性会可能导致不可预料的后果。
stream.get(String: eventName);
// 从事件流中删除指定事件, 事件删除时将会触发事件对象设置的 onclose 事件
stream.delete(String: eventName);
// 修改事件在事件流中的执行间隔
stream.changeDelay(String: eventName, Number: delay)
// 暂停事件流, 并在设定的延时后恢复, 恢复时回调当前的时间戳，没有舍得恢复时间则不会回调恢复时的时间戳
// 使用该方法时，事件流 Timeout 函数将停止回调， 事件流中的事件将全部暂停触发
stream.pause(Number: delay).then((Number: timeStamp) => { });
// 恢复事件流, 事件流被暂停或停止之后使用该事件可以恢复事件流的工作，使得事件流中的事件得以触发
// 该方法有传参时，以传入的数值作为事件流恢复后的触发间隔，如果没有传参则不修改触发间隔。
stream.resume(Number: delay);
// 该方法同上
stream.start(Number: delay);
// 结束事件, 使用该方法事件流将停止工作，同时清空事件流中的所有事件。
stream.close();
```