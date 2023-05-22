var db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt');
const { ObjectId } = require('mongodb');
// const { response } = require('../app');
var objectId=require('mongodb').ObjectId


module.exports={


    addUser: (user) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).insertOne(user).then((res) => {

            })
        })
    },
   

    // getAlluser: () => {
    //     return new Promise(async (resolve, reject) => {
    //         let user = await db.get().collection(collection.USER_COLLECTION).find().toArray()
    //         resolve(user)
    //     })
    // },


    doSignup: (userData) => {
        userData.isBlocked = false
        console.log(userData.password);
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((res) => {
                console.log(res.insertedId,"1111111111111111111111111111111");
                resolve(res)
            })

        })

    },


    doLogin: (userData) => {
        console.log(userData.email, '>>>');

        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {

                        console.log("login success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("login failed");
                        reject({ status: false })
                    }
                })
            }
            else {
                console.log("login failed...................");
                reject({ status: false })

            }
        })
    },


    // blockUser: (userId) => {
    //     return new Promise((resolve, reject) => {
    //         db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, {
    //             $set: {
    //                 isBlocked: true
    //             }
    //         }).then((response) => {
    //             resolve()
    //         })
    //     })
    // },


    // unblockUser: (userId) => {
    //     return new Promise((resolve, reject) => {
    //         db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, {
    //             $set: {
    //                 isBlocked: false
    //             }
    //         }).then((response) => {
    //             resolve()
    //         })
    //     })
    // },


    addToCart:(prodId,userId)=>{
        let prodObj={
            item:ObjectId(prodId),
            quantity:1
        }
        console.log(prodId,"uuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(userId,"iiiiiiiiiiiiiiiiiiiiiiii");
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=> product.item==prodId)
                if(proExist!=-1){

                  

                  db.get().collection(collection.CART_COLLECTION).updateOne({'products.item':objectId(prodId)},
                    {
                         $inc:{'products.$.quantity':1}
                    }
                  
                    ).then(()=>{
                        
                        resolve()
                    })
                    
                }else{
                   db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId)},
                    {
                        
                            $push:{products:prodObj}
                        
                    }
                ).then((response)=>{
                    resolve()
                }) 
            }        


            }else{
                let cartObj={
                    user:objectId(userId),
                    products:[prodObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },


    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity',
                        user:1
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        user:1,
                        product:{
                            $arrayElemAt:['$product',0]
                        }
                    }
                }
                
                
            ]).toArray()
            // console.log(cartItems[0].products,"---------------------------------");
            console.log(cartItems,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            resolve(cartItems) 
            
            
        })
    },


    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0;
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(cart){
                console.log(cart,"cccccccccccccccccccc--------cccccccccccc");
                count=cart.products.length
            } 
            resolve(count) 
        }) 
    },


    changeProductQuantity: (details) => {
        details.count=parseInt(details.count)
        details.quantity=parseInt(details.quantity)
         console.log("55555555555555555555555555555555555555555");

        return new Promise((resolve, reject) => {
            if(details.count==-1 && details.quantity==1)
            {
                db.get().collection(collection.CART_COLLECTION).updateOne({_id:objectId(details.cart)},
                {
                    $pull:{products:{item:objectId(details.product)}}
                }
                ).then((response)=>{
                    resolve({removeProduct:true})
                })  
            }
            
            else{
                db.get().collection(collection.CART_COLLECTION).updateOne({_id:objectId(details.cart), 'products.item': objectId(details.product)},
                {
                    $inc: { 'products.$.quantity': details.count } 
                }

            ).then((response) => {
                console.log(response,"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
                resolve(true)
            })
            }       
            
        })
    },



    deleteProduct:(details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION).updateOne({_id:objectId(details.cart),user:objectId(details.user)},
            {
                $pull:{products:{item:objectId(details.product)}}
            }
            ).then((response)=>{
                resolve({removeCartProduct:true})
            })
        })
    },



    getTotalAmount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity',
                        // user:1
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                { 
                    $project:{
                        item:1,
                        quantity:1,
                        // user:1,
                        product:{
                            $arrayElemAt:['$product',0]
                        }
                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity','$product.price']}}
                    }
                }            
                
            ]).toArray()
           
            // console.log(cartItems[0].products,"---------------------------------");
            resolve(total[0]?.total) 
            //resolve(total)
        })
    },
    
    

    placeOrder:(order,products,totalPrice)=>{
        return new Promise((resolve,reject)=>{
            console.log(order,products,totalPrice);
            let status=order['payment-method']==='COD'?'placed':'pending'
            let orderObj={
                deliveryDetails:{
                    name:order.name,
                    phone:order.phone,
                    email:order.email,
                    state:order.state,
                    homeNumber:order.homeNumber,
                    streetNumber:order.streetNumber,
                    Town:order.Town,
                    zip:order.zip
                },
                userId:objectId(order.userId),
                paymentMethod:order['payment-method'],
                ...products,
                total:totalPrice,
                status:status,
                date:new Date()

            }

            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                db.get().collection(collection.CART_COLLECTION).deleteOne({user:objectId(order.userId)})
                resolve(response)
            })

        })
    },



    getCartProductList:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            resolve(cart)
        })
    },



    getOrderDeliveryDetails:(userId,OrderId)=>{
             console.log(userId,"``````````````````````````````````");
             console.log(OrderId,"``````````````````````````````````");

        return new Promise(async(resolve,reject)=>{


            // let orderdetail=await db.get().collection(collection.CART_COLLECTION).aggregate([
            //     {
            //         $match:{user:objectId(OrderId)}
            //     },
            //     {
            //         $unwind:'$products'
            //     },
            //     {
            //         $project:{
            //             item:'$products.item',
            //             quantity:'$products.quantity',
            //             // user:1
            //         }
            //     },
            //     {
            //         $lookup:{
            //             from:collection.PRODUCT_COLLECTION,
            //             localField:'item',
            //             foreignField:'_id',
            //             as:'product'
            //         }
            //     },
            //     { 
            //         $project:{
            //             item:1,
            //             quantity:1,
            //             // user:1,
            //             product:{
            //                 $arrayElemAt:['$product',0]
            //             }
            //         }
            //     }            
                
            // ]).toArray()   
            
            
            // console.log(orderdetail,"kkkkkkkkkkkkjjjjjjjjjrrrrrrrrrreeeeeeeeeeeeeeeeeeeee");


          let orderdetail= await db.get().collection(collection.ORDER_COLLECTION).find({userId:objectId(userId)}).toArray()
          console.log(orderdetail,"UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
          resolve(orderdetail)
        })

    },




    getOrderDetails:(ordId)=>{
        return new Promise(async(resolve , reject)=>{
            let orderDetails = db.get().collection(collection.ORDER_COLLECTION).findOne({_id:objectId(ordId)})

            resolve(orderDetails)
        })
    },


    getProductDetails:(ordId)=>{
        console.log(ordId);
        return new Promise(async(resolve , reject)=>{
            let productDetails = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{_id:objectId(ordId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:['$product',0]}
                    }
                }

               ]).toArray()

            console.log(productDetails , "nnnnnnnnnnnnnnnnnnn");
            resolve(productDetails)
        })
    }


    





    



    // getOrderDeliveryDetails:(OrderId)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         let orderDetails=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
    //             {
    //                 $match:{_id:objectId(OrderId)}
    //             },
    //             {
    //                 $unwind:'$deliveryDetails'
    //             },
    //             {
    //                 $project:{
    //                     deliveryDetails:{
    //                         paymentMethod:'$paymentMethod',
    //                         status:'$status'
    //                     }
                        
    //                 }
    //             }


    //         ]).toArray()
    //         console.log(orderDetails[0]?.deliveryDetails,'88888888888888888888888888');
    //         resolve(orderDetails[0]?.deliveryDetails)

    //     })
    // }
   
    

}

