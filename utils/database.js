
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cheaptripsclient.73m6xws.mongodb.net/?retryWrites=true&w=majority";

let _db;

const mongoConnect = async (callback) => {
    await MongoClient.connect('mongodb+srv://admin:admin@cheaptripsclient.73m6xws.mongodb.net/?retryWrites=true&w=majority',
    {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    })  .then(client => {
            console.log('MongoDB Connection!');
            _db = client.db('cheaptrips'); // Set _db to the client's database
            _db.command({ping:1});
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};


const getDb = () => {
    if (_db) {
        return _db;
    } else {
        throw 'No database found!';
    }
};


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
