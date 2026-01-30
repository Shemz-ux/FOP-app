export const psqlError = (err, req, res, next) => {
    if (err.code === '22P02'){
        return res.status(400).send({msg: 'Invalid request!'})
    }

    if (err.code === '23503'){
        // Foreign key violation - provide more context
        const detail = err.detail || '';
        const constraint = err.constraint || '';
        return res.status(400).send({
            msg: 'Invalid insertion! Referenced record does not exist.',
            detail: detail,
            constraint: constraint
        })
    }

    if (err.code === '23502'){
        return res.status(400).send({msg: 'Missing data field!'})
    }

    if (err.code === '23514'){
        // Check constraint violation
        const constraint = err.constraint || '';
        if (constraint.includes('date_of_birth')) {
            return res.status(400).send({msg: 'Date of birth cannot be in the future'})
        }
        return res.status(400).send({msg: 'Data validation failed. Please check your input.'})
    }

    if (err.code === '23505'){
        // Unique constraint violation
        const constraint = err.constraint || '';
        if (constraint.includes('email')) {
            return res.status(400).send({msg: 'Email address already exists'})
        }
        return res.status(400).send({msg: 'Duplicate entry. This record already exists.'})
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
    console.error('Server Error:', err);
    res.status(500).send({msg: 'Internal server error'});
}