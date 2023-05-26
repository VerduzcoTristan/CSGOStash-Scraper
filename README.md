# CSGOStash-Scraper

#### **What it do?**

Scrapes CSGOStash and outputs a JSON file containing an array of every item in the game sorted by collection. Here is what it information it extracts:  
- Weapon name
- Skin name
- Minimum float
- Maximum float
- Skin rarity

#### **Description**  
Extract info about skins from CSGOStash. Skins are sorted by collection. Currently does not parse gloves and knives. More functionality may be added in the future. This project was a helper utility for one of my other projects so this fist version is very basic. Output is a json file containing an array of collections. Each collection contains the collection url and an array of items.

#### **Usage**  
Open src folder and run the following command:  
```bash
node app.js
```

#### **Dependencies**  
- NodeJS (duh)
- Axios
- Cheerio

[Example Output 5/24/23](https://hastebin.com/share/unozacocuh.json)
