import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

const app = express();
// har ek req me json ke formate me body aa rhi hai to use properly parse kro ye batata hai
app.use(express.json());

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    if (conn) {
        console.log('mongoDB connected');
    }
}
connectDB();

let counter = 0;

const apiCallCounters = (req,res, next)=>{
    counter++;
    console.log(`API Call:${counter}`);
    next()
}

app.use(apiCallCounters);

const checkApi = (req, res, next) => {
    const { apiKey } = req.query;

    if (apiKey === "samiksha") {
        next();
    }
    else {
        return res.status(401).json({
            success: false,
            message: 'Api key is invalid'
        })
    }
}


const validateParams = (req, res, next) => {
    const { title, description, price } = req.body;

    if (!title) {
        res.json({
            success: true,
            message: "title is missing"
        })
    }
    if (!description) {
        res.json({
            success: true,
            message: "description is missing"
        })
    }
    if (!price) {
        res.json({
            success: true,
            message: "price is missing"
        })
    }
    next();
}

app.post('/orders', checkApi, validateParams, async (req, res) => {

    res.json({
        success: true,
        data: {},
        message: 'orders created successfully'
    })
})

app.get('/orders', checkApi,  async (req, res) => {

    res.json({
        success: true,
        data: [],
        message: 'orders fetched successfully'
    })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})