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
        let quantity = req.body.qty

        const product = await Pro.findOne({ _id: id })
        
        if (!product) {
            return res.json({ "data": "Product not found" })
        }

        let total = product.price * quantity

        // Check if product is out of stock
        if (product.stock <= 0) {
            return res.json({ "data": "no stock", message: "Product is out of stock" })
        }

        // Check if requested quantity is available
        if (product.stock < quantity) {
            return res.json({ 
                "data": "no stock", 
                message: `Only ${product.stock} items available in stock` 
            })
        }

        const cart = await Cart.findOne({ product: id, user: uid })
        if (cart) {
            // Check if adding more would exceed stock
            const newTotalQuantity = cart.quantity + quantity
            if (newTotalQuantity > product.stock) {
                return res.json({ 
                    "data": "no stock", 
                    message: `Cannot add more items. Only ${product.stock} items available in stock` 
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
    const uid = req.body.uid
    const cart = await Cart.find({ user: uid })
    // console.log(cart)
    const date = Date.now()
    const amount = req.body.subtotal

    const sampledate = new Date(date);

    const formattedDate = sampledate.toLocaleString();
    console.log(formattedDate);



    var items = {
        user: uid,
        deliverystatus: "pending",
        date: formattedDate,
        amount: amount
    }
    const neworder = new Ordermain(items)
    await neworder.save()

    for (i of cart) {
        console.log(i.product);
        var items2 = {
            ordermain: neworder.id,
            product: i.product,
            quantity: i.quantity,
        }
        const newsuborder = new Ordersub(items2)
        await newsuborder.save()
        const pro = await Pro.findOne({ _id: i.product._id })
        const newstock = pro.stock - i.quantity
        var items = {
            stock: newstock
        }
        await Pro.findOneAndUpdate(
            { _id: i.product._id },
            { $set: items },
            { new: true }
        )
        await Cart.findOneAndDelete({ user: uid })
    }


    res.json({ "data": "ok" })
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