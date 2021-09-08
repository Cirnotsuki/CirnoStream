/* eslint-disable max-len */
import CirnoStream from '../lib';

const stream = new CirnoStream(500);

const monitor = document.getElementById('monitor');
const root = document.getElementById('root');

// this is a continually event for update Stream's infomation
let timer = +new Date();
stream.push(() => {
    monitor.innerHTML = `StreamMonitor:\tDelay: ${stream.delay}ms\tRuntimes: ${stream.runTime}\tDuring ${+new Date() - timer}ms`;
}, 500, true);

// function in list will be executed one by one per 1000ms and remove automatically when all has been executed.
stream.push([
    () => {
        root.innerHTML += `<div>Runtime: ${stream.runTime} \tExecuted by EventList 01</div>`;
    },
    () => {
        root.innerHTML += `<div>Runtime: ${stream.runTime} \tExecuted by EventList 02</div>`;
    },
    () => {
        root.innerHTML += `<div>Runtime: ${stream.runTime} \tExecuted by EventList 03</div>`;
    },
]);

// function will execute after 2000ms
stream.push({
    name: '2000 Delay Event',
    handler(event) {
        root.innerHTML += `<div>Runtime: ${stream.runTime} \tEventName: ${event.name} \tExecute Delay: 2000ms</div>`;
    },
}, 2000);

// event will push into taskList after 3000ms timeout, and its handler will execute 3 times.
setTimeout(() => {
    stream.push({
        name: 'Timeout',
        repeat: 3,
        created(event) {
            root.innerHTML += `<div>Runtime: ${stream.runTime} \tEventName: ${event.name} \tCreate after 3000ms Timeout, and repeat 3 times</div>`;
        },
        handler(event) {
            root.innerHTML += `<div>Runtime: ${stream.runTime} \tEventName: ${event.name} \tExecute Delay: 2000ms \t RemainTimes: ${event.remain - 1}</div>`;
        },
        onclose(event) {
            root.innerHTML += `<div>Runtime: ${stream.runTime} \tEventName: ${event.name} \tAutoremove When all Executed</div>`;
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
        root.innerHTML += `<div>Runtime: ${stream.runTime}\tConsuming 3000ms to complete this task, this event will not to be trigger again until it has been done</div>`;
        // resume triggering event after task finished.
        event.release();
        // you can manually stop this continually event;
        if (event.runtime >= 5) {
            event.close();
            root.innerHTML += `<div>Runtime: ${stream.runTime}\tComplexTask Stop Manually after 5 times executed</div>`;
        }
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

// if eventList length less then repeat, it will repeat until remainTimes run out.
stream.push({
    repeat: 5,
    eventList: [
        () => {
            root.innerHTML += `<div>Runtime: ${stream.runTime}\tEventList less then repeat, No.01</div>`;
        },
        () => {
            root.innerHTML += `<div>Runtime: ${stream.runTime}\tEventList less then repeat, No.02</div>`;
        },
    ],
});

// if eventList length more then repeat, it will change the repeat number to fit the length.
stream.push({
    repeat: 1,
    eventList: [
        () => {
            root.innerHTML += `<div>Runtime: ${stream.runTime}\tEventList more then repeat, No.03</div>`;
        },
        () => {
            root.innerHTML += `<div>Runtime: ${stream.runTime}\tEventList more then repeat, No.04</div>`;
        },
        () => {
            root.innerHTML += `<div>Runtime: ${stream.runTime}\tEventList more then repeat, No.05</div>`;
        },
    ],
});
