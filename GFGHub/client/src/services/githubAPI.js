import axios from '../utils/api';

const githubAPI = {
    getRepos: async () => {
        const { data } = await axios.get('/github/repos');
        return data;
    },
    createRepo: async (payload) => {
        const { data } = await axios.post('/github/repos', payload);
        return data;
    }
};

export default githubAPI;
