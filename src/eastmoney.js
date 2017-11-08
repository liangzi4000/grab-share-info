const puppeteer = require('puppeteer');
const cfg = require('./config.json');
const stocklist = require('./stocklist.json');
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
    await page.setViewport({ width: cfg.environment.resolution.width, height: cfg.environment.resolution.height });
    for (let i = 0; i < stocklist.data.length; i++) {
        console.log(`Processing stock ${stocklist.data[i]}`);
        let curStock = stocklist.data[i].substr(2);
        await page.goto(cfg.urleastmoneyyjbb.replace('{stockcode}', curStock), {
            timeout: 0
        });

        let tbldata = await page.evaluate(() => {
            let result = [];
            result[0] = document.querySelector('#stockName').textContent.split('(')[1].split('.')[0] // code
            result[1] = document.querySelector('#stockName').textContent.split('(')[0]; // company name
            result[2] = document.querySelector('#comInfo1 tbody tr:nth-child(1) td:nth-child(2)').textContent; //Chinese Name
            result[3] = document.querySelector('#comInfo1 tbody tr:nth-child(2) td:nth-child(2)').textContent; //English Name
            result[4] = document.querySelector('#comInfo1 tbody tr:nth-child(3) td:nth-child(2)').textContent; //Exchange 
            result[5] = document.querySelector('#comInfo1 tbody tr:nth-child(4) td:nth-child(2)').textContent; //IPO Price
            result[6] = document.querySelector('#comInfo1 tbody tr:nth-child(5) td:nth-child(2)').textContent; //Founded Date
            result[7] = document.querySelector('#comInfo1 tbody tr:nth-child(6) td:nth-child(2)').textContent; //Institution Type
            result[8] = document.querySelector('#comInfo1 tbody tr:nth-child(7) td:nth-child(2)').textContent; //Secretariat
            result[9] = document.querySelector('#comInfo1 tbody tr:nth-child(8) td:nth-child(2)').textContent; //Sec Phone
            result[10] = document.querySelector('#comInfo1 tbody tr:nth-child(9) td:nth-child(2)').textContent; //Sec Fax
            result[11] = document.querySelector('#comInfo1 tbody tr:nth-child(10) td:nth-child(2)').textContent; //Sec email
            result[12] = document.querySelector('#comInfo1 tbody tr:nth-child(11) td:nth-child(2)').textContent; //Postcode
            result[13] = document.querySelector('#comInfo1 tbody tr:nth-child(12) td:nth-child(2)').textContent;
            result[14] = document.querySelector('#comInfo1 tbody tr:nth-child(13) td:nth-child(2)').textContent;
            result[15] = document.querySelector('#comInfo1 tbody tr:nth-child(14) td:nth-child(2)').textContent;
            result[16] = 
            result[17] = 

            return Array.from(document.querySelectorAll('#dt_1 tbody tr'))
                .map(item => Array.from(item.querySelectorAll('td'))
                    .map(x => x.textContent));
        });

        /*
        EXEC	@return_value = [SIA].[Proc_gsjj_Ins]
		@Code = N'1',
		@ShortName = N'1',
		@FullNameCN = N'1',
		@FullNameEN = N'1',
		@StockExchange = N'1',
		@IPODate = N'1',
		@IPOPrice = 1,
		@PrimaryDistribution = N'1',
		@FoundedDate = N'1',
		@RegisteredCapital = N'1',
		@InstitutionType = N'1',
		@OrganizationType = N'1',
		@BoardSecretariat = N'1',
		@BoardSecretariatPhone = N'1',
		@BoardSecretariatFax = N'1',
		@BoardSecretariatEmail = N'1',
		@Postcode = N'1',
		@Phone = N'1',
		@Fax = N'1',
		@Email = N'1',
		@Website = N'1',
		@DisclosureWebsite = N'1',
		@NameChangeHistory = N'1',
		@RegisteredAddress = N'1',
		@OfficeAddress = N'1',
		@Profile = N'1',
        @BusinessScope = N'1'
        */

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

