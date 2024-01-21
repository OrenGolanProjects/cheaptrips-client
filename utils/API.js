exports.GeneralAPIHandler = class GeneralAPIHandler {
    constructor() {
        this.baseURL = 'https://www.search-trips-api.com';
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
    }

    appendAuthorizationHeader(accessToken) {
        this.headers.append('Authorization', `Bearer ${accessToken}`);
    }
    
    
    async makeRequest(url, options) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Request failed:', error.message);
            throw error;
        }
    }

    createUrl(endpoint) {
        return `${this.baseURL}/${endpoint}`;
    }

    get(endpoint) {
        const url = this.createUrl(endpoint);
        const options = {
            method: 'GET',
            headers: this.headers
        };
        return this.makeRequest(url, options);
    }

    post(endpoint, data) {
        const url = this.createUrl(endpoint);
        const options = {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data), // Fix: Stringify the data
        };
        return this.makeRequest(url, options);
    }
    

    put(endpoint, data) {
        const url = this.createUrl(endpoint);
        const options = {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(data)
        };
        return this.makeRequest(url, options);
    }

    delete(endpoint) {
        const url = this.createUrl(endpoint);
        const options = {
            method: 'DELETE',
            headers: this.headers,
            redirect: 'follow',
        };
        return this.makeRequest(url, options);
    }
}
