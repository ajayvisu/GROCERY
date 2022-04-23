// importing / accessing third party modules
const express           = require ('express');
const mongoose          = require ('mongoose');
const cors              = require ('cors');
const morgan            = require ('morgan');
const ejs               = require('ejs');
const expresslayouts    = require('express-ejs-layouts');

const app        = express();

require ('dotenv').config();
const port = process.env.port || 5000;

//third party middleware
app.use (morgan('dev'));

//body-parser
app.use (express.json());

app.use (cors());
app.use (expresslayouts);

//static files
app.use(express.static('public'))
//app.use('/css', express.static(_dirname + 'public/css'))
//napp.use('/js', express.static(_dirname + 'public/js'))
//app.use('/img', express.static(_dirname + 'public/img'))

//setting template engine
app.set('view engine', 'ejs')

//navigation
app.get('/index', (req,res) =>{
    res.render('index.ejs', {name: 'Ajay'})
})

app.get('/login', (req,res) =>{
    res.render('login.ejs')
})

//localhost connection
app.listen (port,() =>{
    console.log('server started successfully');
});

//db connection
mongoose.connect(process.env.dbUrl, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(data =>{
    console.log("db connected successfully");
}).catch(err =>{
    console.log(err.message);
    process.exit(1);
})

//router declaration
const productRouter = require ('./routes/product.route');
const userRouter = require ('./routes/user.route');

app.use ('/api/v1/product', productRouter);
app.use ('/api/v2/user', userRouter);
