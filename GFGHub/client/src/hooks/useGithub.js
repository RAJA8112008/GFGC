import { useEffect, useState } from 'react';
import githubAPI from '../services/githubAPI';

export const useGithub = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRepos = async () => {
        setLoading(true);
        const data = await githubAPI.getRepos();
        setRepos(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    return { repos, loading, fetchRepos };
};
