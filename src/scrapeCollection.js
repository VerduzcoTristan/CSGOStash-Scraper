const cheerio = require('cheerio');
const { fetchHtml } = require('./scrapeUrls');

// Function to extract collection items from HTML content
async function extractCollectionItems(html) {
    const $ = cheerio.load(html);
    const collectionItems = [];

    const itemElements = $('.col-widen > .well.result-box > h3');

    // Iterate over each item and extract the details
    await itemElements.each(async (index, element) => {
        const weaponName = $(element).find('h3 > a:first-child').text().trim();
        const skinName = $(element).find('h3 > a:last-child').text().trim();

        const skinUrl = $(element).siblings().find('a:last-child').attr('href');
        if(skinUrl.endsWith('?Knives=1') || skinUrl.endsWith('?Gloves=1')) return;
        
        // TODO maybe throttle this or make syncronous
        const wears = await scrapeWear(skinUrl);

        const { minWear, maxWear } = wears;

        // Add item details to the collectionItems array
        collectionItems.push({
            weaponName,
            skinName,
            minWear,
            maxWear
        });
    });

    return collectionItems;
}

// Scrape the wear of an item
async function scrapeWear(url) {
    try {
        console.log('Scraping wear:', url);
        const html = await fetchHtml(url);
        
        const $ = cheerio.load(html);

        const minWear = $('.wear-min-value').attr('data-wearmin');
        const maxWear = $('.wear-max-value').attr('data-wearmax');

        return { minWear, maxWear };
    } catch (error) {
        console.error('Error scraping wear:', error);
        return [];
    }
}

module.exports = {
    extractCollectionItems,
};