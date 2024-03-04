import express from "express";
import bodyParser from "body-parser";
import _ from 'lodash';

const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let postData = [];

app.get("/", (req, res) =>{
  res.render("index.ejs",{postData:postData});
});

app.get("/create", (req, res) =>{
  res.render("blogs.ejs");
});

app.post("/publish", (req, res) => {
  const options = {day: 'numeric',month: 'long', year: 'numeric'};
  let postDate = new Date().toLocaleDateString('en-US', options);
  const{content,title,name} = req.body;
  let inputData = {title:title,name:name,content:content,postDate};
  postData.push(inputData);

  res.redirect("/");
});

app.get("/postData/:inputName", (req, res) =>{
  const requestedTitle = _.lowerCase(req.params.inputName);
  postData.forEach((inputData)=>{
    if (requestedTitle === _.lowerCase(inputData.title)) {
      res.render("posts.ejs",{
        title:inputData.title,
        name:inputData.name,
        content:inputData.content,
        date:inputData.postDate
      });
    }
  });
});

app.get("/edit/:inputName", (req, res) =>{
  const editTitle = _.lowerCase(req.params.inputName);
  postData.forEach((inputData)=>{
    if (editTitle === _.lowerCase(inputData.title)) {
      res.render("edit.ejs",{
        title:inputData.title,
        name:inputData.name,
        content:inputData.content,
      });
    }
  });
});
app.post("/edit/:inputName", (req, res) => {
  const reqTitle = _.lowerCase(req.params.inputName);
  let position = -1;
  postData.forEach((inputData, index)=>{
    if (reqTitle === _.lowerCase(inputData.title)) {
      const options = {day: 'numeric',month: 'long', year: 'numeric'};
      let postDate = new Date().toLocaleDateString('en-US', options);
      const{content,title,name} = req.body;
      let editData = {title:title,name:name,content:content,postDate};
      
      position = index;
      console.log(position);
      postData.splice(position, 1, editData);
      res.redirect("/");
    }
  });
});

app.get("/delete/:inputName", (req, res) => {
  const delTitle = _.lowerCase(req.params.inputName);
  let position = -1;
  postData.forEach((inputData, index)=>{
    if (delTitle === _.lowerCase(inputData.title)) {
      position = index;
      console.log(position);
      postData.splice(position, 1);
      res.redirect("/");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
