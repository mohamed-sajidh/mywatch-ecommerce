const { addUser } = require("../helpers/user-helpers");
var productHelpers=require('../helpers/product-helpers');
const userHelpers = require("../helpers/user-helpers");
const { response } = require("../app");



module.exports = {

    userHome(req, res) {
        let user=req.session.user
        console.log(user,"aa...a....");
        productHelpers.getAllProduct().then((product) => {
            res.render('user/userHome',{product,user})
        })
    },

    userLogin(req,res){
        res.render('user/userLogin')
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
        res.render('user/userHome') 
    },

    homeButton(req,res){
        res.render('user/userHome')
    },

    signupPage(req,res){
        res.render('user/userSignup')
    },

    
    signupButton(req,res){
        console.log("llllllllll");
        console.log(req.files.image);
        userHelpers.doSignup(req.body).then((response)=>{
            let id=response.toString()
            let image=req.files.image
            image.mv('./public/user-images/'+id+'.jpg',(err,done)=>{
                if(!err){
                    console.log(response);
                    res.render('user/userHome')
                }
                console.log(err);
                res.render('user/userHome')
            })
            
           /*  console.log(response);
            res.render('user/userHome') */
        })
        //res.render('user/userHome')
    },


    sigupHome(req,res){
        res.render('user/userHome')
    },


    logoutButton(req,res){
        req.session.destroy()
        res.redirect('/')
    }




    
}


