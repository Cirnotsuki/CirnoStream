import CallbackEvent from "../formaters/callbackEvent";

export default function StreamExcution(event, stream) {
  // 上一次事件还没执行完毕时不执行本次事件
  if (event.onProccess) return;

  // 判断该事件是否在可执行时期
  if ((stream.runTime - event.createTime) * stream.delay >= event.delay) {
    const listLen = event.eventList.length;
    // 获取事件方法，优先从事件列表中获取
    const handler = listLen > 0 ? event.eventList.shift() : event.handler;

    // 循环事件则将取出的方法压回栈头
    if (event.isLoopEvent && listLen > 0 && handler) {
      event.eventList.push(handler);
    }

    // 当该事件是持续执行或者该事件还有剩余执行次数时执行事件
    if (
      (event.isLoopEvent || event.remain > 0) &&
      typeof handler === "function"
    ) {
      try {
        handler(CallbackEvent(event.data, "excute"));
      } catch (error) {
        console.error(error);
      }
    }

    // 更新事件时间
    event.refresh(event);
    // 减少事件执行的剩余次数
    !event.isLoopEvent && event.decrease(event);
  }
}
