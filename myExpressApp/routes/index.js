// ==========================================================================================================================
// VARIABLES

var express = require('express');
var router = express.Router();

require("dotenv").config(); 

const MongoClient = require("mongodb").MongoClient;

// Connect server to MongoDB Atlas
const uri = process.env.DATABASE_URI;
let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // (Second Argument) = prevent any warnings we get from mongoDB

async function connectTeacher(request) { // we async this function b/c we don't know how fast mongodb takes to connect
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // (Second Argument) = prevent any warnings we get from mongoDB

    try{
        await client.connect(); // wait for the client to connect
        console.log("Connected to MongoDB Atlas!");

        const iat_database = client.db("IAT-Data"); 
        const teacher = iat_database.collection("Teacher"); 

        await teacher.insertOne({
            "data": request.params["data"]
        });

    }
    catch(error){
        console.log("Something went wrong: " + error);
    }
    finally{
        await client.close();
    }
};

async function connectStudent(request) { // we async this function b/c we don't know how fast mongodb takes to connect
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // (Second Argument) = prevent any warnings we get from mongoDB
    
    try{
        await client.connect(); // wait for the client to connect
        console.log("Connected to MongoDB Atlas!");

        const iat_database = client.db("IAT-Data"); 
        const student = iat_database.collection("Student"); 

        await student.insertOne({
            "data": request.params["data"]
        });

    }
    catch(error){
        console.log("Something went wrong: " + error);
    }
    finally{
        await client.close();
    }
};

// This is the URL that the user will call. / is the root of the website or default URL
// This summons a callback function

// REQUEST = User's incoming data
// RESPONSE = Your outgoing data (that you return to the client)
router.get("/teacher/:data", (request, response, next) => {
    connectTeacher(request);
    response.send("Connection Successful!");
});

router.get("/student/:data", (request, response, next) => {
    connectStudent(request);
    response.send("Connection Successful!");
});

router.get("/", (request, response, next) => {
    response.send("Hello World!");
});

module.exports = router;