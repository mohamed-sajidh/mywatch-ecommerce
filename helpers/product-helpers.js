var db=require('../config/connection')
var collection=require('../config/collection');
const { ObjectId } = require('mongodb');
// const { response } = require('../app');
var objectId=require('mongodb').ObjectId




module.exports={


    addProduct: (product) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((res) => {
                resolve({ id: res.insertedId })
            })
        })

    },


    getAllProduct: () => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },


    deleteProduct: (prodId) => {
        console.log(prodId, '......................................');
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(prodId) }).then((response) => {
                resolve(response)
            })
        })
    },


    getProductDetails:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(prodId)}).then((product)=>{
                resolve(product)
            })
        })
    },


    updateProduct: (prodId, proDetails) => {
        console.log(prodId, proDetails, 'fffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: objectId(prodId) }, {
                    $set: {
                        name: proDetails.name,
                        model: proDetails.model,
                        price: proDetails.price,
                        description: proDetails.description
                    }
                }).then((response) => {
                    resolve(response)
                })
        })
    },


    viewProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(prodId)}).then((product)=>{
                resolve(product)
            })
        })
    },


    getAllorders:()=>{
           console.log("oooooooooooooooooooo");
        return new Promise(async(resolve,reject)=>{

           let order=await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            console.log(order,"uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
           resolve(order)
        })
    }
}




