/**
 * Created by Administrator on 2015/9/30.
 */
var mysql = require("../server.js");

describe("test mysql", function () {
    it("test selected", function (done) {
        var sql = "select * from fdd_house";
        mysql.selectDB(sql, null, function (err, result) {
            console.info(result)

        })
    });
});