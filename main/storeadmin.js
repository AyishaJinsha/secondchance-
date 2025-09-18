const express = require('express')

const router = express.Router()
router.use(express.urlencoded({ extended: true }))

const db = require('../config/db')
db()
const Pro = require('../models/products')
const Sign = require('../models/signup')
const Log = require('../models/login')
const Cart = require('../models/cart')
const Ordermain = require('../models/order')
const Ordersub = require('../models/ordersub')


router.get('/getproduct', async (req, res) => {
    const pro = await Pro.find()
    res.json({ data: pro })
})


router.post('/stockpost', async (req, res) => {
    const stock = req.body.newstock
    const id = req.body.newid

    var items = {
        stock: stock
    }


    await Pro.findOneAndUpdate(
        { _id: id },
        { $set: items },
        { new: true })

    res.json({ "data": "ok" })
})

router.get('/storegetorder', async (req, res) => {


    const order = await Ordermain.find().populate('user')
    console.log(order);

    
    const fullorder = []
    let alltotal=0

    for (i of order) {
        const ordersub = await Ordersub.find({ ordermain: i._id }).populate('product')
        // console.log(ordersub);
        alltotal += i.amount
        const mainOrder = {
            "mainid": i._id,
            "user": i.user,
            "status": i.deliverystatus,
            "date": i.date,
            "subtotal": i.amount,
            "newsub": []
        };


        for (j of ordersub) {
            let newsub = {
                "subid": j._id,
                "product": j.product,
                "quantity": j.quantity
            };
            mainOrder.newsub.push(newsub);
        }
        fullorder.push(mainOrder)
    }

    // console.log(alltotal);
    


    res.json({ data: fullorder,subtotal:alltotal })



})
router.post('/confirmpost', async (req, res) => {
    const newstatus = req.body.newstatus
    const id = req.body.id

    var items = {
        deliverystatus: newstatus
    }

    await Ordermain.findOneAndUpdate
        ({ _id: id }, 
        { $set: items }, 
        { new: true })
    res.json({ "data": "ok" })
})





module.exports = router