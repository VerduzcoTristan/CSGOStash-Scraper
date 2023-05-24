const fs = require('fs');
const { fetchHtml, extractCollectionUrls } = require('./scrapeUrls');
const { extractCollectionItems } = require('./scrapeCollection');
const { throttleRequests } = require('./throttle.js');

// Function to scrape collection URLs
async function scrapeCollectionUrls() {
    try {
        const html = await fetchHtml('https://csgostash.com/');
        return extractCollectionUrls(html);
    } catch (error) {
        console.error('Error scraping collection URLs:', error);
        return [];
    }
}

// Function to scrape a collection and collect weapon and skin names
async function scrapeCollection(collectionUrl) {
    try {
        console.log('Scraping collection:', collectionUrl);
        const html = await fetchHtml(collectionUrl);
        return await extractCollectionItems(html);
    } catch (error) {
        console.error('Error scraping collection:', error);
        return [];
    }
}

// Main function to orchestrate the scraping process
async function scrapeCSGOStash() {
    try {
        console.log('Scraping collection URLs...');
        // Scrape collection URLs
        const collectionUrls = await scrapeCollectionUrls();
        console.log('Found', collectionUrls.length, 'collection URLs.');

        // Set the maximum number of concurrent colleciton requests
        const maxConcurrentRequests = 1;

        const collections = [];

        // Process collection URLs with throttling
        await throttleRequests(collectionUrls, maxConcurrentRequests, async (collectionUrl) => {
            // Scrape the collection and collect weapon and skin names
            const items = await scrapeCollection(collectionUrl);
            collections.push({ collectionUrl, items });
        });

        // TODO format names and get rid of placeholders.

        // Save collections to a file
        fs.writeFile('collections.json', JSON.stringify(collections, null, 2), (error) => {
            if (error) {
                console.error('Error saving collections to file:', error);
            } else {
                console.log('Scraping completed. Collections saved to collections.json.');
            }
        });

    } catch (error) {
        console.error('Error scraping CSGO Stash:', error);
    }
}

// Start the scraping process
scrapeCSGOStash();