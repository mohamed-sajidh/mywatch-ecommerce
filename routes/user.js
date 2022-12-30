var express = require('express');
var router = express.Router();
var productHelpers=require('../helpers/product-helpers');
var userHelpers=require('../helpers/user-helpers');



const {userHome,userLogin,signupPage,loginButton,loginHome,signupButton,sigupHome,homeButton,logoutButton} = require('../Controller/user-controller');


/* GET home page. */
router.get('/',userHome) 

router.get('/login.html',userLogin)

router.post('/login',loginButton)

router.get('/home',loginHome)

router.get('home',homeButton)

router.get('/signup',signupPage)

router.post('/signup',signupButton)

router.get('/home',sigupHome)

router.get('/logout',logoutButton)


module.exports = router;