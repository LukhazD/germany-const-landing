/** @jsxImportSource react */
import React, { useEffect, useRef } from 'react';
import ServicesHeader from './ServicesHeader';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
    const containerRef = useRef(null);
    const logoPathRef = useRef(null);
    const textRef = useRef(null);
    const subTextRef = useRef(null);

    const [normsModalOpen, setNormsModalOpen] = React.useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Logo Line Drawing Animation
            if (logoPathRef.current) {
                const length = logoPathRef.current.getTotalLength();
                gsap.set(logoPathRef.current, { strokeDasharray: length, strokeDashoffset: length });
                gsap.to(logoPathRef.current, {
                    strokeDashoffset: 0,
                    duration: 2,
                    ease: 'power2.inOut',
                });

                // Logo Text Fade In
                gsap.to('.logo-text-gc', { opacity: 1, duration: 1, delay: 1 });
                gsap.to('.logo-text-build', { opacity: 1, duration: 1, delay: 1.5 });
            }

            // 2. Text Stagger Animation
            const tl = gsap.timeline({ delay: 0.5 });
            tl.fromTo(
                '.hero-title-char',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.05,
                    duration: 1,
                    ease: 'power3.out',
                }
            ).fromTo(
                '.hero-action-btn',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.2, duration: 1 },
                '-=0.5'
            );

            // 3. Scroll Shrink Effect
            gsap.to(containerRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=500', // Adjust scroll distance
                    scrub: true,
                },
                scale: 0.95,
                opacity: 0.8,
                borderRadius: '2rem',
                y: 50,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Helper to split text for stagger effect
    const title = "Construimos tu visión";
    const titleChars = title.split('').map((char, index) => (
        <span key={index} className="hero-title-char inline-block whitespace-pre">
            {char}
        </span>
    ));

    return (
        <>
            <section
                ref={containerRef}
                className="h-screen w-full flex flex-col items-center justify-center bg-background text-white relative overflow-hidden"
            >

                <div className="flex flex-col items-center z-10 w-full px-4">
                    <div className="mb-12 w-64 h-64 md:w-96 md:h-96 relative">
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 500 500"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                        >
                            <rect
                                ref={logoPathRef}
                                x="50" y="50" width="400" height="400"
                                fill="none"
                                stroke="#FF5722"
                                strokeWidth="4"
                            />

                            <text
                                x="240" y="280"
                                textAnchor="middle"
                                fill="#FF5722"
                                fontFamily="'Didot', 'Bodoni MT', 'Times New Roman', serif"
                                fontSize="220"
                                fontWeight="normal"
                                letterSpacing="-10"
                                className="logo-text-gc opacity-0"
                            >
                                GC
                            </text>

                            <text
                                x="250" y="380"
                                textAnchor="middle"
                                fill="#FF5722"
                                fontFamily="'Century Gothic', 'Helvetica Neue', Arial, sans-serif"
                                fontSize="50"
                                fontWeight="300"
                                letterSpacing="10"
                                style={{ textTransform: 'lowercase' }}
                                className="logo-text-build opacity-0"
                            >
                                building
                            </text>
                        </svg>
                    </div>

                    <h1 ref={textRef} className="text-4xl md:text-7xl font-bold tracking-tight mb-8 flex overflow-hidden text-center">
                        {titleChars}
                    </h1>

                    <div ref={subTextRef} className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-4xl mt-8">
                        <a
                            href="mailto:contacto@germanyconst.es"
                            className="hero-action-btn opacity-0 group"
                        >
                            <button className="pb-2 bg-transparent text-white border-b border-white/30 hover:border-white transition-all duration-500 flex items-center gap-3">
                                <span className="text-xs md:text-sm font-light tracking-[0.2em] uppercase text-gray-300 group-hover:text-white transition-colors">Diseño Técnicos Constructivos</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400 group-hover:text-white transition-colors group-hover:translate-x-1 transform duration-300">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </button>
                        </a>

                        <div className="hero-action-btn opacity-0 group cursor-pointer" onClick={() => setNormsModalOpen(true)}>
                            <button className="pb-2 bg-transparent text-white border-b border-white/30 hover:border-white transition-all duration-500 flex items-center gap-3">
                                <span className="text-xs md:text-sm font-light tracking-[0.2em] uppercase text-gray-300 group-hover:text-white transition-colors">Normas Constructivas</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400 group-hover:text-white transition-colors group-hover:translate-x-1 transform duration-300">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 animate-bounce text-secondary cursor-pointer z-10" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                </div>
            </section>

            <ServicesHeader delay={3} />

            {/* Norms Modal */}
            {normsModalOpen && <NormsModal onClose={() => setNormsModalOpen(false)} />}
        </>
    );
}

function NormsModal({ onClose }) {
    const modalRef = useRef(null);
    const contentRef = useRef(null);

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

            <div ref={contentRef} className="max-w-3xl w-full bg-zinc-900 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-y-auto max-h-[85vh] custom-scrollbar opacity-0">
                <div className="mb-8">
                    <span className="text-primary text-xs tracking-[0.2em] uppercase font-bold">Marco Técnico</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-white mt-2 mb-4">Normas Constructivas & ISO 9001</h2>
                    <div className="h-1 w-20 bg-primary/50 rounded-full"></div>
                </div>

                <div className="space-y-6 text-gray-300 font-light leading-relaxed">
                    <p>
                        <strong className="text-white block mb-2">Construcción Modular y Normativa Vigente</strong>
                        En el panorama actual, un 90% de las empresas de construcción modular operan en áreas grises respecto a las normativas estándar. Esto se debe a la lenta adaptación de los códigos técnicos a los nuevos sistemas industrializados. Sin embargo, en Germany Const, nos aseguramos de que cada proyecto no solo cumpla, sino que exceda los estándares de calidad y seguridad.
                    </p>

                    <p>
                        <strong className="text-white block mb-2">Nuestro Compromiso ISO 9001</strong>
                        Implementamos procesos rigurosos alineados con la ISO 9001 para garantizar la gestión de calidad en cada fase:
                    </p>

                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li>
                            <span className="text-white font-medium">Análisis de Viabilidad:</span> Evaluamos si un proyecto es viable bajo las normas constructivas o si solo se trata de una propuesta estética ("venta de diseño").
                        </li>
                        <li>
                            <span className="text-white font-medium">Adaptación Normativa:</span> Llevamos tus construcciones modulares al cumplimiento total de las normativas vigentes, asegurando que sean legalizables y seguras.
                        </li>
                        <li>
                            <span className="text-white font-medium">Control de Calidad:</span> Supervisión técnica desde la estructura hasta los acabados finales (aislamientos, eficiencia energética).
                        </li>
                    </ul>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl mt-8">
                        <p className="text-sm italic text-gray-400">
                            "Os llevamos a ese camino: llevar al día vuestras construcciones conforme a la ley y la excelencia técnica."
                        </p>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-white text-black font-medium text-sm tracking-widest uppercase hover:bg-gray-200 transition-colors rounded-lg"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}


