import axios from 'axios'

export const baseURL = 'http://quizophy.com/api/';

const axiosClient = () => {
    return axios.create({
        baseURL,
        headers: {
            'Content-Type': 'multipart/form-data; ',
        }
    })
}

export default axiosClient