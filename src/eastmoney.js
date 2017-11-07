const puppeteer = require('puppeteer');
const config = require('./config.json');
const common = require('./common');

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
        let curStock = config.stocklist[i].substr(2);
        await page.goto(config.urleastmoneyyjbb.replace('{stockcode}', curStock), {
            timeout: 0
        });

        let tbldata = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('#dt_1 tbody tr'))
                .map(item => Array.from(item.querySelectorAll('td'))
                    .map(x => x.textContent));
        });

        let nextPage = null;
        let currentPage = 1;
        while (nextPage = (await page.evaluateHandle(() => { return Array.from(document.querySelectorAll('a[title*="转到"]')).find(x => x.textContent === "下一页") })).asElement()) {
            await nextPage.click();
            currentPage++;
            await page.waitForFunction((currentPage) => {
                return document.querySelector('#PageNav span.at').textContent == currentPage;
            }, { polling: 300 }, currentPage);
            tbldata = (await page.evaluate(() => {
                return Array.from(document.querySelectorAll('#dt_1 tbody tr'))
                    .map(item => Array.from(item.querySelectorAll('td'))
                        .map(x => x.textContent));
            })).concat(tbldata);
        };
        tbldata.forEach((row) => {
            common.writeLine(`EXEC [EST].[Proc_yjbb_Ins] @Code = N'${curStock}',@CutoffDate = N'${row[0]}',@EPS = N'${row[1]}',@EPSDeduct = N'${row[2]}',@Revenue = N'${row[3]}',@RevenueYoy = N'${row[4]}',@RevenueQoq = N'${row[5]}',@Profit = N'${row[6]}',@ProfitYoy = N'${row[7]}',@ProfiltQoq = N'${row[8]}',@NAVPerUnit = N'${row[9]}',@ROE = N'${row[10]}',@CashPerUnit = N'${row[11]}',@GrossProfitRate = N'${row[12]}',@Distribution = N'${row[13]}',@DividenRate = N'${row[14]}',@AnnounceDate = N'${row[15]}'`, curStock);
        });
    }
    await browser.close();
    console.log('Done');
})();

