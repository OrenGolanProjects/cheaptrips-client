const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(firstName, surName, phoneNum, userName, email, password,id) {
        this.firstName = firstName;
        this.surName = surName;
        this.phone = phoneNum;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this._id = id;
    };


    save() {
        const db = getDb();
        let dbOperation;
        if(this._id){
            // Update the product.
            console.log('user >> save >> update user details.');
            dbOperation = db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, {$set: this});
        }else{
            console.log('user >> save >> create new user.');
            dbOperation = db.collection('users')
            .insertOne(this);
        }
        return dbOperation
            .then((res) => {
                console.log(res);
                return res; // You might want to return the result for further processing
            })
            .catch((err) => {
                console.log(err);
                throw err; // Rethrow the error to be caught by the calling code
            });
    };


    static  findByEmail(email) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ email: email })
            .then((user) => {
                console.log(user);
                return user;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    };

    static deleteById(id) {
        const db = getDb();
        return db
            .collection('users')
            .deleteOne({ _id: new ObjectId(id) })
            .then(result => {
                console.log(result);
                return result; // Return the result for further processing
            })
            .catch(err => {
                console.log('User deleted!');
                throw err;
            });
    }

}
module.exports = User;
