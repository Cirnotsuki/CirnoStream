export default class StreamTimer {
  #count;

  constructor() {
    this.#count = 0;
  }

  get counter() {
    return this.#count;
  }

  count() {
    this.#count += 1;
    return this.#count;
  }

  reset() {
    this.#count = 0;
  }
}
