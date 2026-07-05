import { useEffect, useState } from 'react';
import githubAPI from '../services/githubAPI';

export const useGithub = () => {
    const [repos, setRepos] = useState([]);
    const [externalRepos, setExternalRepos] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRepos = async () => {
        setLoading(true);
        try {
            const data = await githubAPI.getRepos();
            setRepos(data);
        } catch (error) {
            console.error("Failed to fetch repos", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExternalRepos = async () => {
        setLoading(true);
        try {
            const data = await githubAPI.getExternalRepos();
            setExternalRepos(data);
        } catch (error) {
            console.error("Failed to fetch external repos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    return { repos, externalRepos, loading, fetchRepos, fetchExternalRepos };
};
