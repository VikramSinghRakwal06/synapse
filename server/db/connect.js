const mongoose = require('mongoose');

const dbConnect =async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONDO_DB_URI);
        console.log(`Mongoose connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Mongoose Connection failed:${error.message}`);
        process.exit(1);
    }
}
module.exports = dbConnect;