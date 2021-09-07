import CallbackEvent from '../formaters/callbackEvent';

export default function StreamExcution(event, stream) {
    // prevent excution when onProccess is true that mean previous StreamEvent's excution unfinished.
    if (event.onProccess) return;

    // judge if StreamEvent is on Trigger time.
    if ((stream.runTime - event.createTime) * stream.delay >= event.delay) {
        const listLen = event.eventList.length;
        // get Event Handler, get first from eventList.
        const handler = listLen > 0 ? event.eventList.shift() : event.handler;

        // push handler back to eventList when is continually event
        if (event.isLoopEvent && listLen > 0 && handler) {
            event.eventList.push(handler);
        }

        // exucte handler when StreamEvent is continually event or it still has excuttion times.
        if ((event.isLoopEvent || event.remain > 0) && typeof handler === 'function') {
            try {
                handler(CallbackEvent(event, 'excute'));
            } catch (error) {
                console.error(error);
            }
        }

        // update event timeStamp
        event.refresh(event);
        // decrease StreamEvent Remaining executions
        !event.isLoopEvent && event.decrease(event);
    }
}
