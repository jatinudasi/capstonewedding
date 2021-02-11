const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI,{dbName: process.env.DBNAME,
useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify:false,
useCreateIndex: true

})
.then(()=>{
    console.log("connected");
}).catch(err=>{
    console.log("error connecting"+err);
})