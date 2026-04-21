import React, { useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ShowStats({ session }) {
    // Manejo de la relación de emociones, puede venir como emotionData o emotion_data desde Laravel
    const emotions = session?.emotionData || session?.emotion_data || [];
    const user = session?.user;

    // Calcular estadísticas generales
    const stats = useMemo(() => {
        if (!emotions.length) return null;

        const emotionCounts = emotions.reduce((acc, curr) => {
            const emotion = curr.emotion;
            acc[emotion] = (acc[emotion] || 0) + 1;
            return acc;
        }, {});

        const totalEmotions = emotions.length;
        const avgConfidence = (emotions.reduce((acc, curr) => acc + parseFloat(curr.confidence), 0) / totalEmotions).toFixed(2);

        // Encontrar la emoción predominante
        let dominantEmotion = '-';
        let maxCount = 0;
        for (const [emo, count] of Object.entries(emotionCounts)) {
            if (count > maxCount) {
                maxCount = count;
                dominantEmotion = emo;
            }
        }

        return {
            emotionCounts,
            totalEmotions,
            avgConfidence,
            dominantEmotion
        };
    }, [emotions]);

    const formattedDate = session?.started_at ? new Date(session.started_at).toLocaleString() : 'No disponible';

    // Colores por emoción para un look más visual
    const emotionColors = {
        happy: 'bg-green-500',
        sad: 'bg-blue-500',
        angry: 'bg-red-500',
        surprise: 'bg-yellow-500',
        neutral: 'bg-gray-400',
        fear: 'bg-purple-500',
        disgust: 'bg-orange-500',
        default: 'bg-indigo-500' // reserva
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800 tracking-tight">
                    Estadísticas de la Sesión
                </h2>
            }
        >
            <Head title="Estadísticas de Sesión" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* Tarjeta de Resumen */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100 transition-all hover:shadow-2xl duration-300">
                        <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-800 text-white relative overflow-hidden">
                            {/* Decorative background shapes */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-400 opacity-20 rounded-full blur-2xl"></div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h3 className="text-3xl font-extrabold tracking-tight mb-2">Resumen del Juego</h3>
                                    <p className="text-indigo-100 text-lg">Jugador: <span className="font-semibold text-white">{user?.name || 'Desconocido'}</span></p>
                                    <p className="text-indigo-200 text-sm mt-1">
                                        ID de Sesión: #{session?.id} &bull; Empezó: {formattedDate}
                                    </p>
                                </div>
                                <div className="text-right bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-inner">
                                    <p className="text-sm uppercase tracking-wider text-indigo-100 font-semibold mb-1">Emoción Predominante</p>
                                    <p className="text-4xl font-black capitalize text-white drop-shadow-md">
                                        {stats?.dominantEmotion || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contenido de Estadísticas */}
                        <div className="p-8">
                            {!stats ? (
                                <div className="text-center py-12 text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-lg">No hay datos emocionales registrados para esta sesión.</p>
                                </div>
                            ) : (
                                <div>
                                    {/* Métrica General */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                        <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 mb-1">Total de Lecturas</p>
                                                <p className="text-3xl font-bold text-gray-800">{stats.totalEmotions}</p>
                                            </div>
                                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 mb-1">Confianza Media</p>
                                                <p className="text-3xl font-bold text-gray-800">{Math.round(stats.avgConfidence * 100)}%</p>
                                            </div>
                                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gráfico de Barras de Emociones */}
                                    <div className="mt-8">
                                        <h4 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-100">Distribución de Emociones</h4>
                                        <div className="space-y-5">
                                            {Object.entries(stats.emotionCounts)
                                                .sort((a, b) => b[1] - a[1]) // Ordenar de mayor a menor
                                                .map(([emotion, count]) => {
                                                    const percentage = ((count / stats.totalEmotions) * 100).toFixed(1);
                                                    const bgColor = emotionColors[emotion.toLowerCase()] || emotionColors.default;

                                                    return (
                                                        <div key={emotion} className="relative group">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-sm font-semibold text-gray-700 capitalize group-hover:text-indigo-600 transition-colors">{emotion}</span>
                                                                <span className="text-sm text-gray-500 font-medium">{count} ({percentage}%)</span>
                                                            </div>
                                                            <div className="w-full bg-gray-100 rounded-full h-3.5 mb-1 overflow-hidden shadow-inner">
                                                                <div
                                                                    className={`h-3.5 rounded-full ${bgColor} transition-all duration-1000 ease-out relative`}
                                                                    style={{ width: `${percentage}%` }}
                                                                >
                                                                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-white opacity-20 hover:opacity-0 transition-opacity"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Linea de tiempo (opcional, si hay suficientes datos cronolo´gicos) */}
                    {stats && emotions.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-lg sm:rounded-2xl border border-gray-100 p-8">
                            <h4 className="text-xl font-bold text-gray-800 mb-6">Registro Crudo (Últimas detecciones)</h4>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-x-auto">
                                <table className="min-w-full text-left text-sm text-gray-600">
                                    <thead>
                                        <tr className="border-b border-gray-300">
                                            <th className="px-4 py-2 font-semibold">Tiempo / ID</th>
                                            <th className="px-4 py-2 font-semibold">Emoción</th>
                                            <th className="px-4 py-2 font-semibold">Confianza</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {emotions.slice(-10).reverse().map((emo, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                                                <td className="px-4 py-2">{emo.game_time ? `${emo.game_time}s` : `Id: ${emo.id}`}</td>
                                                <td className="px-4 py-2 capitalize font-medium text-gray-800">{emo.emotion}</td>
                                                <td className="px-4 py-2">{(emo.confidence * 100).toFixed(1)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {emotions.length > 10 && (
                                    <p className="text-xs text-gray-400 mt-3 text-center italic">Mostrando las últimas 10 emociones capturadas.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
