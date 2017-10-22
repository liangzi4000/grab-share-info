const fs = require('fs');

module.exports = {
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

    createFolder: function (path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }
}
