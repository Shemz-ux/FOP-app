import { createUser, fetchUserById, fetchUsers, removeUser, updateUser } from "../models/users.js"

export const postUser = (req, res, next) => {
    const newUser = req.body
    createUser(newUser).then((user)=>{
        res.status(201).send({newUser: user})
    }).catch((err)=>{
        next(err)
    })
}

export const getUsers = (req, res, next) => {
    fetchUsers().then((users)=>{
        res.status(200).send({users: users})
    }).catch((err)=>{
        next(err)
    })
}

export const getUser = (req, res, next) => {
    const {user_id} = req.params
    fetchUserById(user_id).then((user)=>{
        res.status(200).send({user: user})
    }).catch((err)=>{
        next(err)
    })
}

export const patchUser = (req, res, next) => {
    const updatedUser = req.body
    const {user_id} = req.params
    updateUser(updatedUser, user_id).then((user)=>{
        res.status(201).send({user: user})
    }).catch((err)=>{
        next(err)
    })
}

export const deleteUser = (req, res, next) => {
    const {user_id} = req.params
    removeUser(user_id).then((msg) => {
        res.status(200).send({msg})
    }).catch((err)=>{
        next(err)
    })
}
