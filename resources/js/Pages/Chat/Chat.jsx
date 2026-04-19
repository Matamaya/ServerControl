import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Chat({ auth, initialMessages }) {
    const [messages, setMessages] = useState(initialMessages || []);
    const { data, setData, post, reset, processing } = useForm({
        content: '',
    });

    useEffect(() => {
        // Escuchar el canal de Reverb
        window.Echo.channel('chat.general')
            .listen('MessageSend', (e) => {
                setMessages((prev) => [...prev, e.message]);
            });

        return () => window.Echo.leave('chat.general');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('messages.store'), {
            onSuccess: () => reset('content'),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2>Sala de Chat</h2>}>
            <Head title="Chat" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 bg-white p-6 rounded shadow">
                    <div className="h-80 overflow-y-auto mb-4 p-4 border rounded space-y-2">
                        {messages.map((msg, i) => (
                            <div key={i} className="text-sm">
                                <strong>{msg.user.name}:</strong> {msg.content}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={submit} className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 border-gray-300 rounded"
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                        />
                        <button disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}