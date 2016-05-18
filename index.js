/**
 * Created by Administrator on 2015/9/30.
 * 公用数据库连接模块
 */
const Pool = require("./lib/pool")

exports.createPool = function () {
    return new Pool();
}

