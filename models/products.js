const mongoose=require('mongoose')

const proschema=new mongoose.Schema({
    name:String,
    price:Number,
    description:String,
    category:String,
    image:String,
    stock:{type:Number,default:0},
})
const Pro=mongoose.model('products',proschema)
module.exports=Pro