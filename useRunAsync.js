// 判断是否是promise
function isPromise(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}


// run-async作用：保证2个方法同步顺序执行
var runAsync = require('run-async');




// 用法1: 使用 this.async 回调
runAsync(
    function (...args) {
        console.log(args); // ['params']
        var done = this.async();

        setTimeout(function () {
            done(null, 'done running with callback');
        }, 10);
    },
    function (err, returnValue) {
        console.log(err, returnValue); // null, 'done running with callback'
    }
)('params')




// 用法2: 使用 Promise
runAsync(
    function (...args) {
        return new Promise(function (resolve, reject) {
            resolve('done running with promises');
        });
    },
    function (err, returnValue) {
        console.log(err, returnValue); // null, 'done running with callback'
    }
)('params')




// 用法3: 直接同步写法
runAsync(
    function (...args) {
        return 'done running sync function';
    },
    function (err, returnValue) {
        console.log(err, returnValue); // null, 'done running with callback'
    }
)('params')




// 用法4: 语法糖写法，相当于用法1
runAsync.cb(
    function (a, b, cb) {
        // a = 1, b = 2
        // cb 就是 this.async() 的返回值
        cb(null, a + b);
    },
    function (err, result) {
        console.log(result)
    }
)(1, 2)


/* 
runAsync.cb = function (func, cb) {
    return runAsync(
        function () {
            var args = Array.prototype.slice.call(arguments);
            if (args.length === func.length - 1) {
                args.push(this.async());
            }
            return func.apply(this, args);
        },
        cb
    );
}; 
*/

