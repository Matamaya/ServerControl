import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [isFacialLogin, setIsFacialLogin] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [facialProcessing, setFacialProcessing] = useState(false);
    const [facialMessage, setFacialMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const iniciarCamara = async () => {
        if (!data.email) {
            alert('Por favor, ingresa tu email primero para buscar tu registro.');
            return;
        }
        setIsFacialLogin(true);
        setFacialMessage({ type: '', text: '' });
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error("Error al acceder a la cámara:", error);
            setFacialMessage({ type: 'error', text: 'No se pudo acceder a la cámara. Revisa los permisos.' });
        }
    };

    const cancelarFacial = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsFacialLogin(false);
        setFacialMessage({ type: '', text: '' });
    };

    const submitFacial = () => {
        if (!data.email) {
            alert('Por favor, ingresa tu email.');
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], "foto_capturada.jpg", { type: "image/jpeg" });
            
            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('foto_webcam', file);

            setFacialProcessing(true);
            setFacialMessage({ type: 'info', text: 'Enviando imagen...' });

            router.post(route('login.facial'), formData, {
                onSuccess: () => {
                    setFacialMessage({ type: 'success', text: '¡Identidad verificada! Entrando...' });
                },
                onError: (errs) => {
                    setFacialProcessing(false);
                    if (errs.facial) {
                        setFacialMessage({ type: 'error', text: errs.facial });
                    } else if (errs.email) {
                        setFacialMessage({ type: 'error', text: errs.email });
                    } else {
                        setFacialMessage({ type: 'error', text: 'Error desconocido durante la verificación.' });
                    }
                }
            });
        }, 'image/jpeg');
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        disabled={isFacialLogin}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {!isFacialLogin && (
                    <>
                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4 flex flex-col gap-2 relative">
                            <div className="block">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                    />
                                    <span className="ms-2 text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label>
                            </div>
                            
                            <button
                                type="button"
                                onClick={iniciarCamara}
                                className="text-sm text-indigo-600 hover:text-indigo-900 underline text-left mt-1"
                            >
                                Usar reconocimiento facial
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Forgot your password?
                                </Link>
                            )}

                            <PrimaryButton className="ms-4" disabled={processing}>
                                Log in
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </form>

            {isFacialLogin && (
                <div className="mt-4 flex flex-col items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 text-center font-medium">Mira a la cámara para iniciar sesión</p>
                    
                    <div className="relative rounded-lg overflow-hidden border border-gray-300 w-full max-w-[320px] aspect-video bg-black shadow-inner">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover transform -scale-x-100"
                        ></video>
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    </div>

                    {facialMessage.text && (
                        <div className={`w-full p-3 rounded-md text-sm font-medium text-center ${
                            facialMessage.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
                            facialMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                            'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                            {facialMessage.text}
                        </div>
                    )}

                    <div className="flex w-full gap-2 mt-2">
                        <button
                            type="button"
                            onClick={cancelarFacial}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition"
                            disabled={facialProcessing || facialMessage.type === 'success'}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={submitFacial}
                            className={`flex-1 px-4 py-2 ${
                                facialProcessing || facialMessage.type === 'success' ? 'bg-indigo-400' : 'bg-indigo-600'
                            } text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition flex justify-center items-center shadow-sm`}
                            disabled={facialProcessing || facialMessage.type === 'success'}
                        >
                            {facialProcessing ? 'Verificando...' : '📸 Entrar'}
                        </button>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
