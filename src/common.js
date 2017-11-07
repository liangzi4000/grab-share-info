const fs = require('fs');
const path = require('path');
const sep = path.sep;
const cfg = require('./config.json');

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
    searchFolder: function (path, ext, callback) {
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
}
