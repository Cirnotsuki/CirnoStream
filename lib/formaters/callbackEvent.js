export default function CallbackEvent(event, type) {
    // copy StreamEvent's attributes and set event type.
    event.type = type;
    // remove uneditable attributes
    delete event.decrease;
    delete event.refresh;
    delete event.created;
    delete event.onclose;
    delete event.handler;
    delete event.eventList;

    return event;
}
