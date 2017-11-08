const puppeteer = require('puppeteer');
const cfg = require('./config.json');
const stocklist = require('./stocklist.json');
const common = require('./common');

(async () => {
    console.time('total');
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
    await page.setViewport({ width: cfg.environment.resolution.width, height: cfg.environment.resolution.height });
    for (let i = 0; i < stocklist.data.length; i++) {
        let code = stocklist.data[i].replace(/[a-zA-Z]/g, '');
        await page.goto(cfg.urlsinagsjj.replace('{stockcode}', code), {
            timeout: 0
        });
        let tbldata = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('#dt_1 tbody tr'))
                .map(item => Array.from(item.querySelectorAll('td'))
                    .map(x => x.textContent));
        });
        
        let stockparams = await page.evaluate(() => {
            let stockinfo = document.querySelectorAll('#table2 tbody tr:nth-child(1) td');
            return [stockinfo[0].textContent, stockinfo[1].textContent];
        });
        await db.AddStock(stockparams);
        let reportparamslist = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('#box > div:nth-child(1) tbody tr'))
                .map(item => Array.from(item.querySelectorAll('td'))
                    .map(x => x.textContent)
                    .slice(0, 12));
        });
        for (let i = 0; i < reportparamslist.length; i++) {
            await db.AddFinancialReport([stockparams[0]].concat(reportparamslist[i]));
        }
        let announceparamslist = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('#table1 tbody tr'))
                .map(item => Array.from(item.querySelectorAll('td'))
                    .map(x => x.textContent));
        });
        for (let i = 0; i < announceparamslist.length; i++) {
            await db.AddNotice([stockparams[0]].concat(announceparamslist[i]));
        }
    }
    await browser.close();
    console.timeEnd('total');
})();

