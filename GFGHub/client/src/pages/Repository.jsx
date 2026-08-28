import React, { useState, useEffect } from 'react';
import githubAPI from '../services/githubAPI';
import { useGithub } from '../hooks/useGithub';
import { FaGithub, FaFolder, FaPlus, FaLink } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Repository() {
    const { repos, externalRepos, fetchRepos, fetchExternalRepos } = useGithub();
    const [newRepo, setNewRepo] = useState('');
    const [selectedExternal, setSelectedExternal] = useState('');
    const [loading, setLoading] = useState(false);
    const [linkLoading, setLinkLoading] = useState(false);

    useEffect(() => {
        fetchExternalRepos();
    }, []);

    const handleCreate = async () => {
        if (!newRepo.trim()) return;
        setLoading(true);
        try {
            await githubAPI.createRepo({ name: newRepo });
            setNewRepo('');
            await fetchRepos();
        } catch (error) {
            console.error("Failed to create repo", error);
            alert("Failed to create repository");
        } finally {
            setLoading(false);
        }
    };

    const handleLink = async () => {
        if (!selectedExternal) return;
        
        const repo = externalRepos.find(r => String(r.id) === selectedExternal);
        if (!repo) return;

        setLinkLoading(true);
        try {
            await githubAPI.linkRepo({ 
                repoName: repo.name, 
                repoUrl: repo.html_url, 
                githubRepoId: repo.id 
            });
            setSelectedExternal('');
            await fetchRepos();
        } catch (error) {
            console.error("Failed to link repo", error);
            alert("Failed to link repository. It might already be linked.");
        } finally {
            setLinkLoading(false);
        }
    };

    // Filter out already linked repos from the dropdown
    const availableToLink = externalRepos?.filter(
        ext => !repos.some(linked => String(linked.githubRepoId) === String(ext.id))
    ) || [];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-3">
                            <FaFolder className="text-emerald-400" />
                            Your Connected Repositories
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Create or link GitHub repositories to sync your GFG solutions.
                        </p>
                    </div>
                    <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Create Repo Card */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-white mb-4">Create New Repository</h3>
                        <div className="flex flex-col gap-3 flex-grow">
                            <input
                                type="text"
                                placeholder="e.g. gfg-solutions"
                                value={newRepo}
                                onChange={(e) => setNewRepo(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                disabled={loading}
                            />
                            <div className="mt-auto">
                                <button 
                                    onClick={handleCreate} 
                                    disabled={loading || !newRepo.trim()}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <FaPlus className="text-sm" />
                                            <span>Create Repo</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-slate-500 mt-3 flex items-center justify-center gap-1 text-center">
                                    <FaGithub /> Creates a public repo on GitHub.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Link Existing Repo Card */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-white mb-4">Link Existing Repository</h3>
                        <div className="flex flex-col gap-3 flex-grow">
                            <select
                                value={selectedExternal}
                                onChange={(e) => setSelectedExternal(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                                disabled={linkLoading || !Array.isArray(externalRepos) || externalRepos.length === 0}
                            >
                                <option value="">Select a repository...</option>
                                {availableToLink.map(repo => (
                                    <option key={repo.id} value={repo.id}>
                                        {repo.name}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-auto">
                                <button 
                                    onClick={handleLink} 
                                    disabled={linkLoading || !selectedExternal}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {linkLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <FaLink className="text-sm" />
                                            <span>Link Repo</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-slate-500 mt-3 flex items-center justify-center gap-1 text-center">
                                    <FaGithub /> Links an existing GitHub repository.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-800 pb-2">Connected Repositories</h3>
                    {repos && repos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {repos.map((r) => (
                                <a 
                                    key={r._id || r.id} 
                                    href={r.repoUrl || r.html_url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="group flex items-center gap-4 bg-slate-900/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition-all"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FaGithub className="text-xl text-slate-400 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">{r.repoName || r.name}</div>
                                        <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{r.repoUrl || r.html_url}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-900/20 border border-slate-800/50 rounded-2xl border-dashed">
                            <FaFolder className="text-4xl text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-400">No repositories linked yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
