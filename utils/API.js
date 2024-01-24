exports.GeneralAPIHandler = class GeneralAPIHandler {
    constructor() {
        this.baseURL = 'https://www.search-trips-api.com';
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
    };

    appendAuthorizationHeader(accessToken) {
        this.headers.append('Authorization', `Bearer ${accessToken}`);
    };
    
    
    async makeRequest(url, options) {
        try {
            console.log('API >> makerequest :: ',url);
            const response = await fetch(url, options);
                console.log(options)
                if (!response.ok) {
                const errMessage = await response.text();
                console.error(errMessage);
                throw new Error(`${response.status}.\n ${errMessage}`);
            }
    
            // Check if response body is empty
            const text = await response.text();
            if (!text) {
                return null; // or handle it in a way that makes sense for your application
            }

            return JSON.parse(text);
        } catch (error) {
            console.error('Request failed:', error.message);
            throw error;
        }
    };
    
    createUrl(endpoint) {
        return `${this.baseURL}/${endpoint}`;
    };

    get(endpoint) {
        const url = this.createUrl(endpoint);
        const options = {
            method: 'GET',
            headers: this.headers
        };
        return this.makeRequest(url, options);
    };

    post(endpoint, data) {
        const url = this.createUrl(endpoint);
        
        const options = {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data),
        };

        return this.makeRequest(url, options);
    };


    put(endpoint, data) {
        const url = this.createUrl(endpoint);
        const options = {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(data)
        };
        return this.makeRequest(url, options);
    };

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
