const express = require('express');
require('dotenv').config();
const cors= require('cors');

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();

//middlewear
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


//db connect code

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adlv3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('foodMaster');
        const usersCollection = database.collection('users');

        // GET API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        });
        
        //POST API
        app.post('/users', async (req, res) =>{
            /* console.log('hitting the post', req.body)
            res.send('hit the post') */
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
        })

        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);

            console.log('deleting user with id ', result);

            res.json(result);
        });

        //UPDATE 
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })

        /* //create a document to insert manually insert to db
        const doc = {
            name: "Jobbar",
            email: "jobbar@gmail.com",
        }
        const result = await usersCollection.insertOne(doc);
        console.log(result)
        console.log(`A document was inserted with the _id: ${result.insertedId}`); */
    }
    finally{
        //await client.close();
    }
}   
run().catch(console.dir)


/* client.connect(err => {
  const collection = client.db("foodMaster").collection("users");
  console.log('hitting the db')

  const user = {name: 'Mojnu', email: 'mojnu@gmail.com', age: 32};
    collection.insertOne(user)
    .then(()=>{
        console.log('insert success')
    })
  // perform actions on the collection object
  //client.close();
}); */



//user:  new-db1
//pass: imO3PXjc5gcYIgSE

app.get('/', (req, res)=>{
    res.send('Server Running node-mongo-CRUD');
})
app.get('/hello', (req, res)=>{
    res.send(' Running SERver');
})

app.listen(port, () =>{
    console.log('Listening port', port)
})