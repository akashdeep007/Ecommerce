import express from 'express';
import Product from "../models/productModel";
import { getToken } from '../util';

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await Product.find({});
    res.send(products);
});

router.post("/", async (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        brand: req.body.brand,
        category: req.body.category,
        price: req.body.price,
        countInStock: req.body.countInStock,
        description: req.body.description,
        rating: req.body.rating,
        numReviews: req.body.numReviews
    });
    
    const newProduct = await product.save();
    if(newProduct){
        return res.status(201).send({message: "New Product Created", data: newProduct});
    }else{
        return res.status(500).send({message: "error in creating product"});
    }
})
export default router;