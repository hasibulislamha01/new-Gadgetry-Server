const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;



app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://gadgetry-7f6df.web.app",
        "https://gadgetry-7f6df.firebaseapp.com"
    ]
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
            const result = await gadgetsCollection.find().toArray();
            res.send(result);
        });

        app.get('/things', async (req, res) => {
            const page = parseInt(req?.query.page)
            const gadgetsPerPage = 9
            const startingIndex = (page - 1) * gadgetsPerPage;
            const endingIndex = startingIndex + gadgetsPerPage;
            const gadgets = await gadgetsCollection.find().toArray()
            const noOfItems = gadgets?.length
            if(page) {
                const pagedItems = gadgets?.slice(startingIndex, endingIndex)
                res.send({pagedItems, noOfItems})
            }
            else{
                res.send(gadgets)
            }
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Uncomment the following line if you want to close the client after every run
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Gadgetry is running!');
});

app.listen(port, () => {
    console.log(`Gadgetry backend is running on port ${port}`);
});
