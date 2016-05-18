/**
 * Created by Glutton on 2016/5/16.
 */
'use strict'
const mysql = require("mysql");
const debug = require("debug")("mysql-pool")
const defaultConfig = {
    "connectionLimit": 10,
    "host": "192.168.1.250",
    "user": "writer",
    "password": "w123456",
    "database": "fdd_main",
    "multipleStatements": true
}
let __instance = function () {
    let instance = null
    return (newInstance)=> {
        if (newInstance) {
            instance = newInstance
        }
        return instance
    }
}()


let __pool = mysql.createPool(defaultConfig)
module.exports = class Pool {
    constructor() {
        this.sql = ""
        this.values = []
    }

    select(columns, table) {
        if (arguments.length === 1) {
            table = arguments[0]
            this.sql = `select * from ${table}`
        } else {
            this.sql = `select ${columns} from ${table}`
        }
        return this
    }

    delete(table) {
        this.sql = `delete from ${table}`
        return this
    }

    insert(columns, table) {
        let values = []
        let cols = []
        for (let col in columns) {
            cols.push(col)
            values.push('?')
            this.values.push(columns[col])
        }
        this.sql = `insert into ${table} (${cols}) values (${values})`
        return this
    }

    update(columns, table) {
        let cols = []
        for (let col in columns) {
            cols.push(col + "=?")
            this.values.push(columns[col])
        }
        this.sql = `update ${table} set ${cols}`
        return this
    }

    where(conditions) {
        let and = []
        for (let key in conditions) {
            and.push(" and " + key + "=?")
            this.values.push(conditions[key])
        }
        this.sql += ` where 1=1 ${and}`
        return this
    }

    orderBy(conditions) {
        let cons = []
        for (let o in conditions) {
            cons.push(o + " " + conditions[o])
        }
        this.sql += ` order by ${cons}`
        return this
    }

    limit(start, end) {
        let s = start, e = end;
        if (arguments.length === 1) {
            e = start
            s = 0
        }
        this.sql += ` limit ${s} ,${e}`
        return this
    }

    query(conn, cb) {
        let callback = arguments[arguments.length-1]
        let that = this
        if (arguments.length == 1) {
            return new Promise(function (_resolve, _reject) {
                __pool.getConnection(function (connErr, connection) {
                    const resolve = function (result) {
                        _resolve(result)
                        callback && callback(null, result)
                    }
                    const reject = function (err) {
                        _reject(err)
                        callback && callback(err)
                    }
                    if (connErr) {
                        that.__releaseConn(connection)
                        return reject(connErr)
                    }
                    debug(that.sql, that.values);
                    connection.query(that.sql, that.values, function (rstErr, result) {
                        that.__releaseConn(connection)
                        if (rstErr) {
                            return reject(rstErr)
                        }
                        return resolve(result)
                    })
                })
            })
        } else {
            return new Promise(function (_resolve, _reject) {
                const resolve = function (result) {
                    _resolve(result)
                    callback && callback(null, result)
                }
                const reject = function (err) {
                    _reject(err)
                    callback && callback(err)
                }
                debug(that.sql, that.values);
                conn.query(that.sql, that.values, function (rstErr, result) {
                    that.__releaseConn(conn)
                    if (rstErr) {
                        return reject(rstErr)
                    }
                    return resolve(result)
                })
            })
        }
    }

    transaction(tasks, callback) {
        let results = []
        let that = this
        return new Promise(function (_resolve, _reject) {
            __pool.getConnection(function (pErr, connection) {
                const resolve = function (result) {
                    that.__releaseConn(connection)
                    _resolve(result)
                    callback && callback(null, result)
                }
                const reject = function (err) {
                    that.__releaseConn(connection)
                    _reject(err)
                    callback && callback(err)
                }
                if (pErr)return reject(pErr)
                connection.beginTransaction(function (tErr) {
                    if (tErr){
                        return connection.rollback(function () {
                            reject(tErr)
                        })
                    }
                    tasks.forEach(function (task, index) {
                        let pool = task()
                        let sql = pool.sql
                        let values = pool.values
                        that.__releaseConn()
                        debug(sql, values)
                        connection.query(sql, values, function (qErr, result) {
                            if (qErr){
                                return  connection.rollback(function () {
                                    reject(qErr)
                                })
                            }
                            results.push(result)
                            if (index === tasks.length - 1) {
                                connection.commit(function (cErr) {
                                    if (cErr) {
                                        return connection.rollback(function () {
                                            reject(cErr)
                                        })
                                    }
                                    resolve(results)
                                })
                            }

                        })
                    })
                })
            })
        })

    }

    __releaseConn(connection) {
        this.sql = ""
        this.values = []
        connection && connection.release()
    }

}
