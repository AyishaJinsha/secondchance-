const express = require('express')

const router = express.Router()
router.use(express.urlencoded({ extended: true }))
const Pro = require('../models/products')
const Sign = require('../models/signup')
const Log = require('../models/login')
const Cart = require('../models/cart')
const Ordermain = require('../models/order')
const Ordersub = require('../models/ordersub')





router.get('/getproduct', async (req, res) => {
    const cat = req.params.cat
    const pro = await Pro.find()
    res.json({ data: pro })
})

router.post('/signup', async (req, res) => {
    // console.log(req.body);

    const email = req.body.email
    const uname = req.body.uname
    const password = req.body.pass
    const mobile = req.body.mobile

    const exist = await Sign.findOne({ mail: email })
    if (exist) {
        res.json({ "data": "exist" })
    }
    else {
        var items = {
            mail: email,
            password: password,
            username: uname,
            mobile: mobile
        }

        const newsign = new Sign(items)
        await newsign.save()

        const signs = await Sign.findOne({ mail: email })

        console.log(signs._id);


        var items2 = {
            mail: email,
            user: signs._id,
            password: password,
            type: "user"
        }

        console.log(signs);


        const newlogin = new Log(items2)
        await newlogin.save()
        res.json({ "data": "ok", uid: signs._id })
    }

})


router.post('/login', async (req, res) => {
    const mail = req.body.mail
    const pass = req.body.pass

    console.log(req.body);


    const logdata = await Log.findOne({ mail: mail, password: pass })
    // console.log(logdata);


    if (logdata) {
        console.log(logdata.user);

        res.json({ "data": "ok", uid: logdata.user })
    }
    else {
        res.json({ "data": "not found" })
    }

})
router.get('/prospec/:id', async (req, res) => {
    const proid = req.params.id
    const pro = await Pro.findOne({ _id: proid })
    res.json({ data: pro })
})

router.post('/addcart', async (req, res) => {
    try {
        const id = req.body.id
        const uid = req.body.uid
        console.log(req.body);
        let quantity = Number(req.body.qty)

        const product = await Pro.findOne({ _id: id })
        
        if (!product) {
            return res.json({ "data": "Product not found" })
        }

        const availableStock = Number(product.stock || 0)
        let total = product.price * quantity

        // Check if product is out of stock
        if (availableStock <= 0) {
            return res.json({ "data": "no stock", message: "Product is out of stock" })
        }

        // Check if requested quantity is available
        if (availableStock < quantity) {
            return res.json({ 
                "data": "no stock", 
                message: `Only ${availableStock} items available in stock` 
            })
        }

        const cart = await Cart.findOne({ product: id, user: uid })
        if (cart) {
            // Check if adding more would exceed stock
            const newTotalQuantity = Number(cart.quantity) + quantity
            if (newTotalQuantity > availableStock) {
                return res.json({ 
                    "data": "no stock", 
                    message: `Cannot add more items. Only ${availableStock} items available in stock` 
                })
            }
            
            quantity = newTotalQuantity
            total = quantity * product.price
            var items = {
                quantity: quantity,
                total: total
            }

            await Cart.findOneAndUpdate(
                { product: id, user: uid },
                { $set: items },
                { new: true }
            )
            res.json({ "data": "ok", message: "Cart updated successfully" })
        }
        else {
            var items = {
                product: id,
                user: uid,
                quantity: quantity,
                total: total
            }

            const newcart = new Cart(items)
            await newcart.save()
            res.json({ "data": "ok", message: "Item added to cart successfully" })
        }
    } catch (error) {
        console.error('Error in addcart:', error);
        res.json({ "data": "error", message: "Server error occurred" })
    }
})
router.get('/getcart/:uid', async (req, res) => {
    const uid = req.params.uid
    const cart = await Cart.find({ user: uid }).populate('product')
    const user = await Log.findOne({ user: uid })
    const usermail = user.mail
    // console.log(usermail);


    // console.log(cart);

    let subtotal = 0
    for (const i of cart) {
        subtotal += i.total

    }

    res.json({ data: cart, subtotal: subtotal, usermail: usermail })
})

router.get('/cartdelete/:id', async (req, res) => {
    await Cart.findOneAndDelete({ _id: req.params.id })
    res.json({ "data": "ok" })
})
router.post('/postorder', async (req, res) => {
    try {
        const uid = req.body.uid
        const cart = await Cart.find({ user: uid })
        const date = Date.now()
        const amount = Number(req.body.subtotal || 0)

        const sampledate = new Date(date);
        const formattedDate = sampledate.toLocaleString();

        const orderItems = {
            user: uid,
            deliverystatus: "pending",
            date: formattedDate,
            amount: amount
        }
        const neworder = new Ordermain(orderItems)
        await neworder.save()

        for (const cartItem of cart) {
            const productId = cartItem.product
            const quantity = Number(cartItem.quantity)

            const items2 = {
                ordermain: neworder._id,
                product: productId,
                quantity: quantity,
            }
            const newsuborder = new Ordersub(items2)
            await newsuborder.save()

            const pro = await Pro.findOne({ _id: productId })
            const currentStock = Number(pro?.stock || 0)
            const newstock = Math.max(0, currentStock - quantity)
            await Pro.findOneAndUpdate(
                { _id: productId },
                { $set: { stock: newstock } },
                { new: true }
            )
        }

        await Cart.deleteMany({ user: uid })

        res.json({ "data": "ok", orderId: neworder._id })
    } catch (error) {
        console.error('Error in postorder:', error)
        res.status(500).json({ "data": "error" })
    }
})
router.get('/getorder/:uid/:index', async (req, res) => {
    const uid = req.params.uid
    const index = req.params.index
    let order = []
    if (index == 0) {
        order = await Ordermain.find({ user: uid })
    }
    else if (index == 1) {
        order = await Ordermain.find({ user: uid, deliverystatus: "pending" })
    }
    else if (index == 2) {
        order = await Ordermain.find({ user: uid, deliverystatus: "confirmed" })
    }
    else if (index == 3) {
        order = await Ordermain.find({ user: uid, deliverystatus: "Delivered" })
    }
    else if (index == 4) {
        order = await Ordermain.find({ user: uid, deliverystatus: "On it's way" })
    }
    const fullorder = []
    for (i of order) {
        const ordersub = await Ordersub.find({ ordermain: i._id }).populate('product')
        // console.log(ordersub);
        const mainOrder = {
            "mainid": i._id,
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
    // console.log(fullorder); 
    console.log(order);
    res.json({ data: fullorder })
})

module.exports = router