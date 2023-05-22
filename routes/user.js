var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers');
var userHelpers=require('../helpers/user-helpers');



const {userHome,userLogin,signupPage,loginButton,loginHome,signupButton,sigupHome,homeButton,logoutButton,clickProduct,verifyLogin,cart,addToCart,changeQuantity,removeProduct,proceedToCheckout,placeOrder,orderCompletion,orderTable,viewOrders,myOrder} = require('../Controller/user-controller');
// const { route } = require('./admin');


/* GET home page. */
router.get('/',userHome) 

router.get('/login.html',userLogin)

router.post('/login',loginButton)

router.get('/home',loginHome)

router.get('home',homeButton)

router.get('/signup',signupPage)

router.post('/signup',signupButton)

router.get('/logout',logoutButton)

router.post('/click',clickProduct)

router.get('/cart',verifyLogin,cart)

router.post('/add-to-cart/:id',verifyLogin,addToCart)

router.post('/changeProductQuantity',changeQuantity)

router.post('/removeCartProduct',removeProduct)

router.get('/checkout',verifyLogin,proceedToCheckout)

router.post('/place-order',placeOrder)

router.get('/order-completion',verifyLogin,orderCompletion)

router.get('/view-order',viewOrders)

router.get('/orderTables',orderTable)

router.get('/my-order',myOrder)




module.exports = router;



