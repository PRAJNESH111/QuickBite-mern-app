// const express = require('express')
// const Order = require('../models/Orders')
// const router = express.Router()


// router.post('/orderData', async (req, res) => {
//     let data = req.body.order_data
//     await data.splice(0,0,{Order_date:req.body.order_date})
//     console.log("1231242343242354",req.body.email)

//     //if email not exisitng in db then create: else: InsertMany()
//     let eId = await Order.findOne({ 'email': req.body.email })    
//     console.log(eId)
//     if (eId===null) {
//         try {
//             console.log(data)
//             console.log("1231242343242354",req.body.email)
//             await Order.create({
//                 email: req.body.email,
//                 order_data:[data]
//             }).then(() => {
//                 res.json({ success: true })
//             })
//         } catch (error) {
//             console.log(error.message)
//             res.send("Server Error", error.message)

//         }
//     }

//     else {
//         try {
//             await Order.findOneAndUpdate({email:req.body.email},
//                 { $push:{order_data: data} }).then(() => {
//                     res.json({ success: true })
//                 })
//         } catch (error) {
//             console.log(error.message)
//             res.send("Server Error", error.message)
//         }
//     }
// })

// router.post('/myOrderData', async (req, res) => {
//     try {
//         console.log(req.body.email)
//         let eId = await Order.findOne({ 'email': req.body.email })
//         //console.log(eId)
//         res.json({orderData:eId})
//     } catch (error) {
//         res.send("Error",error.message)
//     }
    

// });

// module.exports = router


// const express = require('express');
// const Order = require('../models/Orders');
// const router = express.Router();

// router.post('/orderData', async (req, res) => {
//     let data = req.body.order_data;
//     await data.splice(0, 0, { Order_date: req.body.order_date });
    
//     try {
//         let eId = await Order.findOne({ 'email': req.body.email });
        
//         if (!eId) {
//             await Order.create({
//                 email: req.body.email,
//                 order_data: [data]
//             });
//         } else {
//             await Order.findOneAndUpdate(
//                 { email: req.body.email },
//                 { $push: { order_data: data } }
//             );
//         }

//         res.json({ success: true });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ error: error.message });
//     }
// })

// router.post('/myOrderData', async (req, res) => {
//     try {
//         let eId = await Order.findOne({ 'email': req.body.email });
//         res.json({ orderData: eId });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// module.exports = router;
const express = require('express');
const Order = require('../models/Orders');
const router = express.Router();

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;

    // Add the order date at the beginning of the order_data array
    data.splice(0, 0, { Order_date: req.body.order_date });
    
    try {
        let eId = await Order.findOne({ 'email': req.body.email });
        
        if (!eId) {
            // If the user is not found, create a new order record
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
        } else {
            // If the user is found, update the existing order record
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error in /orderData route:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/myOrderData', async (req, res) => {
    try {
        let eId = await Order.findOne({ 'email': req.body.email });

        if (!eId) {
            return res.status(404).json({ error: "No orders found for this email." });
        }

        res.json({ orderData: eId });
    } catch (error) {
        console.error("Error in /myOrderData route:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
