const cheerio = require('cheerio');
const { fetchHtml } = require('./scrapeUrls');
const que = require('./requestQue.js');

// Function to extract collection items from HTML content
async function processRequest(html, collectionItems) {
    const scrapedItem = await scrapeSkin(html);
    collectionItems.push(scrapedItem);
}

async function extractCollectionItems(html) {
    const $ = cheerio.load(html);
    const collectionItems = [];
    const itemElements = $('.col-widen > .well.result-box > h3');

    itemElements.each((index, element) => {
        const skinUrl = $(element).siblings().find('a:last-child').attr('href');
        if (skinUrl.endsWith('?Knives=1') || skinUrl.endsWith('?Gloves=1')) return;

        que.addRequest(skinUrl, (html) => {
            console.log(`Scraping skin: ${skinUrl}`);
            processRequest(html, collectionItems);
        });
    });

    // Wait for all the requests to complete
    await que.processQueue();

    // Return the collectionItems array
    return collectionItems;
}

const rarities = ['Covert', 'Classified', 'Restricted', 'Mil-Spec', 'Industrial Grade', 'Consumer Grade'];

// Scrape a skin page
async function scrapeSkin(html) {
    const $ = cheerio.load(html);
    try {
        const weaponName = $('h2 > a').first().text();
        const skinName = $('h2 > a').last().text();

        const minWear = $('.wear-min-value').attr('data-wearmin');
        const maxWear = $('.wear-max-value').attr('data-wearmax');

        let rarity = $('.quality .nomargin').text().trim();
        rarity = rarities.find(type => rarity.startsWith(type))

        return { weaponName, skinName, rarity, minWear, maxWear };
    } catch (error) {
        console.error('Error scraping wear:', error);
        return [];
    }
}

module.exports = {
    extractCollectionItems,
};