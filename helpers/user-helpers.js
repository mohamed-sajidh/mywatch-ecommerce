var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
const { response } = require('../app');


module.exports={


    addUser: (user) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).insertOne(user).then((res) => {

            })
        })
    },
   

    getAlluser: () => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(user)
        })
    },


    doSignup: (userData) => {
        userData.isBlocked = false
        console.log(userData.password);
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((res) => {
                console.log(res.insertedId,"1111111111111111111111111111111");
                resolve(res.insertedId)
            })

        })

    },


    doLogin: (userData) => {
        console.log(userData.email,'>>>');

        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email:userData.email })
            if (user) {
                 bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        
                        console.log("login success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    } else {
                        console.log("login failed");
                        reject({status:false})
                    }
                })
            }
            else {
                console.log("login failed...................");
                reject({status:false})
                
            }
        })
    },


    blockUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, {
                $set: {
                    isBlocked: true
                }
            }).then((response) => {
                resolve()
            })
        })
    },


    unblockUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, {
                $set: {
                    isBlocked: false
                }
            }).then((response) => {
                resolve()
            })
        })
    }
    

}


