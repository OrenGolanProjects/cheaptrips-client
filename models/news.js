class News {
    constructor(data) {
        this._id = data._id;
        this.expireAt = data.expireAt;
        this.cityName = data.cityName;
        this.newsList = data.newsList;
        this.newsListCount = data.newsListCount;
    }

    static fromJson(json) {
        try {
            return new News({
                _id: json._id,
                expireAt: json.expireAt,
                cityName: json.cityName,
                newsList: json.newsList,
                newsListCount: json.newsListCount,
            });
        } catch (error) {
            throw new Error('Invalid JSON structure for News.');
        }
    }
}

module.exports = News;
