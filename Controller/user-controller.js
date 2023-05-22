const { addUser } = require("../helpers/user-helpers");
var productHelpers=require('../helpers/product-helpers');
const userHelpers = require("../helpers/user-helpers");
const adminHelpers=require("../helpers/admin-helpers");
const { getOrderDeliveryDetails } = require('../helpers/user-helpers')
// const { response, router } = require("../app");
const { Db, ObjectId } = require("mongodb");
const collection = require("../config/collection");



const Total=async(req)=>{
    let user= req.session.user
    
    
    return await userHelpers.getTotalAmount(user._id).then((total)=>{
        return total
    })
}

let Order

module.exports = {

    async userHome(req, res) {
        
        let user=req.session.user
        console.log(user,"aa...a....");
        let cartCount=null;
        if(req.session.user){
        cartCount=await userHelpers.getCartCount(req.session.user._id)
        }
        productHelpers.getAllProduct().then((product) => {
            res.render('user/userHome',{product,user,cartCount})
        })
    },

    userLogin(req,res){
        if(req.session.loggedIn){
            res.redirect('/')
        }else {
            console.log("called");
            res.render('user/userLogin')
        }
    },

    loginButton(req, res) {
        console.log(req.body, 'kkkkkkkkkkkkkkkkkkkkkk');

        userHelpers.doLogin(req.body).then((response) => {
            console.log(response);
            req.session.loggedIn=true
            req.session.user=response.user
            res.redirect('/')

        })
            .catch(() => {
                res.render('user/userLogin', { error: 'invalid username or password' })
            })
        //res.redirect('/home')
    },

    loginHome(req,res){

        
        productHelpers.getAllProduct().then((product) => {
            res.render('user/userHome',{product,user:req.session.user})
        })
    },

    homeButton(req,res){
       
        res.render('user/userHome',{product,cartCount})
    },

    signupPage(req,res){
        res.render('user/userSignup')
    },

    
    signupButton(req,res){
        console.log("llllllllll22020200");
        
        userHelpers.doSignup(req.body).then((response)=>{
            console.log(response,'..........sss..............sss......');
            req.session.loggedIn=true;
            req.session.user=response
            res.render('user/userLogin')
            // let id=response.toString()
           
            
            
           /*  console.log(response);
            res.render('user/userHome') */
        })
        //res.render('user/userHome')
    },


    logoutButton(req,res){
        req.session.destroy()
        res.redirect('/')
    },


    clickProduct(req,res){
        let user=req.session.user
        console.log(req.body.id);
        productHelpers.viewProduct(req.body.id).then((product)=>{
            console.log(product);
            res.render('user/productDetails',{product,user})
        })       
    },
    

    verifyLogin(req,res,next){
        if(req.session.loggedIn){
            next()
        }else{
            res.redirect('/login.html')
            // res.send("fdhfsgfgsh")
        }
    },


    async cart(req,res){
        
        // let total= await Total(req)
        let user=req.session.user
        let products=await userHelpers.getCartProducts(req.session.user._id)
        //let totalValue=await userHelpers.getTotalAmount(req.session.user._id)
      

        if(products.length!=0){
            
            userHelpers.getTotalAmount(req.session.user._id).then((total)=>{
                console.log(total , "ttttttttooooootttttttaaaaaaaallllllllllll");
                res.render('user/userCart',{products,user,total,page:'Shopping Cart'}) 
            })

        //console.log(totalValue,".......qqqqqqqqqqq..............qqqqqqqqqqq");
        // res.render('user/userCart',{products,user,page:'Shopping Cart'}) 
        }else{
            
            res.render('user/userCart',{user,page:'Cart is empty'})
            // res.send("your cart is empty")
        }
        // res.send("dfhghsdgfgshh")
    },


    addToCart(req,res){
        console.log("api callllllllllllllllllllllllllllllllllllllllllllllllllllllllll",req.params.id);
        userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
            res.redirect('/')
            // res.redirect('/')
        })       
    },


    changeQuantity(req,res,next){
        console.log('hghjfhgfghbgvfvfcfjvh fgcfvjgfcfvhbgvvhvgv');
        console.log(req.body);
        userHelpers.changeProductQuantity(req.body).then((response)=>{
            console.log(response);
            res.json(response)
        })
    },


    removeProduct(req,res){
        console.log(req.body,"&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        userHelpers.deleteProduct(req.body).then((response)=>{
            res.json(response)
        })
    },


    async proceedToCheckout(req,res){
        let products=await userHelpers.getCartProducts(req.session.user._id)
         userHelpers.getTotalAmount(req.session.user._id).then((total)=>{
            res.render('user/userCheckout',{user:req.session.user,total,products})

         }).catch(()=>{
            console.log("????????????????????????????????????????????????????????????????????????????????????????????????????????????????????");
            res.render('user/userCheckout',{user:req.session.user})
         })
        //let user=req.session.user
    },


    async placeOrder(req,res){

        let products=await userHelpers.getCartProductList(req.body.userId)
        let totalPrice=await userHelpers.getTotalAmount(req.body.userId)
        userHelpers.placeOrder(req.body,products,totalPrice).then((response)=>{
            // Order=response.insertedId
            req.session.orderId = response.insertedId
            console.log(response,'00000000000000000000000000000000000000000');
            res.json({status:true})
        })

        console.log(req.body,"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++11111111111");
    },



    async orderCompletion(req,res){
        ordId = req.session.orderId
        let orderDetails = await userHelpers.getOrderDetails(ordId)
        let productDetails = await userHelpers.getProductDetails(ordId)
        console.log(productDetails , "ssssssssssssssssssssssssssssssssssssssssssss");
        res.render('user/orderConfirm',{user:req.session.user, orderDetails , productDetails})
    },


    viewOrders(req,res){
        // console.log(req.params.id,"aaaaaaaaaaaaaaaaaaaaaaaa");
        getOrderDeliveryDetails(req.session.user._id,req.params.id).then((order)=>{
            res.render('user/orderCompletion',{order,user:req.session.user})
        res.render('user/orderCompletion')
    })
    },



    // orderCompletion(req,res){

    //     console.log(req.body);
    //      getOrderDeliveryDetails(req.session.user._id,req.body._id).then((order)=>{
    //         console.log(order,"9999999999999999999999");
    //         res.render('user/orderCompletion',{order,user:req.session.user})
    //     })

    // },


    
    orderTable(req,res){
        res.render('user/orderTables')
    },


    myOrder(req,res){
        getOrderDeliveryDetails(req.session.user._id,req.body._id).then((order)=>{
            console.log(order,"9999999999999999999999");
            res.render('user/orderCompletion',{order,user:req.session.user})
        res.render('user/orderCompletion')
    })
    }





   


    //  removeProduct(req,res){
    //     let prodId=req.params.id
    //     userHelpers.deleteCartProduct(req.session.user._id,prodId).then((response)=>{
    //         console.log(prodId,"2.2.2.2..2222222222222222............");

    //         res.redirect('/user/userCart') 
    //     })
    // }, 


    

    
}


