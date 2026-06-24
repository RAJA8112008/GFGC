import axios from '../utils/api';

const solutionAPI = {
    getAll: () => axios.get('/solutions'),
    create: (payload) => axios.post('/solutions', payload),
    update: (id, payload) => axios.put(`/solutions/${id}`, payload),
    delete: (id) => axios.delete(`/solutions/${id}`)
};

export default solutionAPI;
