import axios from 'axios';

const api = axios.create({
    baseURL: 'https://thibasbox-api.herokuapp.com'
});

export default api;