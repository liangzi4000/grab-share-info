const puppeteer = require('puppeteer');
const fs = require('fs');
const stitch = require("mongodb-stitch")
const config = require('./config.json');

const client = new stitch.StitchClient('grab-share-mongodb-ugdgr');
const db = client.service('mongodb', 'mongodb-atlas').db('StockDB');

(async () => {
    const browser = await puppeteer.launch({
        headless: true, args: [
            '--start-maximized',
            //'--kiosk',
            //'--start-fullscreen',
            '--no-default-browser-check',
            '--no-first-run',
            '--disable-infobars',
            //'--disable-session-crashed-bubble',
            //'--incognito'
            '--aggressive-cache-discard',
            '--disable-cache',
            '--disable-application-cache',
            '--disable-offline-load-stale-cache',
            '--disk-cache-size=0',
        ],
        //slowMo:120
    });
    const page = await browser.newPage();
    await page.setViewport({ width: config.environment.resolution.width, height: config.environment.resolution.height });
    for (let i = 0; i < config.stocklist.length; i++) {
        console.log(`Processing stock ${config.stocklist[i]}`);
        await page.goto(config.url.replace('{stockcode}', config.stocklist[i]),{
            timeout:0
        });

        let indicators = await page.evaluate(() => {
            let list = Array.from(document.querySelectorAll('#rtp2 tr td'));
            let result = {};
            list.forEach((item) => {
                console.log(item.textContent);
                let arr = item.textContent.split('：');
                result[arr[0].trim()] = arr[1].trim();
            })
            return result;
        });
        indicators["_id"] = config.stocklist[i];
        
        client.login().then(() =>
            db.collection('CoreIndicators').insert([indicators])
        );
    }
    await browser.close();
    console.log('Done');
})();

