import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Registro de Reconocimiento Facial
                </h2>
            }
        >
            <Head title="Registro Facial" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <section className="max-w-xl mx-auto flex flex-col items-center">
                            <header className="text-center w-full">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Configurar Acceso Biométrico
                                </h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    Tómate una foto para poder acceder a la plataforma mediante reconocimiento facial sin usar contraseña.
                                </p>
                            </header>

                            {flash?.message && !successMessage && (
                                <div className="mt-4 p-4 text-sm text-green-700 bg-green-100 rounded-md border border-green-200 text-center font-medium">
                                    {flash.message}
                                </div>
                            )}

                            {successMessage && (
                                <div className="mt-4 p-4 text-sm text-green-700 bg-green-100 rounded-md border border-green-200 text-center font-medium">
                                    {successMessage}
                                </div>
                            )}

                            <div className="mt-6 flex flex-col items-center">
                                {imagePreview ? (
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <div className="relative rounded-lg overflow-hidden border-2 border-indigo-300 w-full max-w-[400px] aspect-video bg-gray-100">
                                            <img src={imagePreview} alt="Captura" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setSuccessMessage('');
                                                }}
                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition shadow-sm"
                                                disabled={isProcessing}
                                            >
                                                Descartar y Volver
                                            </button>
                                            <PrimaryButton onClick={submitImage} disabled={isProcessing}>
                                                {isProcessing ? 'Guardando...' : 'Guardar y Establecer'}
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        {!stream ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <button
                                                    onClick={startCamera}
                                                    className="px-6 py-3 mt-4 bg-indigo-600 text-white rounded-md text-base font-semibold hover:bg-indigo-700 transition shadow-md w-full max-w-xs"
                                                >
                                                    📷 Activar Cámara
                                                </button>
                                                <span className="text-gray-500 text-sm font-medium">O TAMBIÉN</span>
                                                <label className="cursor-pointer px-6 py-3 bg-gray-100 text-gray-800 rounded-md text-base font-semibold hover:bg-gray-200 transition shadow-sm border border-gray-300 w-full max-w-xs text-center flex justify-center items-center">
                                                    📁 Subir Foto (DNI/Perfil)
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
                                                <div className="relative rounded-lg overflow-hidden border border-gray-300 w-full max-w-[400px] aspect-video bg-black shadow-inner flex justify-center items-center">
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        className="w-full h-full object-cover transform -scale-x-100"
                                                    />
                                                    <canvas ref={canvasRef} className="hidden" />
                                                </div>
                                                
                                                <PrimaryButton onClick={captureImage} className="w-full justify-center max-w-[400px] mt-2">
                                                    📸 Capturar Rostro
                                                </PrimaryButton>
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
