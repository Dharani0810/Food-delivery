import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

 export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://Food-del:Dharani1408@cluster0.f3axf.mongodb.net/fooddel').then(()=>console.log("db connected"));
}