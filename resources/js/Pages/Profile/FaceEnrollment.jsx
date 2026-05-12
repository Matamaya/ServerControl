import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function FaceEnrollment({ auth }) {
    const { flash } = usePage().props;
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    const startCamera = async () => {
        setImagePreview(null);
        setSuccessMessage('');
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            alert('No se pudo acceder a la cámara. Asegúrate de dar los permisos.');
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64Image = canvas.toDataURL('image/jpeg', 0.95);
        setImagePreview(base64Image);

        // Turn off camera
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    const submitImage = () => {
        if (!imagePreview) return;

        setIsProcessing(true);

        router.post(
            route('face.enrollment.store'),
            { image: imagePreview },
            {
                onSuccess: () => {
                    setSuccessMessage('¡La imagen ha sido guardada y configurada correctamente en tu cuenta!');
                    setImagePreview(null);
                },
                onFinish: () => setIsProcessing(false),
                preserveScroll: true,
            }
        );
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setSuccessMessage('');
            };
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-100">
                    Registro de Reconocimiento Facial
                </h2>
            }
        >
            <Head title="Registro Facial" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-slate-900/50 backdrop-blur-md p-4 shadow sm:rounded-lg sm:p-8 border border-slate-800">
                        <section className="max-w-xl mx-auto flex flex-col items-center">
                            <header className="text-center w-full">
                                <h2 className="text-lg font-medium text-slate-100">
                                    Configurar Acceso Biométrico
                                </h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    Tómate una foto para poder acceder a la plataforma mediante reconocimiento facial sin usar contraseña.
                                </p>
                            </header>

                            {flash?.message && !successMessage && (
                                <div className="mt-4 p-4 text-sm text-green-400 bg-green-500/20 rounded-md border border-green-500/50 text-center font-medium w-full">
                                    {flash.message}
                                </div>
                            )}

                            {successMessage && (
                                <div className="mt-4 p-4 text-sm text-green-400 bg-green-500/20 rounded-md border border-green-500/50 text-center font-medium w-full">
                                    {successMessage}
                                </div>
                            )}

                            <div className="mt-6 flex flex-col items-center w-full">
                                {imagePreview ? (
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <div className="relative rounded-lg overflow-hidden border-2 border-sky-500/50 w-full max-w-[400px] aspect-video bg-slate-800">
                                            <img src={imagePreview} alt="Captura" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setSuccessMessage('');
                                                }}
                                                className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md text-sm font-medium hover:bg-slate-600 transition shadow-sm"
                                                disabled={isProcessing}
                                            >
                                                Descartar y Volver
                                            </button>
                                            <button
                                                onClick={submitImage}
                                                disabled={isProcessing}
                                                className="px-4 py-2 bg-sky-500 text-white rounded-md text-sm font-medium hover:bg-sky-600 transition shadow-sm disabled:opacity-50"
                                            >
                                                {isProcessing ? 'Guardando...' : 'Guardar y Establecer'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        {!stream ? (
                                            <div className="flex flex-col items-center gap-3 w-full">
                                                <button
                                                    onClick={startCamera}
                                                    className="px-6 py-3 mt-4 bg-sky-500 text-white rounded-md text-base font-semibold hover:bg-sky-600 transition shadow-md w-full max-w-xs flex justify-center items-center"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.66-.9l.28-.42A2 2 0 019.53 5h4.94a2 2 0 011.66.9l.28.42a2 2 0 001.66.9H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Activar Cámara
                                                </button>
                                                <span className="text-slate-500 text-sm font-medium">O TAMBIÉN</span>
                                                <label className="cursor-pointer px-6 py-3 bg-slate-800 text-slate-100 rounded-md text-base font-semibold hover:bg-slate-700 transition shadow-sm border border-slate-700 w-full max-w-xs text-center flex justify-center items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                    Subir Foto (DNI/Perfil)
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleFileUpload}
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative rounded-lg overflow-hidden border border-slate-700 w-full max-w-[400px] aspect-video bg-black shadow-inner flex justify-center items-center">
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        className="w-full h-full object-cover transform -scale-x-100"
                                                    />
                                                    <canvas ref={canvasRef} className="hidden" />
                                                </div>

                                                <button
                                                    onClick={captureImage}
                                                    className="w-full justify-center max-w-[400px] mt-2 px-6 py-3 bg-sky-500 text-white rounded-md text-base font-semibold hover:bg-sky-600 transition shadow-md flex items-center"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.66-.9l.28-.42A2 2 0 019.53 5h4.94a2 2 0 011.66.9l.28.42a2 2 0 001.66.9H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Capturar Rostro
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
