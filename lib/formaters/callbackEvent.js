export default function CallbackEvent(event, type) {
    return {
        type,
        name: event.name,
        delay: event.delay,
        onProccess: event.onProccess,
        repeat: event.repeat,
        remain: event.remain,
        createTime: event.createTime,
        runtime: event.runtime,
        isLoopEvent: event.isLoopEvent,
        close: event.close,
        freeze: event.freeze,
        release: event.release,
    };
}
