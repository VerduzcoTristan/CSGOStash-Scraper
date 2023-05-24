const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch the HTML content of a URL
async function fetchHtml(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching HTML:', error);
        return '';
    }
}

function extractCollectionUrls(html) {
    const $ = cheerio.load(html);
    const collectionUrls = [];

    // Find the navbar element containing URLs
    const dropdownMenu = $('.navbar-nav .dropdown-menu');

    // Function to extract URLs and add them to the collectionUrls array
    const extractUrls = (links) => {
        links.each((index, element) => {
            const url = $(element).attr('href');
            collectionUrls.push(url);
        });
    };

    // Find each collection URL within the dropdown menu
    const collectionLinks = dropdownMenu.find('a[href^="https://csgostash.com/collection/"]');
    extractUrls(collectionLinks);

    // Find each case URL within the dropdown menu
    const caseLinks = dropdownMenu.find('a[href^="https://csgostash.com/case/"]');
    extractUrls(caseLinks);

    return collectionUrls;
}

// // Function to extract collection and case URLs from HTML content
// function extractCollectionUrls(html) {
//     const $ = cheerio.load(html);
//     const collectionUrls = [];

//     // Find the navbar element containing URLs
//     const dropdownMenu = $('.navbar-nav .dropdown-menu');

//     // Find each collection URL within the dropdown menu
//     const collectionLinks = dropdownMenu.find('a[href^="https://csgostash.com/collection/"]');

//     // Find each case URL within the dropdown menu
//     const caseLinks = dropdownMenu.find('a[href^="https://csgostash.com/case/"]');

//     // Extract the URLs and add them to the collectionUrls array
//     collectionLinks.each((index, element) => {
//         const collectionUrl = $(element).attr('href');
//         collectionUrls.push(collectionUrl);
//     });

//         // Extract the URLs and add them to the collectionUrls array
//         caseLinks.each((index, element) => {
//             const caseUrl = $(element).attr('href');
//             collectionUrls.push(caseUrl);
//         });

//     return collectionUrls;
// }

module.exports = {
    fetchHtml,
    extractCollectionUrls,
};
