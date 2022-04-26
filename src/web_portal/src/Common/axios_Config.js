import axios from 'axios';
//make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: 'https://internalapidev.chickenkiller.com/'
});

export default instance;