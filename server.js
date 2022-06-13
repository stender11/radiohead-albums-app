// require dependencies
const express = require("express")
const app = express()
const cors = require("cors")
const MongoClient = require("mongodb").MongoClient
const PORT = 8001
require("dotenv").config()

// declare database variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = "radiohead"

// connect to mongodb
MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

// set middleware
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

// CRUD methods - Read
app.get("/", (req, res) => {
    db.collection("albums").find().toArray()
        .then(data => {
            let nameList = data.map(item => item.albumName)
            console.log(nameList)
            res.render("index.ejs", {info: nameList})
        })
        .catch(error => console.log(error))
})

app.get("/api/:name", (req, res) => {
    const albumNames = req.params.name
        db.collection("albums").find({name: albumNames}).toArray()
        .then(results => {
            console.log(results)
            res.json(results[0])
        })
        .catch(error => console.error(error))
})

// Create
app.post("/api", (req, res) => {
    console.log("Post heard")
    db.collection("albums").insertOne(
        req.body
    )
    .then(result => {
        console.log(result)
        res.redirect("/")
    })
    .catch(error => console.error(error))
})

// Update
app.put("/updateEntry", (req, res) => {
    console.log(req.body)
    Object.keys(req.body).forEach(key => {
        if (req.body[key] === null || req.body[key] === undefined || req.body[key] === "") {
            delete req.body[key]
        }
    })
    console.log(req.body)
    db.collection("albums").findOneAndUpdate(
        {name: req.body.name},
        {
            $set: req.body
        }
    )
    .then(result => {
        console.log(result)
        res.json("Success")
    })
    .catch(error => console.error(error))
})

// Delete (dee-lay-tay)
app.delete("/deleteEntry", (req, res) => {
    db.collection("albums").deleteOne(
        {name: req.body.name}
    )
    .then(result => {
        console.log(result)
        res.json("Entry deleted")
    })
    .catch(error => console.error(error))
})

// set up localhost on port
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
