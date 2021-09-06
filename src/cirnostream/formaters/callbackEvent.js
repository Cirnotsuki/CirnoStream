export default function FormatCallbackEvent(event, type) {
  // copy StreamEvent's attributes and set event type.
  const FormatEvent = { ...event, type };
  // remove uneditable attributes
  delete FormatEvent.decrease;
  delete FormatEvent.refresh;
  delete FormatEvent.created;
  delete FormatEvent.onclose;
  delete FormatEvent.handler;
  delete FormatEvent.eventList;

  return FormatEvent;
}
