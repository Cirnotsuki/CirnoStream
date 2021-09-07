import FormatAttrs from '../formaters/attributes';
import CallbackEvent from '../formaters/callbackEvent';

import StreamExcution from '../funcs/excution';
import StreamTimer from '../funcs/timer';

import StreamEvent from './event';

class CirnoStream {
  #timer;

  #eventMap;

  #get;

  #proccess;

  #proccessID;

  constructor(delay = 500) {
      this.delay = delay;
      this.stopProccess = false;
      this.#eventMap = new Map();
      this.#timer = new StreamTimer();
      this.#initPrivateFunctions();
      this.start();
  }

  get runTime() {
      return this.#timer.counter;
  }

  #initPrivateFunctions() {
      const StreamProcess = () => {
          this.#proccessID = setTimeout(() => {
              if (this.stopProccess) return;
              this.#timer.count();
              for (const [name, event] of this.#eventMap.entries()) {
                  event ? StreamExcution(event, this) : this.delete(name);
              }
              StreamProcess();
          }, this.delay);
      };

      this.#proccess = StreamProcess;
      this.#get = (eventName) => this.#eventMap.get(eventName) || {};
  }

  changeDelay(name, delay) {
      const event = this.#get(name);
      if (event) {
          event.delay = delay;
      }
  }

  getEvent(name) {
      return CallbackEvent(this.#eventMap.#get(name).data, 'get');
  }

  delete(name) {
      const event = this.#get(name);
      if (!event) return;
      if (event && typeof event.onclose === 'function') {
          event.onclose(event);
          event.onclose = null;
      }
      return this.#eventMap.delete(name);
  }

  on(name) {
      const event = this.#get(name);
      if (!event) return;
      const handler = event.eventList[0] || event.handler;
      typeof handler === 'function'
      && handler(CallbackEvent(event, 'forced'));
  }

  // 开始进程
  start(delay) {
      if (typeof delay === 'number') {
          this.delay = delay;
      }
      this.stopProccess = false;
      this.#proccess();
  }

  // 暂停进程
  pause(delay = 0) {
      this.stopProccess = true;
      return new Promise((resolve) => {
          Number(delay) > 0
              ? setTimeout(() => {
                  this.resume();
                  resolve(+new Date());
              }, delay)
              : resolve();
      });
  }

  resume(delay) {
      this.stopProccess && this.start(delay);
  }

  close() {
      clearTimeout(this.#proccessID);
      this.stopProccess = true;
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
              this.runTime,
          );

          // create StreamEvent
          const event = new StreamEvent(this, options);

          // add StreamEvent in Stream Trigger Hash Map
          this.#eventMap.set(event.name, event);

          // trigger created function if exist
          if (typeof event.created === 'function') {
              event.created(CallbackEvent(event, 'created'));
              event.created = null;
          }

          return event.name;
      } catch (error) {
          console.error(error);
      }
  }
}
export default CirnoStream;
