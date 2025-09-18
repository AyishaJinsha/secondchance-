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



router.get('/showorder', async (req, res) => {
    const order = await Ordermain.find().populate('user')
    // console.log(order);


    const fullorder = []

    for (i of order) {
        const ordersub = await Ordersub.find({ ordermain: i._id }).populate('product')
        // console.log(ordersub);
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

    // const newfull=filter(fullorder.item=>fullorder.status)
    const neworders = fullorder.filter(item => item.status !== "pending")
    console.log(neworders);


    // console.log(fullorder);
    res.json({ data: neworders })

})

router.post('/changestatus', async (req, res) => {
    const newstatus = req.body.value
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