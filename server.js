/**
 * Created by Administrator on 2015/9/30.
 * 公用数据库连接模块
 */
var mysql = require("mysql");
var fs = require("fs");
var config = JSON.parse(fs.readFileSync("dbconfig.json"));
var pool = mysql.createPool(config);
console.info(pool);
module.exports = DBManager = {};
DBManager.selectDB = function (sql, values, callback) {
    pool.getConnection(function (connErr, connection) {
        console.log(sql + ":" + values);
        if (connErr) {
            callback.apply(null, [connErr, null]);
            connection.release();
            return;
        }
        connection.query(sql, values, function (queryErr, rows) {
            callback.apply(null, [queryErr, rows]);
            connection.release();
        });
    });
}



