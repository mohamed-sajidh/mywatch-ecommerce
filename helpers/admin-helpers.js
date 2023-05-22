var db=require('../config/connection')
var collection=require('../config/collection')
var objectId=require('mongodb').ObjectId
const { ObjectId } = require('mongodb');
// const { response } = require('../app');
const { unblockUser } = require('./user-helpers');


module.exports={

    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
         let user=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(user)
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


    unblockUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(userId)},{
                $set:{
                    isBlocked:false
                }
            }).then((response)=>{
                resolve()
            })
        })
    },



    cancelOrder:(orderId)=>{
        console.log(orderId,"ppppppppaaaaaaaaaaarrrrrrrrrriiiiiiiii");
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},{
                $set:{
                    status:"order cancel"
                }
            }).then((response)=>{
                resolve()
            })
        })
    }









}