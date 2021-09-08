# CirnoStream
[![npm](https://img.shields.io/npm/v/cirnostream.svg )](https://www.npmjs.com/package/cirnostream)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://raw.githubusercontent.com/Cirnotsuki/cirnostream/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/cirnostream.svg)](https://www.npmjs.com/package/cirnostream)
[![GitHub stars](https://img.shields.io/github/stars/cirnotsuki/cirnostream.svg?style=social&label=Stars&style=for-the-badge)](https://github.com/cirnotsuki/cirnostream/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/cirnotsuki/cirnostream.svg?style=social&label=Fork&style=for-the-badge)](https://github.com/cirnotsuki/cirnostream/network)
[![Code Size](https://img.shields.io/github/languages/code-size/cirnotsuki/cirnostream)](https://github.com/Cirnotsuki/cirnostream)

**CirnoStream** is a JavaScript event stream trigger, it can execute the function of Event periodically, and easy to manage those Event in **Trigger Map**.

The code form of **CirnoStream** is very close to setInterval and setTimeout, but more concise. 

You can create a **css animation** in a simple way instead of **setTimeout nest setTimeout**. You can also set a periodic event and not to be worried about forgot **clearInterval**.

**CirnoStream** can help you manage those interval tasks without use more and more setTimeout or setInterval that can save lot of Browser resource.

Explore more, please to see the [DEMO](https://github.com/Cirnotsuki/cirnostream/blob/main/demo/index.js), expecting you find out more usages.
```
The document is poorly written and you are welcome to refine your documentation in the process of using it to better help others.
```

# Install
First make sure you have installed the latest version of node.js (You may need to restart your computer after this step).
```
npm install cirnostream
```
## Demo Usage
Please pull the repository from [Github](https://github.com/Cirnotsuki/cirnostream), npm version does not contain entire files.
```
npm install

npm run dev
```
# Usage
## IN Node
```javascript
import CirnoStream from 'cirnostream';
// This is The deault delay of CirnoStream
const DefaultDelay = 1000;
// Get Stream Constructor
const { Stream } = CirnoStream;
// Create CirnoStream Commonly
const stream = new Stream(DefaultDelay);
// Via CirnoStream's create function
const stream = CirnoStream.create(DefaultDelay);
```
## In Vue
```javascript
// Use CirnoStream in Vue's entry file, usually locate in "./src/main./js"
Vue.use(CirnoStream);
// in Vue components, try it.
this.$stream.push(() => { console.log('Awsome! it works in Vue!'); });
```
## IN Brower
```html
<script src="https://cdn.jsdelivr.net/npm/cirnostream@1.0.5/build/cirnostream.min.js"></script>
<script>
    var stream = new CirnoStream();
    ...
</script>
```
## Quick Start
```javascript
// It's just like a 1000ms Timeout
stream.push(function (event) {
    ...
}, 1000);

// It's just like a 1000ms Interval
stream.push(function (event) {
    ...
}, 1000, true);

// function in list willbe executed one by one per 1000ms
stream.push([
    function A(event) { ... },
    function B(event) { ... },
    function C(event) { ... },
], 1000);
```
## Advance
You can also use an object as options to add new Event. [[see event options properties]](#push-options-properties)
```javascript
stream.push({
    name: 'AwsomeEvent',
    handler: function (item) {
        // your awsome code...
    },
    delay: 1000,
})
```

# API Document
## Stream Methods
|   Method name   |   Parameters            |   Description    |
|   ----    |   ----            |   ----    |
| on        | eventName: String | Execute the handler of Event obtained from the eventName of parameters  |
| getEvent  | eventName: String | Return a modified Event, be ware it is not equal to the Event in CirnoStream |
| delete    | eventName: String | Delete the specified Event of the Stream, that will no longer trigger in the loop  |
| start     | delay: Number     | Start the loop of Stream, usually use this method after *pause* or *close*, it will start in a new delay where if has a *delay* parameter |
| pause     | Number: delay     | Pause the loop of Stream, it will be auto resume if has a *delay* parameter, return a new Promise |
| resume    |                   | Resume the loop of Stream, only can it functional after method *pause* |
| close     |                   | Close Stream, it will clean all of Events, and clear current Timeount |
| changeDelay  | eventName: String , delay: Number | Change the delay value of the specified Event |
| push | [Push Parameters](#push-parameters) | Add an Event to the Stream, handler in that will be executed according to delay |

## Push Parameters
|  Parameter     | type              | Default  | Description |
|  ----      | ----              | ----    | ---- |
| options    | Object, Function, Array      | | [Explore properties of options](#push-options-properties)
| delay      | Number            | 1000ms  | Decide the trigger delay of this Event |
| eventName  | String, Boolean |          | Assign to parameter: isLoopEvent in the case of param type is Boolean otherwise as the name of Event|
| isLoopEvent  | Boolean           |          | Event will be triggered continuously when this parameter is true|

**returnValue(String)** Method push will return the name of Event which is defined manually or generated by uuid.v4


## Push Options Properties
**If handler is null or eventList is empty, Push Method will be refused to execute**

|  propertie    | type      |default| Description |
|  ----     | ----      | :----:  | ---- |
| name      | String    | uuid.v4() | As the key to retrieve Event in **Trigger Map**, should not duplicate define, it will auto generate an UUID in the case of empty or undefined
| repeat    | Number    | 1     | Define the number of executions of Event, it will continue to execute when this property is 0 |
| delay     | Number    | 1000  | Define the execution interval of the event, it will restricted by the **delay** of **Stream** |
| onProcess | Boolean   | false | Stop Event triggering when this property is true, usually defined for those function that consumed massive time |
| created   | Function  | null | This function will be executed after Event has been initialized and added to the **Trigger Map** |
| onclose   | Function  | null | This function will be executed after the remaining times run out or manually closed  |
| handler   | Function  | null | This is the function of Event that will be executed regularly according to the delay  |
| eventList | Array     | []    | An Array of functions those will give priority to execution as handler, it will define the value of property repeat when handler is undefined or repeat is 0|

## Callback of Event
Event will call back a modified **Object** after handler, created or onclose function executed
**It it meaningless to change the property of this Object, because of that is not equal to the original Event**

|  propertie    | type     | Description |
|  ----     | ----     | ---- |
| name      | String   | Name of Event |
| type      | String   | Type of Event, contains "execute", "created", "closed", "forced" and "get", [see where those type from](#type-of-modified-event) |
| isLoopEvent | Boolean  | Shows whether the event will trigger continually |
| remain    | Number   | The remain number of executions of Event |
| runtime   | Number   | The number of times the event has been triggered |
| createTime| Number   | The create time after Event add to Stream, it will be refreshed when triggered |
| close     | Function | Manually close the event and destroy the event in the **Trigger Map** at the same time |
| freeze    | Function | Stop triggering the corresponding Event until "release" |
| release   | Function | Resume triggering the corresponding Event |

*About "freeze" and "release"*
```javascript
// Suppose I have a time consuming task to wait, and I do not know the time of finish
stream.push(async (event) => {
    // Event will not to be triggered until release executed
    event.freeze();
    // this task perhaps consuming 5000ms or more
    await ComplicatedTask();
    // Event will be triggered in the next period
    event.release();
}, 1000, true)
```

## Type of Modified Event

* execute: from handler of Event or functions of eventList.
* created: from function "created" of Event
* closed:  from function "onclose" of Event
* forced:  from method "on" of Stream, this method will execute handler of specific Event Compulsorily and dose not decrease the Number of Remain.
* get:     from method "getEvent" of Stream
