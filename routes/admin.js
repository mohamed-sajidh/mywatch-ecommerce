var express = require('express');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')
var productHelpers=require('../helpers/product-helpers');
const { Admin } = require('mongodb');



var email="sajidhshaji4@gmail.com";
var password=12345;

function validation(req,res,next){
  console.log(req.body);
  if(req.body.mail==email && req.body.pass==password){
    next()
  }
  else{
    res.render('admin/adminLogin',{error:"email or password is wrong",layout:null})
  }
}

router.get('/',(req,res)=>{
  res.render('admin/adminLogin',{layout:null})
})


router.post('/adminlogin',validation,(req,res)=>{
  res.render('admin/adminHome',{layout:'admin-layout'})
})


router.get('/basic-table.html',(req,res)=>{
  userHelpers.getAlluser().then((user)=>{
    res.render('admin/adminTable',{layout:'admin-layout',user})
  })
 // res.render('admin/adminTable',{layout:'admin-layout'})
})

router.get('/product-table.html',(req,res)=>{
  productHelpers.getAllProduct().then((product)=>{
    console.log(product,"77777777777777777777777777777777777");
    res.render('admin/productTable',{layout:'admin-layout',product}) 
  })
})

router.get('/addProduct',(req,res)=>{
  res.render('admin/addProductForm',{layout:'admin-layout'})
})

router.post('/addProduct-Submit',(req,res)=>{
  console.log(req.files.image); 

  productHelpers.addProduct(req.body).then((id)=>{
    
    console.log(req.body);
    let image=req.files.image
    image.mv('./public/product-images/'+id.id+'.jpg',(err,done)=>{
      if(!err){
    res.redirect('/admin/product-table.html')  
      }
      else{
        console.log(err);
    res.redirect('/admin/product-table.html')  

      }
    })
  
  })
 
})

router.get('/delete-product/:id',(req,res)=>{
  let prodId=req.params.id
  console.log(prodId);
  productHelpers.deleteProduct(prodId).then((response)=>{
    res.redirect('/admin/product-table.html')  
  })
})


router.post('/edit-product',async (req,res)=>{
  let product=await productHelpers.getProductDetails(req.body.id)
  console.log(product);
  res.render('admin/editProduct',{ layout:'admin-layout',product})
})

router.post('/edit-product/:id',(req,res)=>{
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin/product-table.html')
  })
})

router.get('/blockuser/:id',(req,res)=>{
  let userId=req.params.id
  userHelpers.blockUser(userId).then(()=>{
    res.redirect('/admin/basic-table.html')
  })
})

router.get('/unblockuser/:id',(req,res)=>{
  let userId=req.params.id
  userHelpers.unblockUser(userId).then(()=>{
    res.redirect('/admin/basic-table.html')
  })
})

router.get('/logout',(req,res)=>{
  res.redirect('/admin')
})

module.exports = router;


