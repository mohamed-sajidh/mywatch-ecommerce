// const { default: swal } = require("sweetalert");
const { response } = require("../../app")



function addToCart(prodId){
    console.log(prodId,'kkkkkkkkkllllllllllliiiiiiii');
    $.ajax({
        url:'/add-to-cart/'+prodId,
        method:'post',
        success:(response)=>{
            console.log('iiiiiiioooooooooooo');
            swal("Good job!", "1 item added to your cart!", "success");
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $('#cart-count').html(count)
           

            }
        }
    })
}


function removeCartProduct(cartId,prodId,userId){
    console.log(userId,"10000000000000000000000000000000000000000000");
    console.log();
    $.ajax(
        {
            url:'/removeCartProduct',
            data:{
                cart:cartId,
                product:prodId,
                user:userId
            },
            method:'post',
            success:(response)=>{

                if(response.removeCartProduct){
                   alert("Are you sure you want to delete this item?")
                    location.reload()
                }
            }
        }
    )
}


function addCart(prodId){
    $.ajax({
        url:'/add-cart/'+prodId,
        method:'post',
        success:(response)=>{
            swal("Good job!", "1 item added to your cart!", "success");
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $('#cart-count').html(count)
           

            }
        }
    })
}


