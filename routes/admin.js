var express = require('express');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')
var productHelpers=require('../helpers/product-helpers');
const { Admin } = require('mongodb');
// const { route } = require('./user');
const { blockUser } = require('../helpers/user-helpers');

// const path=require('path')
// const multer  = require('multer');
// const storage=multer.diskStorage({
//   destination: (req,file,cb) =>{
//     cb(null,'/public/product-images')
//   },
//   filename:(req,file,cb)=>{
//     console.log(file);
//     cb(null,Date.now() + path.extname(file.originalname))
//   }
// })
// const upload = multer({storage: storage })


const{getOrders,adminLogin,validation,adminValidation,adminHome,dashboard,userTable,block,unblock,productTable,addProducts,addProductSubmit,editProduct,editProductSubmit,removeProduct,viewOrderProduct,signOut,cancelProduct , categoryManagement , addCategory}=require('../Controller/admin-controller');

const { addProduct, deleteProduct, viewProduct } = require('../helpers/product-helpers');
const { orderTable } = require('../Controller/user-controller');





router.get('/',adminLogin),

router.post('/adminlogin',validation,adminValidation),

router.get('/adminhome',adminHome),

router.get('/dashboard',dashboard),

router.get('/signout',signOut),

router.get('/userTable',userTable),

router.get('/blockuser/:id',block),

router.get('/unblockuser/:id',unblock),

router.get('/productTable',productTable),

router.get('/add-product',addProducts)

router.post('/addProduct-Submit',addProductSubmit)

router.post('/edit-product',editProduct)

router.post('/edit-product/:id',editProductSubmit)

router.get('/delete-product/:id',removeProduct)

router.get('/orderTable',getOrders)

router.get('/view-product',viewOrderProduct)

router.post('/cancel-product',cancelProduct)

router.get('/category' , categoryManagement)

router.get('/add-category' , addCategory)








  
//  router.get('/basic-table.html',(req,res)=>{
//    userHelpers.getAlluser().then((user)=>{
//      res.render('admin/adminTable',{layout:'admin-layout',user})
//    })
//  // res.render('admin/adminTable',{layout:'admin-layout'})
// })

// router.get('/product-table.html',(req,res)=>{
//   productHelpers.getAllProduct().then((product)=>{
//     console.log(product,"77777777777777777777777777777777777");
//     res.render('admin/productTable',{layout:'admin-layout',product}) 
//   })
// })

// router.get('/addProduct',(req,res)=>{
//   res.render('admin/addProductForm',{layout:'admin-layout'})
// })

// router.post('/addProduct-Submit',(req,res)=>{
//   console.log(req.files.image); 

//   productHelpers.addProduct(req.body).then((id)=>{
    
//     console.log(req.body);
//     let image=req.files.image
//     image.mv('./public/product-images/'+id.id+'.jpg',(err,done)=>{
//       if(!err){
//     res.redirect('/admin/product-table.html')  
//       }
//       else{
//         console.log(err);
//     res.redirect('/admin/product-table.html')  

//       }
//     })
  
//   })
 
// })

// router.get('/delete-product/:id',(req,res)=>{
//   let prodId=req.params.id
//   console.log(prodId);
//   productHelpers.deleteProduct(prodId).then((response)=>{
//     res.redirect('/admin/product-table.html')  
//   })
// })


// router.post('/edit-product',async (req,res)=>{
//   let product=await productHelpers.getProductDetails(req.body.id)
//   console.log(product);
//   res.render('admin/editProduct',{ layout:'admin-layout',product})
// })

// router.post('/edit-product/:id',(req,res)=>{
//   productHelpers.updateProduct(req.params.id,req.body).then(()=>{
//     res.redirect('/admin/product-table.html')
//   })
// })

// router.get('/blockuser/:id',(req,res)=>{
//   let userId=req.params.id
//   userHelpers.blockUser(userId).then(()=>{
//     res.redirect('/admin/basic-table.html')
//   })
// })

// router.get('/unblockuser/:id',(req,res)=>{
//   let userId=req.params.id
//   userHelpers.unblockUser(userId).then(()=>{
//     res.redirect('/admin/basic-table.html')
//   })
// })

// router.get('/logout',(req,res)=>{
//   res.redirect('/admin')
// })



// router.get('/Userorders.html',getOrders)

module.exports = router;


