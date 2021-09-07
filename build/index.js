import CirnoStream from './cirnostream';

export default {
    Stream: CirnoStream,
    install(Vue, delay) {
        const formatDelay = Number(delay);
        Vue.prototype.$stream = new CirnoStream(Number.isNaN(formatDelay) ? 1000 : Math.max(0, formatDelay));
    },
    create(delay) {
        const formatDelay = Number(delay);
        return (new CirnoStream(Number.isNaN(formatDelay) ? 1000 : Math.max(0, formatDelay)));
    },
};
