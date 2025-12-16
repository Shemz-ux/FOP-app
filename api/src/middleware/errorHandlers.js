export const psqlError = (err, req, res, next) => {
    if (err.code === '22P02'){
        return res.status(400).send({msg: 'Invalid request!'})
    }

    if (err.code === '23503'){
        return res.status(400).send({msg: 'Invalid insertion!'})
    }

    if (err.code === '23502'){
        return res.status(400).send({msg: 'Missing data field!'})
    }

    next(err);
}

export const customError = (err, req, res, next) => {
    if (err.status){
        return res.status(err.status).send({msg: err.msg})
    }
    next(err);
}

export const serverError = (err, req, res, next) => {
    res.status(500).send({msg: 'Internal server error'});
}