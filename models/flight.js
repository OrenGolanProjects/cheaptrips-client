class Flight {
    constructor(data) {
        this.origin = data.origin;
        this.destination = data.destination;
        this.ticketKeys = data.ticketKeys;
        this.currency = data.currency;
        this.departure_at = data.departure_at;
        this.return_at = data.return_at;
    }

    static fromJson(flightData) {
        try {
            return new Flight({
                origin: flightData.origin,
                destination: flightData.destination,
                ticketKeys: flightData.ticketKeys,
                currency: flightData.currency,
                departure_at: flightData.departure_at,
                return_at: flightData.return_at,
            });
        } catch (error) {
            throw new Error('Invalid JSON structure for Flight.');
        }
    }
}

module.exports = Flight;
