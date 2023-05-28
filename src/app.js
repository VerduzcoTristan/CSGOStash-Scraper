const fs = require('fs');
const path = require('path');
const { fetchHtml, extractCollectionUrls } = require('./scrapeUrls');
const { extractCollectionItems } = require('./scrapeCollection');
const que = require('./requestQue.js');

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

// Main function to orchestrate the scraping process
async function scrapeCSGOStash() {
    try {
        console.log('Scraping collection URLs...');
        // Scrape collection URLs
        const collectionUrls = await scrapeCollectionUrls();
        console.log('Found', collectionUrls.length, 'collection URLs.');

        const collections = [];

        collectionUrls.forEach((collectionUrl) => {
            // Add urls to que
            que.addRequest(collectionUrl, async html => {

                console.log(`Scraping collection: ${collectionUrl}`);

                // Scrape the collection and collect weapon and skin names
                const items = await extractCollectionItems(html);

                if(!items) console.log('No items found for collection:', collectionUrl)

                const collectionName = collectionUrl.split('/').pop().replaceAll('+', ' ');
                // Add collection to array
                collections.push({ collectionUrl, collectionName, items });
            })
        });

        // Wait for all requests to finish
        while(que.isProcessing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }


        // Save collections to a file
        fs.writeFile('collections.json', JSON.stringify(collections, null, 2), (error) => {
            if (error) {
                console.error('Error saving collections to file:', error);
            } else {
                console.log(`Scraping completed. Collections saved to ${path.join(__dirname, 'collections.json')}`);
            }
        });

    } catch (error) {
        console.error('Error scraping CSGO Stash:', error);
    }
}

// Start the scraping process
scrapeCSGOStash();
