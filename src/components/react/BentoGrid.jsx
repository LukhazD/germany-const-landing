/** @jsxImportSource react */
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Ruler, Briefcase, Layers, Linkedin, Instagram, Phone, FileSearch } from 'lucide-react';
import ProjectAnalysisModal from './ProjectAnalysisModal';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function BentoGrid() {
    const gridRef = useRef(null);
    const carouselRef = useRef(null);
    const sliderRef = useRef(null);
    const [analysisModalOpen, setAnalysisModalOpen] = useState(false);



    // Carousel Data
    const carouselData = [
        {
            title: "Climatización de Alta Eficiencia",
            desc: "Aerotermia, Suelo Radiante, VMC.",
            img: "/pictures/House.jpg",
            details: "Sistemas de alta eficiencia para confort térmico."
        },
        {
            title: "Aislamiento Térmico y Acústico",
            desc: "SATE, Insuflado, Ventanas RPT.",
            img: "/pictures/Apartament.jpg",
            details: "Máximo ahorro energético y confort acústico."
        },
        {
            title: "Nuevos Materiales y Acabados",
            desc: "Microcemento, Porcelánico imitación madera.",
            img: "/pictures/Kitchen.jpg",
            details: "Estética industrial y moderna."
        },
        {
            title: "Domótica y Electricidad",
            desc: "Iluminación LED, Persianas WiFi.",
            img: "/pictures/Project.webp",
            details: "Hogares inteligentes y conectados."
        }
    ];

    /* ------------------- Animation Logic ------------------- */
    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Staggered entry for standard cards (not the carousel which has its own logic)
            gsap.from('.bento-card-anim', {
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out',
            });
            gsap.to('.bento-card-anim', {
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: 'top 80%',
                },
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out',
            });
            // 2. Carousel Entrance Animation (Fast Scroll Preview)
            // When the carousel comes into view, quickly scroll right then back to show interactivity.
            const slider = sliderRef.current;
            if (slider) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: carouselRef.current,
                        start: "top 75%",
                    }
                });

                tl.to(slider, {
                    scrollLeft: 100, // Peek next slide
                    duration: 1.0,
                    ease: "power2.inOut"
                }).to(slider, {
                    scrollLeft: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }

        }, gridRef);

        return () => ctx.revert();
    }, []);

    /* ------------------- Auto-Slide Logic ------------------- */
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % carouselData.length);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(interval);
    }, []);

    // Sync scroll position with current index
    useEffect(() => {
        if (!sliderRef.current) return;
        const slider = sliderRef.current;
        const cardWidth = slider.clientWidth; // Width of one slide (since min-w-full)

        gsap.to(slider, {
            scrollLeft: currentIndex * cardWidth,
            duration: 1.2,
            ease: "power3.inOut"
        });
    }, [currentIndex]);

    return (
        <section ref={gridRef} id="services" className="bg-background min-h-screen p-4 md:p-10 flex flex-col justify-center pb-20">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">

                {/* Card 1: Services Carousel (Main Module) - 2x2 - Replaces 'Reformas Integrales' */}
                <div ref={carouselRef} className="bento-card-anim group col-span-1 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 h-full min-h-[300px]">

                    <div ref={sliderRef} className="flex h-full w-full overflow-x-hidden flex-nowrap scroll-smooth">
                        {carouselData.map((item, idx) => (
                            <div key={idx} className="min-w-full h-full relative flex-shrink-0">
                                {/* Background Image */}
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${item.img})` }}></div>
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                                {/* Text Content */}
                                <div className="absolute bottom-0 left-0 p-8 z-20 w-full mb-12">
                                    <div className="mb-4 p-2 bg-action/80 w-fit rounded-lg text-white backdrop-blur-sm text-xs uppercase font-bold tracking-wider">
                                        {idx + 1} / {carouselData.length} &bull; Servicios
                                    </div>
                                    <h3 className="text-3xl md:text-5xl text-white font-bold mb-3 leading-tight text-balance">{item.title}</h3>
                                    <p className="text-gray-200 font-medium text-lg mb-1">{item.desc}</p>
                                    <p className="text-gray-400 text-sm hidden md:block">{item.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="absolute bottom-8 right-8 z-30 flex gap-2">
                        {carouselData.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all duration-300 shadow-sm ${currentIndex === idx ? 'bg-action w-8' : 'bg-white/50 w-2 hover:bg-white'}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Card 2: Bolsa de Empleo (Job Portal) - 1x2 */}
                <div
                    onClick={() => window.location.href = '/jobs'}
                    className="bento-card-anim group col-span-1 md:col-span-2 md:row-span-1 relative overflow-hidden rounded-3xl bg-action/10 border border-action/20 hover:bg-action/20 transition-all duration-300 cursor-pointer flex flex-col justify-start gap-6 h-full"
                >
                    <div className="p-8 text-action pb-0">
                        <Briefcase size={32} />
                    </div>
                    <div className="p-8 pt-0 flex flex-col gap-3">
                        <h3 className="text-2xl text-white font-bold">Bolsa de Empleo</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Únete a nuestro equipo de alto rendimiento. Buscamos talento para gestionar proyectos internacionales con los más altos estándares.
                        </p>
                        <ul className="text-sm text-gray-400 space-y-1 mt-2">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-action rounded-full"></span>Vacantes en Alemania y España</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-action rounded-full"></span>Crecimiento profesional</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-action rounded-full"></span>Formación continua</li>
                        </ul>
                    </div>
                </div>

                {/* Card 3: Project Management - 1x1 */}
                <div className="bento-card-anim group col-span-1 md:col-span-1 md:row-span-1 relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-8 flex flex-col justify-start gap-6 hover:bg-neutral-800 transition-colors h-full">
                    <div className="text-secondary">
                        <Briefcase size={32} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold text-xl">Gestión de Obra</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Control integral del proyecto para garantizar plazos y costes.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Lean 5S</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Costes</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Plazos</span>
                        </div>
                    </div>
                </div>

                {/* Card 4: Interiorismo - 1x1 */}
                <div className="bento-card-anim group col-span-1 md:col-span-1 md:row-span-1 relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-8 flex flex-col justify-start gap-6 hover:bg-neutral-800 transition-colors h-full">
                    <div className="text-action">
                        <Layers size={32} />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold text-xl">Interiorismo</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Diseño que fusiona estética y funcionalidad en cada espacio.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Lujo</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Confort</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Luz</span>
                        </div>
                    </div>
                </div>

                {/* Card 5: Análisis de Proyecto (Wide) - 2x1 */}
                <div
                    onClick={() => setAnalysisModalOpen(true)}
                    className="bento-card-anim group col-span-1 md:col-span-2 md:row-span-1 relative overflow-hidden rounded-3xl bg-neutral-800 border border-neutral-700 flex items-center p-8 hover:border-action transition-all cursor-pointer h-full"
                >
                    <div className="mr-6 p-4 bg-background rounded-2xl text-white group-hover:bg-action/20 group-hover:text-action transition-colors">
                        <FileSearch size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl text-white font-bold">Análisis de Proyecto</h3>
                        <p className="text-gray-400">
                            Evaluamos la viabilidad de tu proyecto, obra nueva o reforma. Solicita un estudio técnico y económico detallado.
                        </p>
                    </div>
                </div>

                {/* Card 6: Contacto - 2x1 */}
                <div className="bento-card-anim group col-span-1 md:col-span-2 md:row-span-1 relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-center p-8 hover:border-action transition-all h-full">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/5 rounded-xl text-white group-hover:bg-action group-hover:text-white transition-colors">
                            <Phone size={24} />
                        </div>
                        <h3 className="text-2xl text-white font-bold tracking-tight">Contacto</h3>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                            <span className="text-gray-400 text-sm">Teléfono</span>
                            <span className="text-white font-mono text-sm">+34 900 000 000</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                            <span className="text-gray-400 text-sm">Email</span>
                            <span className="text-white font-mono text-sm">contacto@germanyconst.es</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                            <span className="text-gray-400 text-sm">Oficina</span>
                            <span className="text-white text-sm text-right">Barcelona, ES</span>
                        </div>
                    </div>
                </div>
                {/* Footer Module - 4x1 (Full Width) */}
                <div className="bento-card-anim group p-8 gap-4 col-span-1 md:col-span-4 relative overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between hover:border-action transition-all cursor-default h-full">

                    {/* Top Row: Brand & Socials */}
                    <div className="flex justify-between items-start w-full">
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-serif text-action mb-2 tracking-tighter">GC</h2>
                            <p className="text-neutral-400 text-sm max-w-xs leading-relaxed">
                                Construcción y arquitectura de vanguardia. <br />
                                Alemania &bull; España
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white hover:bg-action transition-colors">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white hover:bg-action transition-colors">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Bottom Row: Policies & Copyright */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full mt-8 md:mt-0">
                        <div className="flex flex-col gap-1 text-sm text-neutral-500 font-medium">
                            <a href="/privacy" className="hover:text-white transition-colors">Política de privacidad</a>
                            <a href="#" className="hover:text-white transition-colors">Términos y condiciones</a>
                        </div>

                        <div className="text-neutral-600 text-xs mt-6 md:mt-0 text-right">
                            &copy; {new Date().getFullYear()} Germany Const. Todos los derechos reservados.
                        </div>
                    </div>
                </div>

            </div>
            {analysisModalOpen && <ProjectAnalysisModal onClose={() => setAnalysisModalOpen(false)} />}
        </section >
    );
}
