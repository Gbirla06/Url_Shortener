const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req,res) {
    const body = req.body;
    if(!body.url)
        return res.status(400).json({error : 'URL is required'});
    
    const flag = await URL.find({redirecURL:req.url});
    
    if(flag.body!==undefined){
        return res.render('home',{
            id : flag.shortID
        })
    }
    else{
        const shortID = shortid();  
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: req.user.id
        });
        
        return res.render('home',{
            id : shortID
        })

    }
    // return  res.status(201).json({id:shortID});
}

async function handleGetAnalytics(req,res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId: shortId});

    return res.json({
        totalClicks : result.visitHistory.length,
        analytics : result.visitHistory
    });
}


module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
}