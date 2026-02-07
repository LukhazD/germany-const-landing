import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const servicesData = [
    {
        id: 1,
        title: 'PROYECTO',
        items: [
            { name: 'Edificación y Naves', desc: 'Naves industriales, viviendas adosadas y aisladas. Construcción 100% industrializada.' },
            { name: 'Eficiencia Energética', desc: 'Construcciones pasivas, aerotermia, suelo radiante, climatización y sistemas eléctricos.' },
            { name: 'Digitalización Técnica', desc: 'Implantación de software de RRHH y procesos productivos. Control de costes reales al 80%.' },
            { name: 'Gestión Integral', desc: 'Presupuestos, comparativas y planificación en tiempos reales para un 15% de beneficio neto.' },
        ],
        intro: 'Empresa con más de 20 años en la construcción 100% industrializada y pasiva. Asociados con Prefabricados Molins para una ejecución Lean 5S que reduce mano de obra y garantiza rentabilidad.',
        images: ['/pictures/Project.webp', '/pictures/House.jpg', '/pictures/House2.jpg'],
    },
    {
        id: 2,
        title: 'CONSULTORÍA',
        items: [
            { name: 'Gestión y RRHH', desc: 'Programas de gestión de obra, evaluación de productividad y rentabilidad mensual.' },
            { name: 'Oficina Técnica', desc: 'Digitalización, análisis de estructuras y evaluación de eficiencia energética de proyectos.' },
            { name: 'Auditoría Modular', desc: 'Verificación normativa para construcciones modulares (ISO 9001) y viabilidad técnica.' },
            { name: 'Ciclo Completo', desc: 'Evaluación de procesos productivos desde la fase de diseño hasta la entrega de llaves.' },
        ],
        intro: 'Servicios para empresas con alta demanda que requieren fluidez constructiva. Evaluamos procesos y rentabilidad para optimizar la producción.',
        images: ['/pictures/Apartament.jpg', '/pictures/Kitchen.jpg'],
    },
    {
        id: 3,
        title: 'DISEÑO',
        items: [
            { name: 'Residencial y Lujo', desc: 'Viviendas de lujo, interiorismo, y rehabilitación de viviendas artesanales.' },
            { name: 'Infraestructuras', desc: 'Diseño eficiente de naves logísticas y obras públicas.' },
            { name: 'Ingeniería', desc: 'Sistemas hidráulicos, eléctricos, aerotermia, placas solares y suelo radiante.' },
            { name: 'Metodología BIM', desc: 'Implementación BIM y flujo de trabajo Lean 5S para asegurar viabilidad en coste y producción.' },
        ],
        intro: 'Diseño arquitectónico integral adaptado a la construcción industrializada y sostenible, garantizando la viabilidad económica y técnica.',
        images: ['/pictures/House3.jpg', '/pictures/Kitchen.jpg', '/pictures/Apartament.jpg'],
    },
    {
        id: 4,
        title: 'CONSTRUCCIÓN',
        items: [
            { name: '100% Industrializada', desc: 'Viviendas adosadas, entre medianeras, unifamiliares y aisladas.' },
            { name: 'Tiempos Récord', desc: 'Viviendas unifamiliares (240m²) en 8 meses. Residenciales de 14 alturas en 1 año.' },
            { name: 'Rentabilidad', desc: 'Ahorro de tiempo y costes netos mediante construcción mixta y sostenible.' },
            { name: 'Equilibrio', desc: 'Solución para afrontar alta demanda equilibrando producción y plazos de entrega.' },
        ],
        intro: 'Ejecución de obras con operatividad optimizada: más mano de obra efectiva y menos tiempos muertos. Construcción rápida, precisa y rentable.',
        images: ['/pictures/House.jpg', '/pictures/House2.jpg', '/pictures/Project.webp'],
    },
    {
        id: 5,
        title: 'FORMACIÓN',
        items: [
            { name: 'Formación de Oficios', desc: 'Especialización en yeso, pavimento y pladur para operarios y encargados.' },
            { name: 'Jefes de Obra', desc: 'Capacitación profesional en los últimos controles de producción y técnicas constructivas.' },
            { name: 'Escuela de Peones', desc: 'Programa intensivo de 5 meses para especializar peones básicos.' },
            { name: 'Visión Integral', desc: 'Formación para equilibrar producción y coste, evitando derivaciones negativas.' },
        ],
        intro: 'Nuestro afán es que todos estén bien formados. Avanzamos el límite profesional de operarios y técnicos para garantizar construcciones viables.',
        images: ['/pictures/Project.webp'], // Placeholder
    },
    {
        id: 6,
        title: 'SERVICIOS',
        items: [
            { name: 'Análisis de Proyectos', desc: 'Evaluación de viabilidad para construcciones modulares e industrializadas.' },
            { name: 'Normativa', desc: 'Adaptación de proyectos a las normativas constructivas vigentes.' },
            { name: 'Sistemas Integrales', desc: 'Electricidad, fontanería, aerotermia, suelo radiante, climatización y ascensores.' },
        ],
        intro: 'Consultas de análisis de proyectos de cualquier envergadura. Llevamos tus construcciones modulares al cumplimiento normativo y técnico.',
        images: ['/pictures/House2.jpg'], // Placeholder
    },
    {
        id: 7,
        title: 'BOLSA DE EMPLEO',
        link: '/jobs', // Direct link
        items: [],
        images: [],
    },
];

