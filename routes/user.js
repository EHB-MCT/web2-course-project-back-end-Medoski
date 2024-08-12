const express = require('express');
const app = express.Router();
const {
    MongoClient,
    ObjectId
} = require('mongodb');

const dbName = "courseProject";
const User = require('../classes/User')

const url = "mongodb+srv://admin:admin@cluster0.tsitbkl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// Get all the users
app.get('/', async (req, res) => {
    try {

        // Creating new MongoClient instance
        await client.connect()

        //Takes you the database
        const db = client.db(dbName);
        //Takes you the right collection
        const col = db.collection("users");
        const users = await col.find({}).toArray()

        res.status(200).json(users)
    } catch (error) {

        res.status(500).send({
            error: 'something went wrong',
            value: error.stack
        })
    } finally {
        await client.close()
    }
})

// Posting a user
app.post('/', async (req, res, next) => {
    try {
        //Checking if there is someting in the object posted
        if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) return res.status(400).send('Information not found')

        //Takes you the database
        const db = client.db(dbName);
        //Takes you the right collection
        const col = db.collection("users");
        // Creating a new MongoClient instance
        await client.connect();

        let user = await new User(req.body.firstname, req.body.lastname, req.body.email)
        await user.hashPassword(req.body.password);

        res.status(200).send('succesfully uploaded')

        const p = await col.insertOne(user);

    } catch (err) {

    } finally {
        await client.close();
    }
})

// Getting a user with a specific ID
app.get('/:id', async (req, res) => {
    try {
        // Creating a new MongoClient instance
        await client.connect()

        //Takes you the database
        const db = client.db(dbName);
        //Takes you the right collection
        const col = db.collection("users");

        //Selects the id
        const query = {
            _id: ObjectId(req.params.id)
        }

        const clngs = await col.findOne(query)

        res.status(200).json(clngs)
    } catch (error) {

        res.status(500).send({
            error: 'something went wrong',
            value: error.stack
        })
    } finally {
        await client.close()
    }
})

// Verifying the login if the data is in the database
app.post("/login", async (req, res) => {
    try {

        //Takes you the database
        const db = client.db(dbName);
        //Takes you the right collection
        const col = db.collection("users");
        // Creating a new MongoClient instance
        await client.connect();

        //Selects the email
        const query = {
            email: req.body.email
        }

        const myDoc = await col.findOne(query)
        if (myDoc == null) return res.status(404).send("Nothing found") //guard clause

        const user = new User(myDoc.firstname, myDoc.lastname, myDoc.email, myDoc.password)

        //Unhashing the password
        let passwordCheck = await user.unHashPassword(req.body.password)
        if (passwordCheck == false) return res.status(400).send("False password")


        res.status(200).send(myDoc)

    } catch (err) {

    } finally {
        await client.close();
    }
})

// Deleteing a user with a specific id
app.delete('/:id', async (req, res) => {
    try {
        // Creating a new MongoClient instance
        await client.connect();

        //Takes you the database
        const db = client.db(dbName);
        //Takes you the right collection
        const col = db.collection("users");

        //Selects the id
        const query = {
            _id: ObjectId(req.params.id)
        }
        const userDelete = await col.deleteOne(query)
        res.status(200).send(userDelete);
    } catch (error) {

        res.status(500).send({
            error: 'error',
            value: error.stack
        });
    }
})

// Updating a user email or password
app.put('/:id', async (req, res) => {
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) return res.status(400).send('Information not found')

    try {

        //Takes you the database
        const db = client.db(dbName);
        //Takes you the right collection
        const col = db.collection("users");
        // Creating a new MongoClient instance
        await client.connect();

        //Selects the id
        const query = {
            _id: ObjectId(req.params.id)
        };

        let user = await new User(req.body.firstname, req.body.lastname, req.body.email)
        await user.hashPassword(req.body.password);

        const updateChallenge = await col.updateOne(query, {
            $set: {
                email: user.email,
                password: user.password
            }
        })

        if (updateChallenge) {
            res.status(201).send({
                succes: `Challengeis successfully updated.`,
            });
            return;
        } else {
            res.status(400).send({
                error: `Challenge isn't found.`,
                value: error.stack,
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error.stack
        });
    } finally {
        await client.close();
    }
});

module.exports = app;