// getCartProducts:(userId)=>{
//     return new Promise(async(resolve,reject)=>{
//         let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
//             {
//                 $match:{user:objectId(userId)}
//             },
//             {
//                 $unwind:'$products'
//             },
//             {
//                 $project:{
//                     item:'$products.item',
//                     quantity:'$products.quantity',
//                     user:1
//                 }
//             },
//             {
//                 $lookup:{
//                     from:collection.PRODUCT_COLLECTION,
//                     localField:'item',
//                     foreignField:'_id',
//                     as:'product'
//                 }
//             },
//             {
//                 $project:{
//                     item:1,
//                     quantity:1,
//                     user:1,
//                     product:{
//                         $arrayElemAt:['$product',0]
//                     }
//                 }
//             }
            
            
//         ]).toArray()
//         // console.log(cartItems[0].products,"---------------------------------");
//         console.log(cartItems,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//         resolve(cartItems) 
        
        
//     })
// },




//   deleteCartProduct:(prodId,cartId)=>{
    //     console.log(userId,"///////////////////////////////////////////////////");
    //     console.log(prodId,"lllllllllllllllllllll");
    //     return new Promise(async(resolve,reject)=>{
    //         await db.get().collection(collection.CART_COLLECTION)
                
          
    //     })
    // } 

