require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require('mongoose');

 mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("connected to db");}).catch((e)=>{
    console.log(e);
 })

const shortID = require("shortid")

const schema = new mongoose.Schema({

full:{
    type:String,
    required:true
},
short:{
    type:String,
    required:true,
    default:shortID.generate
},
clicks:{
    type:Number,
    required:true,
    default:0
}
})
const Urlschema =mongoose.model("Urlschema",schema)

app.set("view engine","ejs")
app.use(express.urlencoded({extended:false}))
app.get("/", async (req,res)=>{
    const Urlschemas = await Urlschema.find()
    res.render("index",{Urlschemas:Urlschemas})
})
app.post("/UrlSchemas", async (req,res)=>{
  await Urlschema.create({ full:req.body.url})
  res.redirect("/")
})

app.get("/:shorturl",async (req,res)=>{
    const shorturl = await Urlschema.findOne({short:req.params.shorturl})
    if(shorturl == null) return res.sendStatus(404)
    shorturl.clicks++
 shorturl.save()
    res.redirect(shorturl.full)
 })





app.listen(process.env.PORT || 3000,()=>{
    console.log("connecteed to server");
})