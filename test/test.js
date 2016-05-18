/**
 *
 * Created by Administrator on 2015/9/30.
 */
    'use strict'
const pool = require("../index.js").createPool(null);
const assert = require('assert')
describe("pool", function () {
    const table = 'fdd_city'
    describe("#select", function () {
        it("promise type!", function () {
            return pool.select(table).where({c_status:1}).orderBy({c_pid:"desc"}).limit(2).query().then(function (result) {
                assert.equal(2, result.length);
            }).catch(function (err) {
                console.info(err);
            })

        });
        it("callback type!", function (done) {
            pool.select(['*'],table).where({c_status:1}).orderBy({c_pid:"desc"}).limit(2).query(function (err, result) {
                assert(2,result.length)
                done()
            })
        })
    })
    describe("#insert", function () {
        it("promise type!", function () {
            return pool.insert({c_name:"测试",c_code:"CS",c_status:1,c_type:"ceshi",c_pid:0}, table).query().then(function (result) {
                console.info(result.insertId);
            })
        })
        it("callback type!", function (done) {
            pool.insert({c_name:"测试",c_code:"CS",c_status:1,c_type:"ceshi",c_pid:0},table).query(function (err, result) {
                console.info(result);
                done()
            })
        })
    })
    describe("#update", function () {
        it("promise type!", function () {
            return pool.update({c_datetime: new Date()}, table).where({id:7}).query().then(function (result) {
                console.info(result.insertId);
            })
        })
        it("callback type!", function (done) {
            pool.update({c_datetime: new Date()}, table).where({id:8}).query(function (err, result) {
                console.info(result);
                done()
            })
        })
    })
    describe("#delete", function () {
        it("promise type!", function () {
            return pool.delete(table).where({id:7}).query().then(function (result) {
                console.info(result.insertId);
            })
        })
        it("callback type!", function (done) {
            pool.delete(table).where({id:8}).query(function (err, result) {
                console.info(result);
                done()
            })
        })
    })
    describe("#transaction", function () {
        it("promise type!", function () {
            return pool.transaction([
                function () {
                    return pool.select("*", table).where({id:5})
                },
                function () {
                    return pool.select(table).where({id:6})
                }
            ]).then(function (result) {
                console.info(result);
            })
        })
        it("callback type!", function (done) {
            pool.transaction([
                function () {
                    return pool.select("*", table).where({id:5})
                },
                function () {
                    return pool.select(table).where({id:6})
                }
            ],function (err, results) {
                console.info(err);
                console.info(results);
                done()
            })
        })
    })
});