export default function ServicesHeader({ delay = 0 }) {
    const [activeModal, setActiveModal] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        if (navRef.current) {
            gsap.fromTo(
                navRef.current,
                { y: -50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    delay: delay,
                    ease: 'power3.out'
                }
            );
        }
    }, [delay]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleServiceClick = (service) => {
        if (service.link) {
            window.location.href = service.link;
        } else {
            setActiveModal(service);
            setMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Top Navigation Header */}
            <div
                ref={navRef}
                className={`fixed top-0 left-0 w-full z-40 transition-colors duration-300 ${isScrolled || mobileMenuOpen ? 'bg-zinc-950/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden absolute top-6 right-6 z-50">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white p-2 focus:outline-none"
                        >
                            {mobileMenuOpen ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            )}
                        </button>
                    </div>

                    {/* Desktop Main Nav Bar */}
                    <div className="hidden md:flex justify-center items-center h-20 space-x-8">
                        {servicesData.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => handleServiceClick(service)}
                                className="text-white text-sm lg:text-base font-serif tracking-widest uppercase hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary"
                            >
                                {service.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl pt-24 px-6 overflow-y-auto animate-in fade-in duration-200 flex flex-col justify-start">
                    <div className="flex flex-col space-y-6">
                        {servicesData.map((service) => (
                            <div key={service.id} className="border-b border-white/10 pb-4">
                                <button
                                    onClick={() => handleServiceClick(service)}
                                    className="w-full flex justify-between items-center text-left text-2xl font-serif text-white hover:text-primary transition-colors"
                                >
                                    {service.title}
                                    <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal Overlay */}
            {/* We render the modal always if active, but we rely on its internal animation to enter. 
                For exit, we pass a callback. */}
            {activeModal && (
                <ServiceModal
                    category={activeModal}
                    onClose={() => setActiveModal(null)}
                />
            )}
        </>
    );
}

function ServiceModal({ category, onClose }) {
    const modalRef = useRef(null);
    const contentRef = useRef(null);

    // Lock body scroll on mount
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        // GSAP Entrance Animation
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // 1. Fade in backdrop
            tl.fromTo(modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: 'power2.out' }
            );

            // 2. Scale up and fade in content
            tl.fromTo(contentRef.current,
                { opacity: 0, scale: 0.95, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' },
                '-=0.3'
            );
        }, modalRef);

        return () => {
            document.body.style.overflow = originalStyle;
            ctx.revert();
        };
    }, []);

    const handleClose = () => {
        const tl = gsap.timeline({
            onComplete: onClose
        });

        // Reverse animation
        tl.to(contentRef.current, {
            opacity: 0,
            scale: 0.95,
            y: 20,
            duration: 0.4,
            ease: 'power3.in'
        });

        tl.to(modalRef.current, {
            opacity: 0,
            duration: 0.3
        }, '-=0.2');
    };

    if (!category) return null;

    return (
        <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md opacity-0">
            {/* Close Button Trigger for Animation */}
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors z-[60] bg-black/40 rounded-full p-2 hover:bg-black/60"
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div ref={contentRef} className="bg-zinc-900 w-full max-w-7xl h-[90vh] md:h-[85vh] rounded-2xl border border-white/10 flex flex-col md:flex-row shadow-2xl relative overflow-hidden opacity-0">

                {/* Content Side (Scrollable) */}
                <div className="w-full md:w-5/12 flex flex-col border-b md:border-b-0 md:border-r border-white/10 bg-zinc-900 z-10 h-full">
                    <div className="p-6 md:p-10 border-b border-white/5 flex-shrink-0">
                        <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                            {category.title}
                        </h2>
                        {category.intro && (
                            <p className="mt-4 text-gray-300 font-light text-sm md:text-base border-l-2 border-primary pl-4">
                                {category.intro}
                            </p>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-8">
                        {category.items.map((item, idx) => (
                            <div key={idx} className="group">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    {item.name || item.text}
                                </h3>
                                <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base pl-5 border-l border-white/5 group-hover:border-primary/30 transition-colors">
                                    {item.desc || item.sub}
                                </p>
                            </div>
                        ))}

                        {/* Mobile Images Section (Visible only on mobile) */}
                        <div className="md:hidden mt-8 space-y-4">
                            <h4 className="text-white font-medium text-sm tracking-widest uppercase mb-4">Galería</h4>
                            <div className="grid grid-cols-1 gap-4">
                                {category.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`${category.title} ref ${idx}`}
                                        className="w-full h-48 object-cover rounded-lg border border-white/10"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 pb-4">
                            <button className="w-full py-4 bg-white text-black font-bold tracking-widest hover:bg-primary hover:text-white transition-colors rounded-xl uppercase text-sm">
                                Solicitar Información
                            </button>
                        </div>
                    </div>
                </div>

                {/* Images Side (Visuals) - Desktop Only */}
                <div className="hidden md:block md:w-7/12 bg-black/50 relative h-full">
                    <div className="grid grid-cols-2 h-full">
                        {category.images.slice(0, 4).map((img, idx) => (
                            <div key={idx} className={`relative overflow-hidden group border-white/5 ${idx === 0 ? 'row-span-2 border-r border-b' : 'border-b'}`}>
                                <img
                                    src={img}
                                    alt={`${category.title} detail ${idx}`}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-[1000ms] ease-in-out group-hover:scale-105 opacity-60 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute bottom-8 left-6 text-white text-opacity-80 group-hover:text-opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500 z-10">
                                    <span className="text-xs uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-sm">PROYECTO DESTACADO</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Click outside to close (backdrop) */}
            <div className="absolute inset-0 -z-10" onClick={handleClose}></div>
        </div>
    );
}

