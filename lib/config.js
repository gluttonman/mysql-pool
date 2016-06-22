/**
 * Config for cloudx
 * Created by Administrator on 2015/12/1.
 */
'use strict'
if (process.env.NODE_ENV === 'production') {//如果设置了产品模式，将数据库切换到正是数据库
    module.exports = {
        "writer": {
        },
        "reader": {
        }
    }
} else if(process.env.NODE_ENV === 'test'){
    module.exports = {
        "writer": {
            "connectionLimit": 10,
            "host": "localhost",
            "user": "root",
            "password": "123456",
            "database": "fdd_test_db",
            "multipleStatements": true
        },
        "reader": {
            "connectionLimit": 10,
            "host": "localhost",
            "user": "root",
            "password": "123456",
            "database": "fdd_test_db",
            "multipleStatements": true
        }
    }
} else {
    module.exports = {
        "writer": {
            "connectionLimit": 10,
            "host": "192.168.0.250",
            "user": "writer",
            "password": "w123456",
            "database": "fdd_main",
            "multipleStatements": true
        },
        "reader": {
            "connectionLimit": 10,
            "host": "192.168.0.250",
            "user": "reader",
            "password": "r123456",
            "database": "fdd_main",
            "multipleStatements": true
        }
    }
}