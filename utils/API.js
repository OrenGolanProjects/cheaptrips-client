// This class, GeneralAPIHandler, serves as a generic handler for making HTTP requests to a specified API.

exports.GeneralAPIHandler = class GeneralAPIHandler {
    constructor() {
        // Initialize the base URL for the API
        this.baseURL = 'https://www.search-trips-api.com';
        
        // Create default headers for Content-Type and Acceptance of JSON
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
    };

    // Method to append an authorization header to the existing headers
    appendAuthorizationHeader(accessToken) {
        // Check if the 'Authorization' header already exists and has the value 'accessToken'
        if (!this.headers.has('Authorization') || this.headers.get('Authorization') !== `Bearer ${accessToken}`) {
            this.headers.set('Authorization', `Bearer ${accessToken}`);
        }
    };
    
    // Asynchronous method to make an HTTP request using fetch
    async makeRequest(url, options) {
        try {
            // Log the URL and options for debugging purposes
            console.log('API >> makerequest :: ', url);

            // Use the fetch function to make the request
            const response = await fetch(url, options);

            // Check if the response status is not okay, and handle accordingly
            if (!response.ok) {
                const errMessage = await response.text();
                console.error(errMessage);
                throw new Error(`${response.status}.\n ${errMessage}`);
            }
    
            // Check if the response body is empty
            const text = await response.text();
            if (!text) {
                return null; // or handle it in a way that makes sense for your application
            }

            // Parse the response body as JSON and return it
            return JSON.parse(text);
        } catch (error) {
            console.error('Request failed:', error.message);
            throw error;
        }
    };
    
    // Method to create a complete URL by combining the base URL and the provided endpoint
    createUrl(endpoint) {
        return `${this.baseURL}/${endpoint}`;
    };

    // HTTP GET method
    get(endpoint) {
        const url = this.createUrl(endpoint);
        const options = {
            method: 'GET',
            headers: this.headers
        };
        return this.makeRequest(url, options);
    };

    // HTTP POST method
    post(endpoint, data) {
        const url = this.createUrl(endpoint);
        
        const options = {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data),
        };

        return this.makeRequest(url, options);
    };

    // HTTP PUT method
    put(endpoint, data) {
        const url = this.createUrl(endpoint);
        const options = {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(data)
        };
        return this.makeRequest(url, options);
    };

    // HTTP DELETE method
    delete(endpoint) {
        const url = this.createUrl(endpoint);
        const options = {
            method: 'DELETE',
            headers: this.headers,
            redirect: 'follow',
        };
        return this.makeRequest(url, options);
    };
};
