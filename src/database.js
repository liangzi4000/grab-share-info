const sql = require('mssql');
const config = require('./config.json');

const _spAddStock = '[dbo].[Proc_StockList_Ins]';
const _spAddNotice = '[dbo].[Proc_Notices_Ins]';
const _spAddFinancialReport = '[dbo].[Proc_FinancialReports_Ins]';

const _spAddYJBB = '[EST].[Proc_yjbb_Ins]';

const pool = new sql.ConnectionPool(config.dbconfig);

module.exports = {
    OpenConnection: function () {
        return pool.connect();
    },
    CloseConnection: function () {
        return pool.close();
    },
    AddStock: async function (args) {
        await this.ExecuteStoredProc(_spAddStock, args);
    },

    AddNotice: async function (args) {
        await this.ExecuteStoredProc(_spAddNotice, args);
    },

    AddFinancialReport: async function (args) {
        await this.ExecuteStoredProc(_spAddFinancialReport, args);
    },

    CheckExist: async function (code) {
        let result = await this.ExecuteQuery(`select * from dbo.stocklist where code = '${code}'`);
        return result != null && result.rowsAffected[0] > 0;
    },

    ExecuteQuery: async function (sqlquery) {
        return pool.request()
            .query(sqlquery)
            .then(result => { return result; })
            .catch(err => {
                console.log(`EXECUTE ${sqlquery} failed`);
                console.log(err);
                return null;
            });
    },

    ExecuteStoredProc: async function (sp, args) {
        let arglist = args.map(i => `'${i.replace(/'/g, "''")}'`).join(",");
        return pool.request()
            .query(`EXECUTE ${sp} ${arglist}`)
            .catch(err => {
                console.log(`EXECUTE ${sp} ${arglist} failed:`);
            });
    }
}