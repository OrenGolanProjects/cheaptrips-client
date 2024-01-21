class TravelPlaces {
    constructor(data) {
        this.radius = data.radius;
        this.lon = data.lon;
        this.lat = data.lat;
        this.limitPlaces = data.limitPlaces;
        this.city = data.city;
        this.countryIATAcode = data.countryIATAcode;
        this.databaseKey = data.databaseKey;
        this.kindsCategory = data.kindsCategory;
        this.expireAt = data.expireAt;
        this.id = data.id;
    }

    static fromJson(json) {
        try {
            return new TravelPlaces({
                radius: json.radius,
                lon: json.lon,
                lat: json.lat,
                limitPlaces: json.limitPlaces,
                city: json.city,
                countryIATAcode: json.countryIATAcode,
                databaseKey: json.databaseKey,
                kindsCategory: json.kindsCategory,
                expireAt: json.expireAt,
                id: json.id,
            });
        } catch (error) {
            throw new Error('Invalid JSON structure for Travel Places.');
        }
    }
}

module.exports = TravelPlaces;
