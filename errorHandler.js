function errorHandler(res, headers, error) {
    const msg = error ? error.message : '無此id或欄位填寫錯誤';
    res.writeHead('500', headers)
    res.write(JSON.stringify({
        message: msg,
        status: 'fail'
    }))
    res.end();
}

module.exports = errorHandler;