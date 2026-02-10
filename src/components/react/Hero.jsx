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
            // 1. Brand Name Animation (New)
            gsap.fromTo('.brand-name-char',
                { opacity: 0, x: -10 },
                {
                    opacity: 1,
                    x: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: 0.5
                }
            );

            // 2. Logo Line Drawing Animation
            if (logoPathRef.current) {
                const length = logoPathRef.current.getTotalLength();
                gsap.set(logoPathRef.current, { strokeDasharray: length, strokeDashoffset: length });
                gsap.to(logoPathRef.current, {
                    strokeDashoffset: 0,
                    duration: 2,
                    ease: 'power2.inOut',
                    delay: 1.5 // Delay slightly after text starts
                });

                // Logo Text Fade In
                gsap.to('.logo-text-gc', { opacity: 1, duration: 1, delay: 2.5 });
                gsap.to('.logo-text-build', { opacity: 1, duration: 1, delay: 3 });
            }

            // 3. Text Stagger Animation (Main Title)
            const tl = gsap.timeline({ delay: 3.5 }); // Wait for logo
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

            // 4. Scroll Shrink Effect
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

    // Brand Name Split
    const brandName = "Germany Const";
    const brandChars = brandName.split('').map((char, index) => (
        <span key={index} className="brand-name-char inline-block whitespace-pre opacity-0">
            {char}
        </span>
    ));

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

                    {/* Brand Name Animated */}
                    <div className="text-xl md:text-3xl font-serif italic tracking-widest mb-6 text-center text-action/80">
                        {brandChars}
                    </div>

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

            {/* <ServicesHeader delay={3} /> */}

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
                    <span className="text-primary text-xs tracking-[0.2em] uppercase font-bold">Metodología & Experiencia</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-white mt-2 mb-4">Construcción Industrializada al 100%</h2>
                    <div className="h-1 w-20 bg-primary/50 rounded-full"></div>
                </div>

                <div className="space-y-6 text-gray-300 font-light leading-relaxed">

                    {/* Experience Badge */}
                    <div className="flex items-center gap-4 p-4 bg-action/10 border border-action/20 rounded-xl">
                        <div className="text-4xl font-bold text-action">+20</div>
                        <div>
                            <p className="text-white font-medium">Años de Experiencia</p>
                            <p className="text-gray-400 text-sm">Especialistas en construcción industrializada y pasiva</p>
                        </div>
                    </div>

                    <p>
                        <strong className="text-white block mb-2">Construcciones Pasivas & Prefabricados</strong>
                        Somos una empresa especializada en construcción 100% industrializada y pasiva. Colaboramos con <span className="text-action font-medium">Prefabricados Molins</span>, líderes en el sector, trabajando con sistemas de hoja principal y secundaria de hormigón, junto con aislamientos de alta eficiencia y ventanas incrustadas de última generación.
                    </p>

                    <p>
                        <strong className="text-white block mb-2">Metodología Lean 5S</strong>
                        La implementación de nuestro flujo de trabajo basado en <span className="text-action font-medium">Lean 5S</span> nos permite optimizar cada fase del proceso constructivo, obteniendo resultados excepcionales:
                    </p>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                            <div className="text-2xl font-bold text-action mb-1">15%</div>
                            <p className="text-sm text-gray-400">Beneficio Neto</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                            <div className="text-2xl font-bold text-action mb-1">-30%</div>
                            <p className="text-sm text-gray-400">Mano de Obra</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                            <div className="text-2xl font-bold text-action mb-1">100%</div>
                            <p className="text-sm text-gray-400">Planificación Real</p>
                        </div>
                    </div>

                    <p>
                        <strong className="text-white block mb-2">Servicios para Empresas</strong>
                        Nuestros servicios están diseñados para empresas con alta demanda en todas las fases de la construcción que buscan mejorar su fluidez constructiva y optimizar recursos:
                    </p>

                    <ul className="list-none space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-action rounded-full mt-2 flex-shrink-0"></span>
                            <span><span className="text-white font-medium">Operarios Cualificados:</span> Personal especializado con formación continua en técnicas industrializadas.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-action rounded-full mt-2 flex-shrink-0"></span>
                            <span><span className="text-white font-medium">Encargados de Obra:</span> Supervisión técnica y coordinación de equipos en terreno.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-action rounded-full mt-2 flex-shrink-0"></span>
                            <span><span className="text-white font-medium">Gestión de Proyectos:</span> Control integral de plazos, costes y calidad.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-action rounded-full mt-2 flex-shrink-0"></span>
                            <span><span className="text-white font-medium">Consultoría & Diseño:</span> Asesoramiento técnico y diseño optimizado para construcción industrializada.</span>
                        </li>
                    </ul>

                    {/* Divider */}
                    <div className="border-t border-white/10 my-8"></div>

                    {/* ISO International Standards Section */}
                    <div className="mb-6">
                        <span className="text-primary text-xs tracking-[0.2em] uppercase font-bold">Certificaciones</span>
                        <h3 className="text-2xl font-serif text-white mt-2">Estándares Internacionales ISO</h3>
                    </div>

                    <p>
                        Contamos con <span className="text-action font-medium">estándares internacionales</span> que hacen vuestros proyectos más rentables. Con nuestras formas constructivas podréis construir en cualquier parte del mundo globalizado, dentro de los estándares constructivos homologados.
                    </p>

                    <p className="text-sm text-gray-400">
                        Las normas ISO, creadas por la Organización Internacional de Normalización, establecen requisitos homogéneos para la gestión, productos y servicios, garantizando calidad, seguridad y eficiencia global. Aceptadas en <span className="text-white font-medium">193 países</span>.
                    </p>

                    {/* ISO Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                            <div className="text-action font-bold mb-1">Homogeneidad</div>
                            <p className="text-sm text-gray-400">Productos y servicios con los mismos estándares independientemente de su origen.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                            <div className="text-action font-bold mb-1">Mejora Continua</div>
                            <p className="text-sm text-gray-400">Procesos eficientes, reducción de errores y optimización de rentabilidad.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                            <div className="text-action font-bold mb-1">Confianza</div>
                            <p className="text-sm text-gray-400">Refuerza la confianza del cliente y diferencia a las empresas en el mercado.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                            <div className="text-action font-bold mb-1">Competitividad</div>
                            <p className="text-sm text-gray-400">Reduce costes y mejora el posicionamiento de las organizaciones.</p>
                        </div>
                    </div>

                    {/* ISO Certifications */}
                    <div className="flex flex-wrap gap-2 my-4">
                        <span className="px-3 py-1 bg-action/20 text-action text-xs font-bold rounded-full">ISO 9001 · Calidad</span>
                        <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-full">ISO 14001 · Medioambiente</span>
                        <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-full">ISO 27001 · Seguridad</span>
                        <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-full">ISO 22000 · Inocuidad</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10 my-8"></div>

                    {/* ISO 19650 BIM Section */}
                    <div className="mb-6">
                        <span className="text-primary text-xs tracking-[0.2em] uppercase font-bold">Metodología BIM</span>
                        <h3 className="text-2xl font-serif text-white mt-2">ISO 19650 · Gestión de Información</h3>
                    </div>

                    <p>
                        Implantamos la norma <span className="text-action font-medium">ISO 19650</span> en todas las empresas con las que trabajamos. Este método busca la rentabilidad de tiempo, coste, planificación, gestión y flujos de trabajo en la producción mediante <span className="text-action font-medium">BIM (Building Information Modelling)</span>.
                    </p>

                    <p className="text-sm text-gray-400">
                        Establece procesos colaborativos para la producción, gestión e intercambio de información, mejorando la eficiencia y reduciendo errores mediante un <span className="text-white font-medium">Entorno Común de Datos (CDE)</span>.
                    </p>

                    {/* ISO 19650 Structure */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-xl my-6">
                        <p className="text-white font-medium mb-3">Estructura ISO 19650:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-action rounded-full"></span>
                                <span><span className="text-gray-400">19650-1:</span> Conceptos y principios</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-action rounded-full"></span>
                                <span><span className="text-gray-400">19650-2:</span> Fase de entrega</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-action rounded-full"></span>
                                <span><span className="text-gray-400">19650-3:</span> Fase de operación</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-action rounded-full"></span>
                                <span><span className="text-gray-400">19650-5:</span> Seguridad de información</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400">
                        <span className="text-white font-medium">Entorno Común de Datos (CDE):</span> No es solo tecnología, sino un proceso gestionado de intercambio de información (trabajo en progreso, compartido, publicado y archivado) que garantiza que la información correcta llegue a la persona adecuada en el momento justo.
                    </p>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl mt-8">
                        <p className="text-sm italic text-gray-400">
                            "Más eficiencia operativa, menos mano de obra tradicional. Ejecutamos con las cualidades que garantizan rentabilidad y excelencia."
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


