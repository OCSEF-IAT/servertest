// ==========================================================================================================================
// VARIABLES

const express = require('express');
const router = express.Router();
require("dotenv").config(); 

// Allow certain websites to access this API (use * so any site can call the API)
const cors = require('cors');

const MongoClient = require("mongodb").MongoClient;
const uri = process.env.DATABASE_URI;

// Connect server to MongoDB Atlas
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // (Second Argument) = prevent any warnings we get from mongoDB

class IATDATA{

    constructor(db, collection, requestData){
        this.db = db;
        this.collection = collection;
        this.request = requestData;
    }

    // Take data given from client and insert into MongoDB Atlas
    async connectUser(){
        try{
            await client.connect(); // wait for the client to connect
            console.log("Connected to MongoDB Atlas!");
    
            const collection = client.db(this.db).collection(this.collection); 
    
            await collection.insertOne({
                "data": this.request
            });
    
        }
        catch(error){
            console.log("Something went wrong: " + error);
        }
        finally{
            await client.close();
        }
    }
}

// This is the URL that the user will call. / is the root of the website or default URL
// This summons a callback function

// Bypass CORS Policy so that the client can access the API
// Change URL to github pages link later (currently for development testing)
router.use(cors({
    origin: [process.env.HOST_PRODUCTION, process.env.HOST_DEVELOPMENT]
}));

router.use(express.json()); // Parse JSON Object

// REQUEST = User's incoming data
// RESPONSE = Your outgoing data (that you return to the client in JSON format)
router.post("/teacher/", (request, response) => {

    let teacher = new IATDATA("IAT-Data", "Teacher", request.body);
    teacher.connectUser();

    response.send({message:"Connection Successful!"}); // return Object (auto converts to JSON)
});

router.post("/student/", (request, response) => {

    let student = new IATDATA("IAT-Data", "Student", request.body);
    student.connectUser();

    response.send({message:"Connection Successful!"});
});

router.get("/", (request, response) => {
    response.send({message:"Hello Server!"}); // return Object (auto converts to JSON)
});

module.exports = router;

// router.get("/teacher/:data", (request, response, next) => {

//     // Allow other webpages to access this API
//     response.setHeader('content-type', 'text/javascript');
    
//     let teacher = new IATDATA("IAT-Data", "Teacher", request);
//     teacher.connectUser();

//     response.send({message:"Connection Successful!"});
// });