const fs = require('fs');
const path = require('path');
const sep = path.sep;
const cfg = require('./config.json');
const db = require('./database');

module.exports = {
    // Remove all files and directories on speicified directory, directory will be created if it does not exist.
    emptyFolder: function (path, del = false) {
        if (fs.existsSync(path)) {
            let files = fs.readdirSync(path);
            if (files.length > 0) {
                files.forEach(function (element) {
                    let subpath = path + '/' + element;
                    if (fs.statSync(subpath).isFile()) {
                        fs.unlinkSync(subpath);
                    } else {
                        this.emptyFolder(subpath, true);
                    }
                }, this);
            }
            if (del) {
                fs.rmdirSync(path);
            }
        } else {
            fs.mkdirSync(path);
        }
    },

    // Create a directory if it does not exist.
    createFolder: function (path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    },

    // Create directory recursively
    createPath: function (targetDir) {
        const initDir = path.isAbsolute(targetDir) ? sep : '';
        targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(parentDir, childDir);
            if (!fs.existsSync(curDir)) {
                fs.mkdirSync(curDir);
            }
            return curDir;
        }, initDir);
    },

    // Append data to end of file, file will be created if it does not exist.
    writeLine: function (data, filename, folder = cfg.sqlfolder, ext = "sql") {
        var filepath = `${folder}/${filename}.${ext}`;
        if (!fs.existsSync(folder)) {
            this.createPath(folder);
        }
        if (!fs.existsSync(filepath)) {
            fs.appendFile(filepath, data, (err) => {
                if (err) throw err;
            });
        } else {
            fs.appendFile(filepath, "\r\n" + data, (err) => {
                if (err) throw err;
            });
        }
    },

    // Searh files by extension and execute callback function
    searchFolderCallback: function (path, ext, callback) {
        if (typeof callback === "function") {
            fs.readdir(path, (err, files) => {
                let reg = new RegExp(`\.${ext}$`, "i");
                files.forEach((file) => {
                    if (reg.test(file)) {
                        callback.call(this, file);
                    }
                });
            });
        }
    },

    // Search files by extension and return promise
    searchFolderPromise: function (path, ext) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    let reg = new RegExp(`\.${ext}$`, "i"); // Put global search flag will fail the test
                    resolve(files.filter(x => reg.test(x)));
                }
            });
        });
    },

    // Execute all sql files in speicified folder
    executeAllSQLFiles: async function (path) {
        await db.OpenConnection();
        await this.searchFolderPromise(path, "sql").then(files => {
            return Promise.all(
                files.map(file => {
                    let targetfile = `${path}/${file}`;
                    return new Promise((resolve, reject) => {
                        fs.readFile(targetfile, 'utf8', (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                let result = db.ExecuteQueryPromise(data);
                                resolve(result);
                            }
                        })
                    })
                })
            )
        });
        await db.CloseConnection();
    }
}



/* Promise.all resolve all recursive promises
(async () => {
    console.log('start');
    await Promise.all(
        [1, 2, 3, 4].map(x => {
            return new Promise((resolve, reject) => {
                console.log('1st promise');
                let result = secondpromise(x);
                resolve(result);
            })
        })
    ).then(x => console.log(x));
    console.log('end');
})();

function secondpromise(x) {
    return new Promise((res, rej) => {
        console.log('2nd promise');
        let result = thirdpromise(x);
        res(result);
    })
}

function thirdpromise(x) {
    return new Promise((res, rej) => {
        console.log('3rd promise');
        setTimeout(res(x * 3), 300);
    })
} 

Output:
--------------------------------------------------
start
1st promise
2nd promise
3rd promise
1st promise
2nd promise
3rd promise
1st promise
2nd promise
3rd promise
1st promise
2nd promise
3rd promise
[ 3, 6, 9, 12 ]
end
*/