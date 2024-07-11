const express = require("express");
const path = require("path");

const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");
app.set('views', __dirname);


  app.get('/',(req,res)=>{
    res.render('index');
  });

app.get('/about',(req, res) => {
    res.render('about');
});

app.get('/foryou',(req, res) => {
  res.render('foryou');
})

app.get('/latesttrends',(req, res) => {
  res.render('latesttrends');
});



const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

