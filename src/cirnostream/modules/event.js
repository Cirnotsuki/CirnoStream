import CallbackEvent from "../formaters/callbackEvent";

class StreamEvent {
  #data;

  #stream;

  constructor(stream, data) {
    this.#stream = stream;
    this.#data = data;
    // it will be excuted when StreamEvent has been created.
    this.created = data.created;
    // it will be excuted when StreamEvent has been removed.
    this.onclose = data.onclose;
    // function in handler will be excuted when StreamEvent on its trigger-time that depends on Argument: delay.
    this.handler = data.handler;
    // function in eventList will be excuted one by one, and its priority is greater than handler.
    this.eventList = data.eventList;
  }

  set delay(val) {
    this.#data.delay = typeof val === "number" ? val : 1000;
  }

  get delay() {
    return this.#data.delay;
  }

  set onProccess(val) {
    this.#data.onProccess = val;
  }

  get onProccess() {
    return this.#data.onProccess;
  }

  // 设定只读参数
  get name() {
    return this.#data.name;
  }

  get repeat() {
    return this.#data.repeat;
  }

  get remain() {
    return this.#data.remainTimes;
  }

  get createTime() {
    return this.#data.createTime;
  }

  get runtime() {
    return this.#data.runtime;
  }

  get isLoopEvent() {
    return this.#data.isLoopEvent;
  }

  get data() {
    return { ...this.#data };
  }

  get close() {
    const event = this;
    return function EventClose() {
      // if Event has been closed and trigger the onclose function.
      if (typeof event.onclose === "function") {
        event.onclose(CallbackEvent(event, "closed"));
      }
      event.onclose = null;
      // remove event from Stream.
      event.#stream.delete(event.name);
    };
  }

  // decrease event reamainTimes.
  get decrease() {
    const event = this;
    return function EventDecrease(argEvent) {
      if (argEvent !== event)
        throw new Error("EventDecrease should not be excuted manualy.");

      event.#data.remainTimes -= 1;

      // remove event when it is not a continually event or remain excute time go to zero.
      if (!event.isLoopEvent && event.remain <= 0) {
        event.close();
      }
    };
  }

  // refresh event timeStamp
  get refresh() {
    const event = this;
    return function EvnetRefresh(argEvent) {
      if (argEvent !== event)
        throw new Error("EvnetRefresh should not be excuted manualy.");

      event.#data.runtime += 1;
      event.#data.createTime = event.#stream.runTime;

      // remove event when it run out of avaliable function
      if (!event.handler && !event.eventList.length) {
        event.close();
      }
    };
  }

  // event will stop triggering on Stream
  get freeze() {
    const event = this;
    return function FreezeEvent() {
      event.#data.onProccess = true;
    };
  }

  // event will resume triggering on Stream
  get release() {
    const event = this;
    return function ReleaseEvent() {
      event.#data.onProccess = false;
    };
  }
}

export default StreamEvent;
