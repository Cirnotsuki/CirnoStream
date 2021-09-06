import FormatAttrs from "../formaters/attributes";
import CallbackEvent from "../formaters/callbackEvent";

import StreamExcution from "../funcs/excution";
import StreamTimer from "../funcs/timer";

import StreamEvent from "./event";

class Stream {
  #timer;

  #eventMap;

  #get;

  #proccess;

  #proccessID;

  constructor(delay = 500) {
    // 初始化延时
    this.delay = delay;
    // 初始化进程中断变量
    this.stopProccess = false;
    // 初始化事件列表
    this.#eventMap = new Map();
    // initialize stream timer
    this.#timer = new StreamTimer();
    // 初始化私有变量
    this.#initPrivateFunctions();
    // 开始进程
    this.start();
  }

  // 获取当前运行次数
  get runTime() {
    return this.#timer.counter;
  }

  // 初始化私有方法
  #initPrivateFunctions() {
    const StreamProcess = () => {
      // 创建延时线程
      this.#proccessID = setTimeout(() => {
        // 当线程暂停时阻止程序执行
        if (this.stopProccess) return;
        // 执行计数
        this.#timer.count();
        // 遍历所有事件
        for (const [name, event] of this.#eventMap.entries()) {
          // 事件存在时才执行事件,否则在列表中销毁事件,减少下一次迭代
          event ? StreamExcution(event, this) : this.delete(name);
        }
        // 递归到下一个进程
        StreamProcess();
      }, this.delay);
    };

    this.#proccess = StreamProcess;
    this.#get = (eventName) => this.#eventMap.get(eventName);
  }

  changeDelay(name, delay) {
    const event = this.#get(name);
    if (event) {
      event.delay = delay;
    }
  }

  getEvent(name) {
    return CallbackEvent(this.#eventMap.#get(name), "get");
  }

  delete(name) {
    const event = this.#get(name);
    if (!event) return;
    if (event && typeof event.onclose === "function") {
      event.onclose(event);
      event.onclose = null;
    }
    return this.#eventMap.delete(name);
  }

  on(name) {
    const event = this.#get(name);
    if (!event) return;
    // 获取事件方法，优先从事件列表中获取
    const handler = event.eventList[0] || event.handler;
    // 使用 on 方法时强制执行该事件
    typeof handler === "function" && handler(CallbackEvent(event, "forced"));
  }

  // 开始进程
  start(delay) {
    // 当传入了一个数值参数的时候可以重新设定进程间隔
    if (typeof delay === "number") {
      this.delay = delay;
    }
    this.stopProccess = false;
    this.#proccess();
  }

  // 暂停进程
  pause(delay = 0) {
    this.stopProccess = true;
    // 设定了时间的情况下进程会自动恢复，自动恢复之后会返回当前时间戳
    return new Promise((resolve) => {
      Number(delay) > 0
        ? setTimeout(() => {
            this.resume();
            resolve(+new Date());
          }, delay)
        : resolve();
    });
  }

  // 恢复进程
  resume(delay) {
    // 事件流被暂停的情况下才能进行恢复
    this.stopProccess && this.start(delay);
  }

  // 关闭进程
  close() {
    clearTimeout(this.#proccessID);
    // 停止事件
    this.stopProccess = true;
    // 清空事件列表
    this.#eventMap.clear();
  }

  push(opt, delay, eventName, isLoopEvent) {
    try {
      // format StreamEvent's Atribute
      const options = FormatAttrs(
        opt,
        delay,
        eventName,
        isLoopEvent,
        this.runTime
      );

      console.log(options);

      // create StreamEvent
      const event = new StreamEvent(this, options);

      // add StreamEvent in Stream Trigger Hash Map
      this.#eventMap.set(event.name, event);

      // trigger created function if exist
      if (typeof event.created === "function") {
        event.created(CallbackEvent(event, "created"));
        event.created = null;
      }

      return event.name;
    } catch (error) {
      console.error(error);
    }
  }
}
export default Stream;
