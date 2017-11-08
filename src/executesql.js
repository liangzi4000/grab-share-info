const cfg = require('./config.json');

const common = require('./common');

(async () => {
    console.time('total');
    console.log('Executing queries.');
    await common.executeAllSQLFiles(cfg.sqlfolderyjbb);
    console.log('Queries executed.');
    console.timeEnd('total');
})();