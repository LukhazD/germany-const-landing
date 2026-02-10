import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function ProjectAnalysisModal({ onClose }) {
    const modalRef = useRef(null);
    const contentRef = useRef(null);
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
            tl.fromTo(contentRef.current,
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' },
                '-=0.3'
            );
        }, modalRef);

        return () => {
            document.body.style.overflow = originalStyle;
            ctx.revert();
        };
    }, []);

    const handleClose = () => {
        const tl = gsap.timeline({ onComplete: onClose });
        tl.to(contentRef.current, { opacity: 0, y: 20, scale: 0.95, duration: 0.3 });
        tl.to(modalRef.current, { opacity: 0, duration: 0.3 }, '-=0.2');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        const formData = new FormData(e.target);

        try {
            const res = await fetch('/api/analysis', { // We'll need an API endpoint wrapper or use an Astro Action if configured
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(handleClose, 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div ref={modalRef} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md opacity-0">
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-[70] bg-white/10 rounded-full p-2"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div ref={contentRef} className="max-w-2xl w-full bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-y-auto max-h-[90vh] custom-scrollbar opacity-0">
                <div className="mb-6">
                    <h2 className="text-3xl font-serif text-white mb-2">Análisis de Proyecto</h2>
                    <p className="text-gray-400 text-sm">Déjanos los detalles y te contactaremos con un estudio preliminar.</p>
                </div>

                {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h3 className="text-xl text-white font-bold">¡Solicitud Recibida!</h3>
                        <p className="text-gray-400">Analizaremos tu proyecto y te contactaremos pronto.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Email de Contacto</label>
                                <input name="contactEmail" type="email" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="tu@email.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Teléfono</label>
                                <input name="contactPhone" type="tel" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="+34 600 000 000" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Tipo de Consulta</label>
                                <select name="queryType" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors">
                                    <option value="Obra Nueva">Obra Nueva</option>
                                    <option value="Rehabilitación">Rehabilitación</option>
                                    <option value="Reforma Integral">Reforma Integral</option>
                                    <option value="Proyecto Electricidad">Proyecto de Electricidad</option>
                                    <option value="Proyecto Fontanería">Proyecto de Fontanería</option>
                                    <option value="Sistemas de Energía">Sistemas de Energía (Aerotermia, Suelo Radiante)</option>
                                    <option value="Climatización">Climatización</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Nueva Construcción</label>
                                <select name="isNewConstruction" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors">
                                    <option value="true">Sí</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Detalle del Tipo de Proyecto</label>
                            <input name="projectTypeDetail" type="text" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="Ej: Vivienda Unifamiliar, Nave Industrial..." />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Ubicación</label>
                            <input name="location" type="text" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="Ciudad, Provincia" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Metros Cuadrados (m²)</label>
                                <input name="sqMeters" type="number" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="0" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Precio Objetivo (€/m²)</label>
                                <input name="pricePerSqMeter" type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="Opcional" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Detalles del Análisis / Comentarios</label>
                            <textarea name="analysisDetails" rows="3" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="Cuéntanos más sobre lo que necesitas..."></textarea>
                        </div>

                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary cursor-pointer accent-primary"
                            />
                            <label htmlFor="acceptTerms" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
                                He leído y acepto la <a href="/privacy" target="_blank" className="text-action underline hover:text-white transition-colors">Política de Privacidad</a> conforme al RGPD. Consiento el tratamiento de mis datos personales para gestionar mi solicitud de análisis de proyecto.
                            </label>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={status === 'submitting' || !acceptedTerms}
                                className="w-full py-4 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? 'Enviando...' : 'Solicitar Análisis'}
                            </button>
                            {status === 'error' && (
                                <p className="text-red-400 text-sm text-center mt-2">Hubo un error al enviar. Por favor intenta de nuevo.</p>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
