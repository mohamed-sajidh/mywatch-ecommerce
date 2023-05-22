//const {getAllorders}=require('../helpers/product-helpers')
const collection=require('../config/collection');
const userHelpers=require('../helpers/user-helpers');
const productHelpers=require('../helpers/product-helpers');
const adminHelpers=require('../helpers/admin-helpers');
//const categoryHelpers = require('../helpers/category-helpers')
//const { response, router } = require("../app");




var email="sajidhshaji4@gmail.com";
var password=12345;



module.exports={

    adminLogin(req,res){
        
        res.render('adminMain/adminLogin',{layout:'admin-layoutnew'})
    },


    validation(req,res,next){
        console.log(req.body);
        if(req.body.mail==email && req.body.pass==password){
          next()
        }
        else{
          res.render('adminMain/adminLogin',{error:"email or password is wrong",layout:'admin-layoutnew'})
        }
      },


    adminValidation(req,res){
        res.redirect('/admin/adminhome')
    },


    adminHome(req,res){
        res.render('adminMain/adminHome',{layout:'admin-layoutnew'})
    },

    dashboard(req,res){
        res.redirect('/admin/adminhome')
    },

    signOut(req,res){   
       res.redirect('/admin')
    },


    userTable(req,res){
        adminHelpers.getAllUsers().then((user)=>{
            res.render('adminMain/userTable',{layout:'admin-layoutnew',user})

        })
    },


    block(req,res){
        let userId=req.params.id
        adminHelpers.blockUser(userId).then(()=>{
            res.redirect('/admin/userTable')
        })
    },


    unblock(req,res){
        let userId=req.params.id
        adminHelpers.unblockUser(userId).then(()=>{
            res.redirect('/admin/userTable')
        })
    },


    productTable(req,res){
        productHelpers.getAllProduct().then((product)=>{
            
            res.render('adminMain/productTable',{layout:'admin-layoutnew',product})
        
        })
    },


    addProducts(req, res) {
        res.render('adminMain/addProduct', { layout: 'admin-layoutnew' })
    },


    addProductSubmit(req, res) {

        productHelpers.addProduct(req.body).then((id) => {

            let image = req.files.image

            image.mv('./public/product-images/' + id.id + '.jpg', (err, done) => {
                if (!err) {
                    res.redirect('/admin/productTable')
                }
                else {
                    console.log(err);
                    res.redirect('/admin/productTable')

                }
            })

        })

    },



    async editProduct(req,res){
        let product=await productHelpers.getProductDetails(req.body.id)
        res.render('adminMain/editProduct', { layout: 'admin-layoutnew',product})
    },


    editProductSubmit(req,res){
        
        productHelpers.updateProduct(req.params.id,req.body).then((response)=>{
            res.redirect('/admin/productTable')
        })
    },



    removeProduct(req,res){
        let prodId=req.params.id
        productHelpers.deleteProduct(prodId).then((response)=>{
            res.redirect('/admin/productTable')
        })
        
    },


    getOrders(req,res){
        productHelpers.getAllorders().then((order)=>{
            res.render('adminMain/allOrders', { layout: 'admin-layoutnew',order})
        })
        
    },


    viewOrderProduct(req,res){

        res.render('adminMain/viewProduct',{ layout: 'admin-layoutnew'})
    },


    cancelProduct(req,res){
       adminHelpers.cancelOrder(req.body.id).then(()=>{

        res.redirect('/admin/allOrders')

       })
       
    },


    categoryManagement(req , res){
    

        // categoryHelpers.getAllCategory().then((category)=>{
            res.render('adminMain/categoryManagement' , {layout : 'admin-layoutnew', })
        // })
    },



    addCategory(req , res){
        res.render('adminMain/addCategory' , {layout : 'admin-layoutnew'})
    }




// router.get('/delete-product/:id',(req,res)=>{
//   let prodId=req.params.id
//   console.log(prodId);
//   productHelpers.deleteProduct(prodId).then((response)=>{
//     res.redirect('/admin/product-table.html')  
//   })
// })









    


    // getOrders(req,res){
    //     getAllorders().then((order)=>{
    //         res.render('admin/AllOrders',{order})
    //     })
    // }
}