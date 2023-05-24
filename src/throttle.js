// Function to throttle requests with a maximum number of concurrent requests
// Prevent csgo stash from blocking our requests
async function throttleRequests(items, maxConcurrent, asyncFn) {
    const requestQueue = [];
    let currentIndex = 0;

    // Helper function to introduce a delay using setTimeout
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Process the items with throttling
    async function processItems() {
        while (currentIndex < items.length) {
            // Retrieve the next item to process
            const item = items[currentIndex];
            currentIndex++;

            // Execute the asynchronous function
            await asyncFn(item);

            // Introduce a delay of 1 second (1000 milliseconds) before processing the next item
            await delay(1000);
        }
    }

    // Create a queue of concurrent requests
    for (let i = 0; i < maxConcurrent; i++) {
        requestQueue.push(processItems());
    }

    // Wait for all requests to complete
    await Promise.all(requestQueue);
}

module.exports = { throttleRequests }