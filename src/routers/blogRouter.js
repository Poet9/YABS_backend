const express = require('express');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const auth = require("../auth/auth");
const blog = require('../models/blog');

const router = express.Router({strict: true});

// creating an article 
// this request needs : you be logged in and respect the model
router.post('/', auth, async (req, res)=>{
    const article = new Blog({...req.body, owner: req.user._id});
    try {
       await article.save();
       res.status(201).send(article);
    } catch(e){
       res.status(400).send({error: e.message});
    }
 });
 // get many blogs 
 // this request needs no conditioning
router.get('/', async (req, res)=>{
   try{
      // get 3 blogs from db
      const blogs  = await Blog.find({},{body: 0},{ limit: 3 });
      // get writers and store in array blog and writer
      const blogArray = blogs.forEach(async(blog)=>{
         const writer = await blog.populate({path:'users'}).execPopulate();
         return { writer, blog }; // return object containing writer and blog
      }); 
      res.status(200).send(blogArray);
   } catch(e){
      res.status(500).send({error: e.message});
   }
});
//get specific blog
// this request needs the blog id
router.get('/:id', async(req,res)=>{
   try{
      // get full blog
      const article = await Blog.findById(req.params.id);
      //load  3 comments of this blog 
      const comments = await Blog.populate({path: 'comments'}, {limit: 3}).execPopulate();
      res.status(200).send({article, comments});
   }catch(e){
      res.status(404).send({error: e.message});
   }
});
// get writers blogs 
// this request require user to be logged in that's all
router.get('/me', auth, async (req, res) =>{
   try{
      const blogs = await Blog.find({authorId: req.user._id}, {}, {limit: 5,skip: parseInt(req.query.skip)});
      res.status(200).send(blogs);
   } catch(e){
      res.status(400).send({error: e.message});
   }
});
// updating a blog by writer or rating a blog
/** this request needs you be *logged in* and *blogId param*  and has two types:
 * 1-   updating ['description', 'hashtags', 'body', 'sources'] you need to be *the writer* and *body*
 * 2-   updating rate need *rate body*
 ***/ 
router.patch('/writer/:id', auth, async(req, res)=>{
   const updatable = ['description', 'hashtags', 'body', 'sources', 'rate'];
   const updates = Object.keys(req.body);
   const allowedUpdates = updates.every(update => updatable.includes(update));
   // if the property is actually updatable
   if (!isUpdateValid) return res.status(400).send({error: 'Property does not exist.'});
   // to prevent a rate out of range 
   if(req.body.rate && (req.body.rate >5 || req.body.rate < 1)) throw new Error('bad request');
   try{
      const blog = await Blog.findOne({_id: req.params.id});
      if(updates.length === 1 && updates[0]=== 'rate'){
         const alreadyRated = blog.raters.findIndex(el =>el.rater === req.user._id);
         if(alreadyRated === -1) { // adding user rate
            blog.raters.push({rater: req.user._id, note: req.body.rate});
            blog.rate = (blog.rate * blog.raters.length-1 + req.body.rate) / blog.raters.length;
         } else { // updating user rate 
            blog.rate = (blog.rate * blog.raters.length - blog.raters[alreadyRated].note + req.body.rate) / blog.raters.length;
            blog.raters[alreadyRated].note = req.body.rate;
         }
      }
      else if (updates.length > 1 && req.user._id === blog.authorId ) { // aplying updates
         updates.forEach( update => blog[update] = req.body[update]);
      }
      await blog.save();
      res.status(200).send(blog);
   }catch (e) {
      res.status(400).send({error: e.message});
   }
});
//to delete a blog you need *blogId param* and to be the writer
router.delete('/:id', auth, async(req, res)=>{
   try{
      const blog = await Blog.findOne({_id: req.params.id, authorId: req.user._id});
      if(!blog) return res.status(404).send({error: 'article not found'});
      await blog.remove();
      res.status(200).send({res: "article deleted succesfully"});
   }catch(e){
      res.status(500).send({error: e.message});
   }
});

module.exports = router;