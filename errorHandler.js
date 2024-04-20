function errorHandler(res, headers, error) {
    const msg = error ? error.message : '無此id或欄位填寫錯誤';
    res.status(500).json({
        message: msg,
        status: 'fail'
    })
}

module.exports = errorHandler;