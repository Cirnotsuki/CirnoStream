import CirnoStream from "./cirnostream";

const { Stream } = CirnoStream;

const stream = new Stream();

console.log(stream);

stream.push([
  () => {
    console.log(3);
  },
  () => {
    console.log(2);
  },
  () => {
    console.log(1);
  },
]);

stream.push({
  handler(item) {
    console.log(item);
  },
});
