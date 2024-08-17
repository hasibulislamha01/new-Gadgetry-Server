const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;


// Use CORS middleware
app.use(cors({
    origin: '*', // Adjust this to specify which origins are allowed
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const user = process.env.DB_USER;
const password = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${password}@cluster0.75ieoxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const gadgetsCollection = client.db('Gadgetry').collection('gadgetsCollection');

        app.get('/gadgets', async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', 'https://gadgetry-7f6df.web.app');
            res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            const result = await gadgetsCollection.find().toArray();
            res.send(result);
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Uncomment the following line if you want to close the client after every run
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://gadgetry-7f6df.web.app');
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Gadgetry backend is running on port ${port}`);
});
