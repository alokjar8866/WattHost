import express from "express";
import cors from 'cors';
import { simpleGit } from "simple-git";
import generateStr from "./randomStr.js";
import path from "path";
import { getAllFiles } from "./fileExtract.js";
import { uploadFile } from "./awsBucket.js";
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res)=>{
    const repoUrl = req.body.repoUrl;
    const id = generateStr();
    await simpleGit().clone(repoUrl, path.join(__dirname,`output/${id}`));
    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    
    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length+1),file);
    })

    publisher.lPush("build-queue",id);

    //console.log(repoUrl);
    res.json({
        id:id
    })
})



app.listen(3000,()=>{
    console.log("Upload service started...")
})