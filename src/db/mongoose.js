const mongoose = require('mongoose');

const connection = async ()=>{
    await mongoose.connect(process.env.DBURL);
}

connection()
.then(()=>console.log("db connection successful"))
.catch(e => console.log({e}));