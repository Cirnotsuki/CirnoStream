/* eslint-disable max-len */
import CirnoStream from '../build';

const stream = new CirnoStream(500);

const monitor = document.getElementById('monitor');
const root = document.getElementById('root');

// this is a continually event for update Stream's infomation
stream.push(() => {
    monitor.innerHTML = `StreamMonitor:\tDelay: ${stream.delay}ms\tRuntimes: ${stream.runTime}\tDuring ${stream.runTime * stream.delay}ms`;
}, 500, true);

// function in list will be excuted one by one per 1000ms and remove automatically when all has been excuted.
stream.push([
    () => {
        root.innerHTML += `<div>Runtime: ${stream.runTime} \tExcuted by EventList 01</div>`;
    },
    () => {
        root.innerHTML += `<div>Runtime: ${stream.runTime} \tExcuted by EventList 02</div>`;
    },
    () => {
        root.innerHTML += `<div>Runtime: ${stream.runTime} \tExcuted by EventList 03</div>`;
    },
]);

// function will excute after 2000ms
stream.push({
    name: '2000 Delay Event',
    handler(event) {
        root.innerHTML += `<div>Runtime: ${stream.runTime} \tEventName: ${event.name} \tExcute Delay: 2000ms</div>`;
    },
}, 2000);

// event will push into taskList after 3000ms timeout, and its handler will excute 3 times.
setTimeout(() => {
    stream.push({
        name: 'Timeout',
        repeat: 3,
        created(event) {
            root.innerHTML += `<div>Runtime: ${stream.runTime} \tEventName: ${event.name} \tCreate after 3000ms Timeout, and repeat 3 times</div>`;
        },
        handler(event) {
            root.innerHTML += `<div>Runtime: ${stream.runTime} \tEventName: ${event.name} \tExcute Delay: 2000ms \t RemainTimes: ${event.remainTimes - 1}</div>`;
        },
        onclose(event) {
            root.innerHTML += `<div>Runtime: ${stream.runTime} \tEventName: ${event.name} \tAutoremove When all Excuted</div>`;
        },
    }, 2000);
}, 3000);

// when handler contain a complicated async function, use freeze and release to control this event;
function ComplexTask(callback) {
    setTimeout(callback, 3000);
}
stream.push((event) => {
    // stop trigger event until tasks have been done
    event.freeze();
    // start the task that consuming massive time
    ComplexTask(() => {
        root.innerHTML += `<div>Runtime: ${stream.runTime}\tConsuming 3000ms to complete this task, this event will not to be trigger until it has been done</div>`;
        // resume triggering event after task finished.
        event.release();
    });
}, 500, true);

// it can also work with Promise
function promiseFn() {
    return new Promise(resolve => {
        stream.push(resolve, 5000);
    });
}
promiseFn().then(event => {
    root.innerHTML += `<div>Runtime: ${stream.runTime} \tEventName: ${event.name} \tPromise Fulfilled</div>`;
});

// easy to generate a css animation
const div = document.createElement('div');
div.style.cssText = 'width: 100px; height: 100px; position: fixed; background-color: red; top: 0; left: 0; transition: all 0.5s;';
document.body.appendChild(div);
stream.push([
    () => { div.style.left = '500px'; },
    () => { div.style.top = '500px'; },
    () => { div.style.top = '0px'; },
    null,
    () => {
        div.style.left = '600px';
        div.style.top = '600px';
    },
    null,
    () => {
        div.style.left = '800px';
        div.style.top = '0px';
    },
], 500);
