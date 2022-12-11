const fs =require("fs/promises");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const { v4: uuid } = require("uuid");

const app = express();
app.use(express.json());
//routes
app.get("/outfit",  (req, res) => {
    const tops =["blue", "red", "green", "yellow"];
    const jeans = ["blue", "red", "green", "yellow"];
    const shoes = ["blue", "red", "green", "yellow"];

    const outfit = {
        top: _.sample(tops),
        jeans: _.sample(jeans),
        shoes: _.sample(shoes),
    };
    res.json({
        outfit
    });
});

app.post("/comments", async (req,res) => {
    const id = uuid();
    const content = req.body.content;

    if(!content) {	
        return res.sendStatus(400);
    }

    await fs.mkdir("data/comments", { recursive: true });
    await fs.writeFile(`data/comments/${id}.txt`, content);

    console.log(id);
    console.log(content);
    res.status(201).json({
        id: id
    });
});

app.get("/comments-show", async (req, res) => {
    const files = await fs.readdir("data/comments");
    const comments = await Promise.all(
        files.map(async (file) => {
            const content = await fs.readFile(`data/comments/${file}`, "utf-8");
            return {
                id: file.replace(".txt", ""),
                content,
            };
        })
    );
    res.json({
        comments
    });
});

app.get("/comments/:id", async (req, res) => {
    const id = req.params.id;
    let content ;

    try{
        content = await fs.readFile
    (`data/comments/${id}.txt`, "utf-8");
    } catch (err) {
        return res.sendStatus(404);
    }
    res.json({
        id,
        content
    });
    
});

//route to update a comment
app.put("/comments/:id", async (req, res) => {
    const id = req.params.id;
    const content = req.body.content;

    if(!content) {
        return res.sendStatus(400);
    }

    try{
        await fs.writeFile(`data/comments/${id}.txt`, content);
    }
    catch (err) {
        return res.sendStatus(404);
    }
    res.sendStatus(204);
});



app.listen(3000, () => console.log("API is running ......")); 
