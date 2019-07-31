const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/orders');
const userRouter = require('./api/routes/user');
const db = 'mongodb://localhost/nodeAuthTutorial';

const port = process.env.PORT || 3000;

//connect to db
mongoose.connect(db);

mongoose.Promise = global.Promise;
//use morgan for logging purposes
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));// parse requests coming from /uploads and making uploads folder public as well

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//preventing CORS errors
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
  "Origin, X-Request-With, Content-Type, Accept, Authorization");
//stating which methods other apps could access with to our api
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({});
  }
  next();
});

//accessing routes providing some modularities
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/user', userRouter);

//managing errors
app.use((req, res, next)=>{
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next)=>{
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  });
});



//server creation using express
app.listen(port, ()=>{
  console.log('listening on port '+ port);
});
