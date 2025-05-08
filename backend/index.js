const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS
const corsOptions = {
    origin: [
        'https://gofood-frontend-cyvsjt97f-prajnesh111s-projects.vercel.app',
        'https://gofood-frontend-2v48v50dw-prajnesh111s-projects.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
};

app.use(cors(corsOptions));

app.use(express.json());

// Assuming your db connection and global variables are set here
global.foodData = require('./db')(function call(err, data, CatData) {
    if (err) console.log(err);
    global.foodData = data;
    global.foodCategory = CatData;
});

// Define your routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData')); // Corrected route path

// Start the server
app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});


