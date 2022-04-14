function Metronome(
  callback: Function,
  interval: number,
  options: { immediate: boolean; errorCallback?: Function }
) {
  this.interval = interval;

  this.startMetronome = () => {
    this.expectedTime = Date.now() + this.interval;

    if (options.immediate) {
      callback();
    }

    this.timeout = setTimeout(this.roundTime, this.interval);
  };
  this.stopMetronome = () => {
    clearTimeout(this.timeout);
  };
  this.roundTime = () => {
    let drift = Date.now() - this.expectedTime;
    if (drift > this.interval) {
      if (options.errorCallback) {
        options.errorCallback();
      }
    }
    callback();
    this.expectedTime += this.interval;
    this.timeout = setTimeout(this.roundTime, this.interval - drift);
  };
}

export default Metronome;
