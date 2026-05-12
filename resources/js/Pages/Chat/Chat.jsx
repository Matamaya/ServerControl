import React, { useEffect, useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Chat({ auth, initialMessages }) {
    const [messages, setMessages] = useState(initialMessages || []);
    const messagesEndRef = useRef(null);

    const { data, setData, post, reset, processing } = useForm({
        content: '',
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (window.Echo) {
            window.Echo.channel('chat.general')
                .listen('MessageSend', (e) => {
                    setMessages((prev) => [...prev, e.message]);
                });
        }

        const interval = setInterval(() => {
            router.reload({ only: ['initialMessages'] });
        }, 5000);

        return () => {
            if (window.Echo) window.Echo.leave('chat.general');
            clearInterval(interval);
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('messages.store'), {
            onSuccess: () => {
                reset('content');
            },
        });
    };

    const clearChat = () => {
        if (confirm('¿Estás seguro de que quieres borrar todos los mensajes?')) {
            router.delete(route('messages.clear'));
        }
    };

    const isAdmin = auth.user.roles.some(r => r.name === 'administrador');

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-slate-100 leading-tight">Sala de Chat</h2>
                    {isAdmin && (
                        <button 
                            onClick={clearChat}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm font-semibold transition"
                        >
                            Borrar Historial
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Chat" />
            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-sm sm:rounded-lg p-6 border border-slate-800">
                        <div className="h-96 overflow-y-auto mb-4 p-4 border border-slate-800 rounded-lg bg-slate-950/50 space-y-3">
                            {messages.length === 0 && (
                                <p className="text-slate-400 text-center py-10">No hay mensajes aún. ¡Sé el primero!</p>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.user_id === auth.user.id ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                        msg.user_id === auth.user.id 
                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                        : 'bg-slate-800 text-slate-100 rounded-bl-none'
                                    }`}>
                                        <div className="text-xs font-bold mb-1 opacity-75">
                                            {msg.user_id === auth.user.id ? 'Tú' : msg.user.name}
                                        </div>
                                        <div className="text-sm">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        <form onSubmit={submit} className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-slate-800 text-white border-slate-700 focus:border-sky-500 focus:ring-sky-500 rounded-lg shadow-sm"
                                placeholder="Escribe un mensaje..."
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                autoComplete="off"
                            />
                            <button 
                                disabled={processing || !data.content.trim()} 
                                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
                            >
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}