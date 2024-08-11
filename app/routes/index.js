//index.js

const express = require('express');
const router = express.Router();
const fs = require('fs'); 
const pathRouter = `${__dirname}`;

const removeExtension = (fileName) => {
    return fileName.split('.').shift(); 
}

fs.readdirSync(pathRouter).filter((file)=>{
    const fileNoExtension = removeExtension(file)
    const skip = ['index'].includes(fileNoExtension);
    if(!skip){
        router.use(`/${fileNoExtension}`, require(`./${fileNoExtension}`))
    }
})

router.get('*',(req,res)=>{
    res.status(404)
    res.send({error: "Esto no funciona"})
})

module.exports = router
