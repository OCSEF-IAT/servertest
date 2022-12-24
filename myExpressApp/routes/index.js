// ==========================================================================================================================
// VARIABLES

const express = require('express');
const router = express.Router();
require("dotenv").config(); 

const MongoClient = require("mongodb").MongoClient;
const uri = process.env.DATABASE_URI;
const access_control_URL = process.env.HOST_DEVELOPMENT;

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
                "data": this.request.params["data"]
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

// REQUEST = User's incoming data
// RESPONSE = Your outgoing data (that you return to the client)
router.get("/teacher/:data", (request, response, next) => {

    // Allow other webpages to access this API
    response.setHeader('content-type', 'text/javascript');
    response.setHeader('Access-Control-Allow-Origin', access_control_URL); // Change URL to github pages link later (currently for development testing)
    
    let teacher = new IATDATA("IAT-Data", "Teacher", request);
    teacher.connectUser();

    response.send({message:"Connection Successful!"});
});

router.get("/student/:data", (request, response, next) => {

    // Allow other webpages to access this API
    response.setHeader('content-type', 'text/javascript');
    response.setHeader('Access-Control-Allow-Origin', access_control_URL);

    let student = new IATDATA("IAT-Data", "Student", request);
    student.connectUser();
    
    response.send({message:"Connection Successful!"}); // return JSON object
});

router.get("/", (request, response, next) => {
    response.send({message:"Hello Server!"});
});

module.exports = router;