class Urls {
    constructor(environment) {
        this.env = environment[0] || 'qa';
    }

    getBaseUrl(){
        let baseUrl = {
            dev: 'https://dev.jsonplaceholder.typicode.com/',
            qa : 'https://qa.jsonplaceholder.typicode.com/',
            pro: 'https://jsonplaceholder.typicode.com/'
        };
        return baseUrl[this.env];
    }

    getAllUrls(){
        let baseUrl   = this.getBaseUrl();
        return {
            "base"            : baseUrl,
            "posts"           : `${baseUrl}/posts`,
            "comments"        : `${baseUrl}/comments`,
            "albums"          : `${baseUrl}/albums`,
            "photos"          : `${baseUrl}/photos`,
            "todos"           : `${baseUrl}/todos`,
            "users"           : `${baseUrl}/users`,
        }
    }

}
module.exports = (env) => new Urls(env);