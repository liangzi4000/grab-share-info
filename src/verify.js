const config = require('./config.json');
const common = require('./common');
const fs = require('fs');


common.searchFolder(config.sqlfolder, "rpt", (file) => {
    let targetfile = `${config.sqlfolder}/${file}`;
    fs.readFile(targetfile, 'utf8', (err, data) => {
        if (data.replace(/\(1 rows affected\)/g, '').trim() != "") {
            console.log(file);
        } else {
            fs.unlink(targetfile, (err) => {
                if (err) throw err;
            })
        }
    })
});
