import Stream from "./modules/stream";

const CirnoStream = {
  Stream,
  install(Vue, delay) {
    // Format argument delay to number type.
    const StreamDelay = typeof delay === "number" ? delay : 1000;
    // Use CirnoStream as $stream in Vue;
    Vue.prototype.$stream = new Stream(
      Number.isNaN(StreamDelay) ? 1000 : StreamDelay
    );
  },
};
export default CirnoStream;
