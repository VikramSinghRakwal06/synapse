const mongoose = require('mongoose');
const 
const dbConnect =async ()=>{
    try {
        await mongoose.connect()
    } catch (error) {
        
    }
}