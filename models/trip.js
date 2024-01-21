const fs = require('fs');
const path = require('path');
const flight = require('./flight');
const news = require('./news');
const travelPlaces = require('./travel-places');
const { error } = require('console');

class Trip {
    constructor(data) {
        this.flight = data.flight;
        this.news = data.news;
        this.placesData = data.placesData;
    }


    static fetchData(callback) {
        const filePath = path.join(__dirname, '../','files','trip-data.json');

        fs.readFile(filePath, 'utf8', (err, fileContent) => {
            if (err) {
                console.error('Error reading file:', err);
                callback(err, null);
                return;
            }

            const fileData = JSON.parse(fileContent);
            callback(null, fileData);
        });

};
}

module.exports = Trip;
