require('dotenv').config();
const express = require('express');


const port = process.env.PORT || 5000

const app = express();
const router = express.Router({strict: true});

router.get('/', (req, res)=>{
    if(Object.keys(req.query).length === 0) return res.send("no info provided.");
    res.send({"your query was": {...req.query}});
});

app.use('/', router);
app.listen(port, ()=>console.log(`app running on port ${port}`));