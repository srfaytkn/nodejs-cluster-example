import 'babel-core/register'
import 'babel-polyfill'

import cluster from 'cluster';
import Worker from './worker'

class App {
  works = [];

  constructor() {
    if (!cluster.isMaster) {
      this.childProcess();
      return;
    }

    console.info("App: constructor");
    this.init();
    this.stopWorker(1);
  }

  async init() {
    console.info("App: init");
    let jobs = await this.getJobs();

    jobs.forEach(job => this.startWorker(job));
  }

  getJobs() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {name: "job1", id: 1},
          {name: "job2", id: 2},
          {name: "job3", id: 3},
          {name: "job4", id: 4}
        ]);
      }, 2000);
    });
  }

  startWorker(job) {
    console.info("App: startWorker");

    let worker = cluster.fork();
    let work = {
      processType: "START",
      workerId: worker.id,
      job: job
    };

    worker.send(work);
    this.works.push(work);
  }

  childProcess() {
    console.info("App: childProcess");

    process.on('message', (data) => {
      switch (data.processType) {
        case "START":
          this.work = Worker.newInstance(data.workerId, data.job).start();
          break;
        case "STOP":
          this.work.stop();
          break;
      }
    });
  }

  stopWorker(jobId) {
    console.info("App: stopWorker");
    let self = this;

    setTimeout(() => {
      let work = self.works.find(work => work.job.id === jobId);
      cluster.workers[work.workerId].send({...work, processType: "STOP"});
    }, 10000);
  }
}

export default new App()