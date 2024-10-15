const mongoose=require('mongoose')

const ordersubschema=new mongoose.Schema({
    ordermain:{type:mongoose.Schema.Types.ObjectId,ref:'order'},
    product:{type:mongoose.Schema.Types.ObjectId,ref:'products'},
    quantity:String
})
const Ordersub=mongoose.model('ordersub',ordersubschema)
module.exports=Ordersub