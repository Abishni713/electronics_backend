const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


const connectDB = async ()=>{
   try{
       const conn = await mongoose.connect("mongodb://127.0.0.1:27017/electronics");
       console.log("Connected Mongo DB " + conn.connection.name);
  }catch(e){
       console.log("Error" + e.message);
  }
}
connectDB();




const productSchema = new mongoose.Schema({
   id:Number,
   name:String,
   qty:Number
});

const Product = mongoose.model("Products",productSchema);

app.get("/",(req,res)=>{
 res.send("Hello World");
});


app.get("/Products",async(req,res)=>{
 console.log("tap");
 try{
const Products = await Product.find({},{_v:0,_id:0});
 console.log(Products);
 res.json(Products);
 }catch(err){
console.log("Error" + err.message);
 res.status(500).json({msg:err.message});
}
})
app.get("/Products/:pid",async(req,res)=>{

 const id = parseInt(req.params.pid);
try{
const Product = await Product.findOne({id:id},{_v:0,_id:0});
if(!Product){
 res.status(404).json({msg:"Product Not Found"});
 }
 res.json(Product);
 }catch(err){
console.log("Error" + err.message);
 res.status(500).json({msg:err.message});
 }
 
})


app.post("/Products",async(req,res)=>{
 const {id,name,qty}=req.body;
 const newProduct = new Product({id,name,qty}) ;
 
 await newProduct.save();
 res.json({Product:newProduct,msg:"Product added successfully"});
 
});

app.put("/Products/:pid",async(req,res)=>{
 const id = parseInt(req.params.pid);

 const {name} = req.body;

try{
     const result = await Product.updateOne({id:id},{
 $set:{
 name : req.body.name
 }
 });
 if(result.matchedCount == 0){
 res.status(404).json({err:"Product Not Found"});
 }else{

 console.log(result);
 res.json({msg:"Product updated successfully"});
 }
 }catch(e){
 console.log("Error" + e.message);
 res.status(500).json({msg:e.message})
}


});

app.delete("/Products/:pid",async(req,res)=>{
     const id = parseInt(req.params.pid);

 
 try{
const result = await Product.deleteOne({id:id});
 if(result.deletedCount == 0){
 res.status(404).json({err:"Product Not Found"});
 }else{

 res.json({msg:"Product Deleted successfully"});
 }
 }catch(e){
console.log("Error" + err.message);
 res.status(500).json({msg:err.message});
 }
});


app.listen(3000,(req,res)=>{
console.log("Server Started at Port 3000");
});