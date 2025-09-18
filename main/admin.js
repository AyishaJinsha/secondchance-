const express = require('express')

const router = express.Router()
router.use(express.urlencoded({ extended: true }))

const db = require('../config/db')
db()
const Pro = require('../models/products')
const Sign = require('../models/signup')
const Store = require('../models/storeadmin')
const Delstaff = require('../models/delstaff')
const Adminlog = require('../models/adminlogin')
const Ordermain = require('../models/order')
const Ordersub = require('../models/ordersub')




const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({ storage })

router.post('/productpost', upload.single('fl'), async (req, res) => {
    const name = req.body.pname
    const price = req.body.price
    const description = req.body.desc
    const category = req.body.category
    const image = req.file.path

    var items = {
        name: name,
        price: price,
        description: description,
        category: category,
        image: image
    }

    const newpro = new Pro(items)
    await newpro.save()

    res.json({ "data": "ok" })

})

router.get('/edit/:id', async (req, res) => {
    const id = req.params.id
    const data = await Pro.findOne({ _id: id })
    res.json({ data: data })
})

router.post('/postedit', upload.single('fl'), async (req, res) => {
    const name = req.body.pname
    const price = req.body.price
    const description = req.body.desc
    var id = req.body.editid

    var items = {

        name: name,
        price: price,
        description: description,

    }

    if (req.file) {
        const image = req.file.path
        items.image = image
    }

    await Pro.findOneAndUpdate(
        { _id: id },
        { $set: items },
        { new: true })

    console.log(req.body);
    res.json({ "data": "ok" })
})

router.post('/delete', async (req, res) => {
    const id = req.body.id
    console.log();
    await Pro.findOneAndDelete({ _id: id })
    res.json({ "data": "del" })
})

router.get('/getuser', async (req, res) => {
    const data = await Sign.find()
    res.json({ data: data })
})
router.post('/removeuser', async (req, res) => {
    const id = req.body.id
    console.log();
    await Sign.findOneAndDelete({ _id: id })
    res.json({ "data": "rem" })
})
router.post('/createstore', async (req, res) => {
    const username = req.body.uname
    const password = req.body.pass
    const mobile = req.body.mob
    const store = await Store.findOne({ username: username })
    const oldlog = await Adminlog.findOne({ username: username })

    console.log(store);
    if (store || oldlog) {
        console.log("ssss");
        res.json({ "data": "exist" })
    }
    else {
        console.log(req.body);
        var items = {
            username: username,
            password: password,
            mobile: mobile
        }
        const newstore = new Store(items)
        await newstore.save()

        var items2 = {
            username: username,
            password: password,
            type: "store admin"
        }

        const newlogin = new Adminlog(items2)
        await newlogin.save()


        res.json({ "data": "ok" })
    }
})
router.post('/createdelivery', async (req, res) => {
    const username = req.body.uname
    const password = req.body.pass
    const mobile = req.body.mob
    const del = await Delstaff.findOne({ username: username })
    const oldlog = await Adminlog.findOne({ username: username })

    console.log(del);
    if (del || oldlog) {
        console.log("ssss");
        res.json({ "data": "exist" })
    }
    else {
        console.log(req.body);
        var items = {
            username: username,
            password: password,
            mobile: mobile
        }
        const newstore = new Delstaff(items)
        await newstore.save()

        var items2 = {
            username: username,
            password: password,
            type: "delivery staff"
        }

        const newlogin = new Adminlog(items2)
        await newlogin.save()

        res.json({ "data": "ok" })
    }
})

router.post('/createadmin', async (req, res) => {
    const username = req.body.uname
    const password = req.body.pass
    const oldlog = await Adminlog.findOne({ username: username })

    if (oldlog) {
        res.json({ "data": "exist" })
    }
    else {
        var items = {
            username: username,
            password: password,
            type: "admin"
        }

        const newlogin = new Adminlog(items)
        await newlogin.save()

        res.json({ "data": "ok" })
    }
})

// Admin password reset/upsert helper
router.post('/resetadmin', async (req, res) => {
    try {
        const username = req.body.uname
        const password = req.body.pass
        if(!username || !password){
            return res.status(400).json({ data: 'invalid' })
        }
        const result = await Adminlog.findOneAndUpdate(
            { username: username },
            { $set: { password: password, type: 'admin' } },
            { new: true, upsert: true }
        )
        res.json({ data: 'ok', username: result.username })
    } catch (err) {
        console.error('resetadmin error:', err)
        res.status(500).json({ data: 'error' })
    }
})

router.post('/adminlogin', async (req, res) => {
    console.log(req.body);
    const username = req.body.uname
    const password = req.body.pass

    const logdata = await Adminlog.findOne({ username: username, password: password })
    if (logdata) {
        if (logdata.type == "store admin") {
            res.json({ "data": "store admin", aid: logdata.username })
        }
        else if (logdata.type == "delivery staff") {
            res.json({ "data": "delivery staff", aid: logdata.username })
        }
        else if (logdata.type == "admin") {
            res.json({ "data": "admin", aid: logdata.username })
        }
    }
    else {
        res.json({ "data": "not found" })
    }
})
router.get('/getsales', async (req, res) => {
    const orders = await Ordermain.find()
    const len = orders.length

    const suborder = await Ordersub.find().populate('product')
    const all = []
    for (i of suborder) {
        const productID = i.product.name
        const quantity = Number(i.quantity)

        const existingProduct = all.find(item => item.product === productID); // Check if product already exists
        if (existingProduct) {
            // If it exists, update the quantity
            existingProduct.quantity += quantity;
        }
        else {
            // all[productID] = quantity
            all.push({
                "product": productID,
                "quantity": quantity
            })
        }
    }
    console.log(all);
    // console.log(orders);

    res.json({ data: all, len: len })
})

router.get('/totalrevenue', async (req, res) => {
    const orders = await Ordermain.find()
    let totalrevenue = 0

    const suborder = await Ordersub.find().populate('product')
    const all = []

    for (i of orders) {
        totalrevenue += i.amount
    }
    console.log(totalrevenue);

    for (i of suborder) {
        const productID = i.product.name
        const quantity = Number(i.quantity)

        const existingProduct = all.find(item => item.product === productID); // Check if product already exists
        if (existingProduct) {
            // If it exists, update the quantity
            existingProduct.quantity += quantity;
            existingProduct.amounts += quantity * i.product.price
        }
        else {
            // all[productID] = quantity
            all.push({
                "product": productID,
                "quantity": quantity,
                "amounts": quantity * i.product.price
            })
        }
    }
    console.log(all);



    res.json({ data: all, totalrevenue: totalrevenue })
})

router.get('/getstore',async(req,res)=>{
    const stores=await Store.find()
    res.json({data:stores})
})
router.get('/getdel',async(req,res)=>{
    const dels=await Delstaff.find()
    res.json({data:dels})
})
router.post('/removestore', async (req, res) => {
    const id = req.body.id
    console.log();
    const dels=await Store.findOne({_id:id})
    await Adminlog.findOneAndDelete({username:dels.username})
    await Store.findOneAndDelete({ _id: id })
    res.json({ "data": "rem" })
})
router.post('/removedel', async (req, res) => {
    const id = req.body.id
    console.log();
    const dels=await Delstaff.findOne({_id:id})
    await Adminlog.findOneAndDelete({username:dels.username})
    await Delstaff.findOneAndDelete({ _id: id })
    res.json({ "data": "rem" })
})





module.exports = router