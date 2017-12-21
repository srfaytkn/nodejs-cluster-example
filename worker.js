export default class Worker {
  workerId;
  job;

  constructor() {
    console.info("Worker: constructor");
  }

  start() {
    console.info("Worker: start");

    setInterval(() => {
      console.info(`Worker running: ${this.workerId}/${this.job.name}`);
    }, 1000);

    return this;
  }

  stop() {
    console.info(`Worker: stop ${this.workerId}/${this.job.name}`);
    process.exit();
  }

  static newInstance(workerId, job) {
    let worker = new Worker();
    worker.workerId = workerId;
    worker.job = job;

    return worker;
  }
}
