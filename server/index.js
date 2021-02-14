const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
require('./database/mongodbinit');





const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const allroutes = require('./routes/index');

app.use(allroutes);



app.get('/',(req,res,next) => {
     res.send('hello world');
})





app.use('*',function (req,res,next){
	// res.status(404).send('404 error page not found');
    next(new Error('page not found'));
});

app.use(function(err,req,res,next){
    console.log(err);
    if(err.message)
    {
        res.send(err.message)
    }
    else{
        err.message ="internal server error";
        res.send(err.message)

    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)

});