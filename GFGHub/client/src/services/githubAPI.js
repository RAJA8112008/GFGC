import axios from '../utils/api';

const githubAPI = {
    getRepos: async () => {
        const { data } = await axios.get('/github/repos');
        return Array.isArray(data) ? data : [];
    },
    getExternalRepos: async () => {
        const { data } = await axios.get('/github/external-repos');
        return Array.isArray(data) ? data : [];
    },
    createRepo: async (payload) => {
        const { data } = await axios.post('/github/repos', payload);
        return data;
    },
    linkRepo: async (payload) => {
        const { data } = await axios.post('/github/link', payload);
        return data;
    }
};

export default githubAPI;
