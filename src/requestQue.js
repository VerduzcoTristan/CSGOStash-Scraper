const axios = require('axios');

class RequestQueue {
  constructor(requestDelay = 10) {
    this.queue = [];
    this.requestDelay = requestDelay;
    this.isProcessing = false;
    this.maxConcurrentRequests = 5;
  }

  addRequest(url, callback) {
    this.queue.push({ url, callback });
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.maxConcurrentRequests);
      await Promise.all(batch.map(({ url, callback }) => this.fetchData(url, callback)));
      await this.delay(this.requestDelay);
    }

    this.isProcessing = false;
  }

  async fetchData(url, callback) {
    try {
      const response = await axios.get(url);

      // Invoke the callback function and pass the data extracted from the page
      await callback(response.data);
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error}`);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new RequestQueue();

