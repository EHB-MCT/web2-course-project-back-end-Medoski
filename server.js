const {
    MongoClient,
    ObjectId
} = require('mongodb');

const userRoute = require('./routes/user.js');
const User = require('./classes/User.js');

const gameRoute = require('./routes/game.js');
const Game = require('./classes/Game.js');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const morgan = require('morgan')

const cors = require('cors');
const {
    query
} = require('express');

require('dotenv').config()

const dbName = "courseProject";

const port = process.env.PORT || 3000;

const url = "mongodb+srv://admin:admin@cluster0.tsitbkl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('common'))
app.use('/users', userRoute)
app.use('/games', gameRoute)

app.get('/', (req, res) => {
    res.status(300).redirect('/info.html')
})

app.delete('/', async (req, res) => {

})

app.listen(port, () => {
    console.log(`REST API is running at http://localhost:${port}`);
})