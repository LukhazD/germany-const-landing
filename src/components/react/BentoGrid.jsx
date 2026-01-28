/** @jsxImportSource react */
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Ruler, Briefcase, Leaf, Layers, Box, PaintRoller, Hammer, Linkedin, Instagram, Phone } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function BentoGrid() {
    const gridRef = useRef(null);
    const carouselRef = useRef(null);
    const sliderRef = useRef(null);

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
                y: -50,
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
        <section ref={gridRef} id="services" className="bg-background min-h-screen p-4 md:p-10 flex flex-col justify-center pb-24">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 max-h-[1500px] md:grid-cols-4 md:grid-rows-4 gap-6 h-auto">

                {/* Card 1: Services Carousel (Main Module) - 2x2 - Replaces 'Reformas Integrales' */}
                <div ref={carouselRef} className="bento-card-anim group col-span-1 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800">

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

                {/* Card 2: Arquitectura (Luxury) - 1x2 */}
                <div className="bento-card-anim group col-span-1 md:col-span-1 md:row-span-2 relative overflow-hidden rounded-3xl bg-luxury/10 border border-[#9B111E] hover:bg-luxury/20 transition-all duration-300 cursor-pointer flex flex-col justify-between">
                    <div className="p-8 text-luxury">
                        <Ruler size={32} />
                    </div>
                    <div className="p-8">
                        <h3 className="text-2xl text-white font-bold mb-1">Arquitectura</h3>
                        <p className="text-gray-400 text-sm">Diseño y planificación de alto nivel con estándares alemanes.</p>
                    </div>
                </div>

                {/* Card 3: Project Management - 1x1 */}
                <div className="bento-card-anim group col-span-1 md:col-span-1 md:row-span-1 relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between hover:bg-neutral-800 transition-colors">
                    <Briefcase className="text-secondary" />
                    <div>
                        <h4 className="text-white font-bold text-lg">Gestión de Obra</h4>
                        <p className="text-xs text-gray-400">Control total del proyecto. Sin desviaciones.</p>
                    </div>
                </div>

                {/* Card 4: Interiorismo - 1x1 */}
                <div className="bento-card-anim group col-span-1 md:col-span-1 md:row-span-1 relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between hover:bg-neutral-800 transition-colors">
                    <Layers className="text-action" />
                    <div>
                        <h4 className="text-white font-bold text-lg">Interiorismo</h4>
                        <p className="text-xs text-gray-400">Estética y funcionalidad en armonía.</p>
                    </div>
                </div>

                {/* Card 5: Acabados Premium (Wide) - 2x1 */}
                <div className="bento-card-anim group col-span-1 md:col-span-2 md:row-span-1 relative overflow-hidden rounded-3xl bg-neutral-800 border border-neutral-700 flex items-center p-8 hover:border-action transition-all">
                    <div className="mr-6 p-4 bg-background rounded-2xl text-white">
                        <PaintRoller size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl text-white font-bold">Materiales de Vanguardia</h3>
                        <p className="text-gray-400">
                            Seleccionamos componentes de última generación que combinan una resistencia extrema con texturas que redefinen el lujo contemporáneo.
                        </p>
                    </div>
                </div>

                {/* Card 6: Contacto - 2x1 */}
                <div className="bento-card-anim group col-span-1 md:col-span-2 md:row-span-1 relative overflow-hidden rounded-3xl bg-neutral-800 border border-neutral-700 flex items-center p-8 hover:border-action transition-all">
                    <div className="mr-6 p-4 bg-background rounded-2xl text-white">
                        <Phone size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl text-white font-bold">Contacto</h3>
                        <div className="flex flex-col gap-2">
                            <p className="text-gray-400">+34 666 666 666</p>
                            <p className="text-gray-400">contacto@germanyconst.es</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#fff"><path fill="#fff" d="M16.6 14c-.2-.1-1.5-.7-1.7-.8c-.2-.1-.4-.1-.6.1c-.2.2-.6.8-.8 1c-.1.2-.3.2-.5.1c-.7-.3-1.4-.7-2-1.2c-.5-.5-1-1.1-1.4-1.7c-.1-.2 0-.4.1-.5c.1-.1.2-.3.4-.4c.1-.1.2-.3.2-.4c.1-.1.1-.3 0-.4c-.1-.1-.6-1.3-.8-1.8c-.1-.7-.3-.7-.5-.7h-.5c-.2 0-.5.2-.6.3c-.6.6-.9 1.3-.9 2.1c.1.9.4 1.8 1 2.6c1.1 1.6 2.5 2.9 4.2 3.7c.5.2.9.4 1.4.5c.5.2 1 .2 1.6.1c.7-.1 1.3-.6 1.7-1.2c.2-.4.2-.8.1-1.2l-.4-.2m2.5-9.1C15.2 1 8.9 1 5 4.9c-3.2 3.2-3.8 8.1-1.6 12L2 22l5.3-1.4c1.5.8 3.1 1.2 4.7 1.2c5.5 0 9.9-4.4 9.9-9.9c.1-2.6-1-5.1-2.8-7m-2.7 14c-1.3.8-2.8 1.3-4.4 1.3c-1.5 0-2.9-.4-4.2-1.1l-.3-.2l-3.1.8l.8-3l-.2-.3c-2.4-4-1.2-9 2.7-11.5S16.6 3.7 19 7.5c2.4 3.9 1.3 9-2.6 11.4" /></svg>
                        </div>
                    </div>
                </div>
                {/* Footer Module - 4x1 (Full Width) */}
                <div className="bento-card-anim group p-8 gap-4 col-span-1 md:col-span-4 md:row-span-1 relative overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between hover:border-action transition-all cursor-default">

                    <div className="flex justify-between items-start">
                        <div className="flex gap-4 flex-col">
                            <div>
                                <h2 className="text-3xl font-serif text-action mb-2 tracking-tighter">GC</h2>
                                <p className="text-neutral-400 text-sm max-w-xs">
                                    Construcción y arquitectura de vanguardia. <br />
                                    Alemania &bull; España
                                </p>
                            </div>
                            <div>
                                <p>Política de privacidad</p>
                                <p>Términos y condiciones</p>
                            </div>

                        </div>
                        <div className="flex gap-4">
                            {/* Social/Contact Placeholders */}
                            <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white hover:bg-action transition-colors cursor-pointer">
                                <Linkedin size={18} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white hover:bg-action transition-colors cursor-pointer">
                                <Instagram size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center mt-8 md:mt-0">
                        <div className="text-neutral-500 text-xs">
                            &copy; {new Date().getFullYear()} Germany Const. Todos los derechos reservados.
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
