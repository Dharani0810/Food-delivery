import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


//placing user order for frontend
const placeOrder = async (req,res)=>{

    const frontend_url = "http://localhost:3001"
    

    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name,
                },
                unit_amount: Math.round(item.price * 100 * 80),
            },
            quantity:item.quantity
        }));


        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges",
                },
                unit_amount:2*100*80
            },
            quantity:1
        });

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,

        });
        if (!session || !session.url) {
            throw new Error("Stripe session creation failed");
          }

        res.json({success: true,session_url:session.url})

    } catch (error) {
        console.error("Error in placing order:", error);
        res.status(500).json({ success: false, message: error.message });
        
    }
}

const verifyOrder = async (req, res) => {
    const {orderId,success} = req.query;
    try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//user orders for frontend
const userOrders = async (req, res) => {
    try {
        const order = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:order})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"}) 
    }
}

//Listing orders for admin panel
const listOrders = async(req,res)=>{
    try {
        const order = await orderModel.find({});
        res.json({success:true,data:order})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true,message:"Order updated successfully"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

export {placeOrder , verifyOrder, userOrders,listOrders,updateStatus}