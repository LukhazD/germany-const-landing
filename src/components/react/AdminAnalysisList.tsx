import React, { useState, useEffect } from 'react';

interface AnalysisItem {
    _id: string;
    contactEmail: string;
    contactPhone: string;
    queryType: string;

    projectTypeDetail: string;
    location: string;
    analysisDetails?: string;
    sqMeters: number;
    pricePerSqMeter?: number;
    status: string;
    createdAt: string;
}

const BADGE_COLORS: Record<string, string> = {
    'Obra Nueva': 'bg-blue-900/30 text-blue-400 border-blue-800',
    'Rehabilitación': 'bg-purple-900/30 text-purple-400 border-purple-800',
    'Reforma Integral': 'bg-pink-900/30 text-pink-400 border-pink-800',
    'Proyecto Electricidad': 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    'Proyecto Fontanería': 'bg-cyan-900/30 text-cyan-400 border-cyan-800',
    'Sistemas de Energía': 'bg-green-900/30 text-green-400 border-green-800',
    'Climatización': 'bg-teal-900/30 text-teal-400 border-teal-800',
};

const DEFAULT_BADGE = 'bg-gray-900/30 text-gray-400 border-gray-800';

export default function AdminAnalysisList() {
    const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalyses = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/analyses?limit=50');
            if (!res.ok) throw new Error('Error al cargar los análisis');
            const result = await res.json();
            setAnalyses(result.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyses();
    }, []);



    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta solicitud de análisis?')) return;

        try {
            const res = await fetch(`/api/admin/analysis/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');
            setAnalyses(prev => prev.filter(item => item._id !== id));
        } catch (err: any) {
            alert(err.message);
            fetchAnalyses(); // Revert on error
        }
    };

    const getBadgeClass = (queryType: string) =>
        BADGE_COLORS[queryType] || DEFAULT_BADGE;

    if (loading) {
        return (
            <div className="text-center py-12 bg-neutral-900 rounded-3xl border border-neutral-800">
                <div className="animate-pulse">
                    <div className="w-8 h-8 border-2 border-action border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando solicitudes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 bg-neutral-900 rounded-3xl border border-red-800/50">
                <p className="text-red-400">{error}</p>
                <button onClick={fetchAnalyses} className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm">
                    Reintentar
                </button>
            </div>
        );
    }

    if (analyses.length === 0) {
        return (
            <div className="text-center py-12 bg-neutral-900 rounded-3xl border border-neutral-800 shadow-sm">
                <p className="text-gray-500 text-lg">No hay solicitudes de análisis aún.</p>
            </div>
        );
    }

    return (
        <div className="bg-neutral-900 shadow-xl overflow-hidden sm:rounded-3xl border border-neutral-800">
            <ul className="divide-y divide-neutral-800">
                {analyses.map((item) => (
                    <li key={item._id}>
                        <div className="block hover:bg-neutral-800/50 transition-colors">
                            <div className="px-6 py-6 sm:px-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getBadgeClass(item.queryType)}`}>
                                            {item.queryType}
                                        </span>

                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}{' '}
                                        {new Date(item.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">
                                            {item.projectTypeDetail}
                                        </h3>
                                        <p className="text-sm text-gray-400 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {item.location}
                                        </p>
                                    </div>

                                    <div className="text-sm text-gray-300 space-y-1">
                                        <p>
                                            <span className="text-gray-500 font-medium">Metros:</span>{' '}
                                            {item.sqMeters} m²
                                        </p>
                                        {item.pricePerSqMeter && (
                                            <p>
                                                <span className="text-gray-500 font-medium">Precio Objetivo:</span>{' '}
                                                {item.pricePerSqMeter} €/m²
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {item.analysisDetails && (
                                    <div className="mt-4 p-4 bg-black/20 rounded-xl border border-white/5">
                                        <p className="text-sm text-gray-300 italic">
                                            "{item.analysisDetails}"
                                        </p>
                                    </div>
                                )}

                                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <a
                                            href={`mailto:${item.contactEmail}`}
                                            className="text-action hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {item.contactEmail}
                                        </a>
                                        <a
                                            href={`tel:${item.contactPhone}`}
                                            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {item.contactPhone}
                                        </a>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="text-xs uppercase tracking-widest bg-red-900/20 hover:bg-red-900/40 text-red-400 py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
