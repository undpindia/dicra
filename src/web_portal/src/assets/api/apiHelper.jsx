import Axios from 'axios';
const axiosApiInstance = Axios.create();
const handleError = async (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Cant load data! Please check internet connection');
    }
};
let ApiHelper = {
    // Api get function
    get: async (url) => {
        return axiosApiInstance.get(url).catch((error) => {
            handleError(error.response);
            return error.response;
        });
    },
    //getwithheaders
    getwithheaders: async (url, headers) => {
        return axiosApiInstance.get(url, headers).catch((error) => {
            handleError(error.response);
            return error.response;
        });
    },
    //getwithheadersanddata
    getwithheadersanddata: async (url, headers, data) => {
        return axiosApiInstance.get(url, headers, data).catch((error) => {
            handleError(error.response);
            return error.response;
        });
    },
    //postwithbothheader&data
    postwithheaders: async (url, headers, data) => {
        return axiosApiInstance.post(url, headers, data).catch((error) => {
            handleError(error.response);
            return error.response;
        });
    },
    //postwithheader
    postwithonlyheaders: async (url, headers) => {
        return axiosApiInstance.post(url, { headers }).catch((error) => {
            handleError(error.response);
            return error.response;
        });
    },
    // Api post function
    post: async (url, data) => {
        return axiosApiInstance.post(url, data).catch((error) => {
            handleError(error.response);
            return error.response;
        });
    },

    // Api put function
    put: async (url, data) => {
        return axiosApiInstance.put(url, data).catch((error) => {
            handleError(error.response);
            return error.response;
        });
    },

    //put with headers
    putwithheaders: async (url, headers, data) => {
        return axiosApiInstance.put(url, headers, data).catch((error) => {
            handleError(error.response);
            return error.response;
        });
    },

    // Api delete function
    delete: async (url) => {
        return axiosApiInstance.delete(url).catch((error) => {
            handleError(error.response);
            return error.response;
        });
    },
};

export default ApiHelper;
