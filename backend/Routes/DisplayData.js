// const express = require('express')

// const router = express.Router()

// router.post('/foodData', async (req, res) => {
//     try {
//         // console.log( JSON.stringify(global.foodData))
//         // const userId = req.user.id;
//         // await database.listCollections({name:"food_items"}).find({});
//         res.send([global.foodData, global.foodCategory])
//     } catch (error) {
//         console.error(error.message)
//         res.send("Server Error")

//     }
// });
// module.exports = router;

const express = require('express');
const router = express.Router();

router.post('/foodData', async (req, res) => {
    try {
        res.send([global.foodData2,global.foodCategory])
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
