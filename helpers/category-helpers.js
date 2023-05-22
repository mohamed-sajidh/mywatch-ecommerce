var db = require('..config/connection')
var collection = require('..config/collection')
const { ObjectId } = require('mongodb');
// const { response } = require('../app');
var objectId=require('mongodb').ObjectId




module.exports = {


    getAllCategory : (category)=>{
        return new Promise((resolve , reject) =>{
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category).then((res)=>{
                resolve({ id: res.insertedId })
            })
        })
    }



}