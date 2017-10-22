const puppeteer = require('puppeteer');
const config = require('./config.json');
const db = require('./database');
const common = require('./common');

common.createFolder(config.screenshot);
console.time('total');
(async () => {
    /*     await db.AddStock('B\'ru\'ce','Ye');
        console.log('done')
        return; */

    const browser = await puppeteer.launch({
        headless: false, args: [
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
    await db.OpenConnection();
    for (let i = 0; i < config.stocklist.length; i++) {
        let code = config.stocklist[i].replace(/[a-zA-Z]/g, '');
        let res = await db.CheckExist(code);
        //let res = await db.ExecuteQuery(`select * from dbo.stocklist where code = '${code}'`);
        console.log(res);
        continue;
        console.log(`Processing stock ${config.stocklist[i]}`);
        await page.goto(config.sinayjbburl.replace('{stockcode}', code), {
            timeout: 60000
        });
        await page.screenshot({ path: `${config.screenshot}/${config.stocklist[i]}.png`, fullPage: true });
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

        /* 
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

        await client.login().then(() =>
            db.collection('CoreIndicators').insert([indicators])
        ); */
    }
    await db.CloseConnection();
    await browser.close();
    console.log('Done');
    console.timeEnd('total');
})();

