const express = require('express');
const app = express.Router();
const {
    MongoClient,
    ObjectId
} = require('mongodb');

const dbName = "courseProject";
const Game = require('../classes/Game')

const url = "mongodb+srv://admin:admin@cluster0.tsitbkl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Geting all games
app.get('/', async (req, res) => {
    try {
        await client.connect()
        //Takes you the database and collection
        const colli = client.db(dbName).collection('games')
        const games = await colli.find({}).toArray()

        res.status(200).json(games)
    } catch (error) {

        res.status(500).send({
            error: 'something went wrong',
            value: error.stack
        })
    } finally {
        await client.close()
    }
})
// Post a game to database
app.post('/', async (req, res, next) => {
    try {
        //Checking if there is someting in the object posted
        if (!req.body.userId || !req.body.gameId || !req.body.gameImg || !req.body.gameRelease) return res.status(400).send('Information not found')

        //Takes the database
        const db = client.db(dbName);
        //Takes the right collection
        const col = db.collection("games");

        await client.connect();
        //Make body to post
        let game = await new Game(req.body.userId, req.body.gameId, req.body.gameImg, req.body.gameName, req.body.gameRelease)

        res.status(200).send('succesfully uploaded')

        const p = await col.insertOne(game);

    } catch (err) {

    } finally {
        await client.close();
    }
})

// Getting a specific game
app.get('/:id', async (req, res) => {
    try {
        await client.connect()

        //Takes  the database
        const db = client.db(dbName);
        //Takes the right collection
        const col = db.collection("games");
        //Takes the id
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

// Getting all the games saved by a specific user
app.get('/bookmarks/:id', async (req, res) => {
    try {
        await client.connect()

        //Takes the database
        const db = client.db(dbName);
        //Takes the right collection
        const col = db.collection("games");
        //Takes the id
        const query = {
            userId: req.params.id
        }
        console.log(query)

        const clngs = await col.find(query).toArray()

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

// Deleting a game from the database
app.delete('/:id', async (req, res) => {
    try {
        await client.connect();

        //Takes the database
        const db = client.db(dbName);
        //Takes the right collection
        const col = db.collection("games");
        //Takes the id
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


module.exports = app;