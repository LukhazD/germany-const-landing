import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const servicesData = [
    {
        id: 1,
        title: 'PROYECTO',
        items: [
            { name: 'Estructural', desc: 'Cálculo y diseño de estructuras.' },
            { name: 'Residenciales', desc: 'Espacios habitables modernos.' },
            { name: 'Unifamiliares', desc: 'Viviendas privadas a medida.' },
            { name: 'Adosados', desc: 'Eficiencia y comunidad.' },
            { name: 'Eléctricos', desc: 'Instalaciones y domótica.' },
            { name: 'Viviendas Pasivas', desc: 'Máxima eficiencia energética.' },
        ],
        // Mapping available images randomly for now
        images: ['/pictures/Project.webp', '/pictures/House.jpg', '/pictures/House2.jpg'],
    },
    {
        id: 2,
        title: 'CONSULTORÍA',
        items: [
            { name: 'Soluciones Técnicas', desc: 'Optimización constructiva.' },
            { name: 'Sostenibilidad', desc: 'Certificaciones y eco-diseño.' },
            { name: 'Implantar BIM', desc: 'Gestión integral del proyecto.' },
            {
                name: 'Digitalización',
                sub: 'Propósito: > Producción / < Costo',
                desc: 'Transformación digital empresarial.',
            },
        ],
        images: ['/pictures/Apartament.jpg', '/pictures/Kitchen.jpg'],
    },
    {
        id: 3,
        title: 'DISEÑO',
        items: [
            { name: 'Interiorismo', desc: 'Espacios funcionales y estéticos.' },
            { name: 'Industrializada', desc: 'Diseño modular y prefabricado.' },
            { name: 'Diseño BIM', desc: 'Modelado 3D colaborativo.' },
            { name: 'Naves Logísticas', desc: 'Grandes infraestructuras.' },
            { name: 'Viviendas', desc: 'Proyectos residenciales.' },
        ],
        images: ['/pictures/House3.jpg', '/pictures/Kitchen.jpg', '/pictures/Apartament.jpg'],
    },
    {
        id: 4,
        title: 'CONSTRUCCIÓN',
        items: [
            { name: 'Singulares', desc: 'Proyectos arquitectónicos únicos.' },
            { name: 'Industrializada', desc: 'Montaje rápido y preciso.' },
            { name: 'Viviendas Pasivas', desc: 'Construcción bajo estándar Passivhaus.' },
            { name: 'Emisión Cero', desc: 'Huella de carbono neutral.' },
        ],
        images: ['/pictures/House.jpg', '/pictures/House2.jpg', '/pictures/Project.webp'],
    },
];

export default function ServicesHeader({ delay = 0 }) {
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileExpandedCategory, setMobileExpandedCategory] = useState(null);
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

    const openModal = (category, subItem) => {
        setActiveModal({ category, subItem });
        setActiveCategory(null);
        setMobileMenuOpen(false); // Close mobile menu if open
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const toggleMobileCategory = (id) => {
        setMobileExpandedCategory(mobileExpandedCategory === id ? null : id);
    };

    return (
        <>
            {/* Top Navigation Header */}
            <div
                ref={navRef}
                className={`fixed top-0 left-0 w-full z-40 transition-colors duration-300 ${isScrolled || mobileMenuOpen ? 'bg-zinc-950/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
                    }`}
                onMouseLeave={() => setActiveCategory(null)}
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
                    <div className="hidden md:flex justify-center items-center h-20">
                        {servicesData.map((service) => (
                            <div
                                key={service.id}
                                className="w-full h-full flex items-center justify-center"
                                onMouseEnter={() => setActiveCategory(service.id)}
                            >
                                <button className="text-white text-sm md:text-base font-serif tracking-widest uppercase hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">
                                    {service.title}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Dropdown Container */}
                    <div
                        className={`hidden md:block absolute top-20 left-0 w-full bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 shadow-2xl overflow-hidden transition-all duration-300 ease-out origin-top ${activeCategory ? 'opacity-100 max-h-[60vh] py-8' : 'opacity-0 max-h-0 py-0'
                            }`}
                    >
                        {activeCategory && (
                            <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-300">
                                {servicesData
                                    .find((s) => s.id === activeCategory)
                                    ?.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => openModal(servicesData.find((s) => s.id === activeCategory), item)}
                                            className="group/card cursor-pointer bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/50 p-4 rounded-lg transition-all duration-200 flex flex-col items-start gap-2"
                                        >
                                            <h4 className="text-white font-medium text-lg flex items-center justify-between w-full">
                                                {item.name || item.text}
                                                <svg className="w-4 h-4 text-primary opacity-0 group-hover/card:opacity-100 transition-opacity -translate-x-2 group-hover/card:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </h4>
                                            <p className="text-gray-400 text-sm font-light">
                                                {item.desc || item.sub || 'Ver detalles y galería de proyectos.'}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl pt-20 px-6 overflow-y-auto animate-in fade-in duration-200 flex flex-col justify-between">
                    <div className="flex flex-col space-y-6">
                        {servicesData.map((service) => (
                            <div key={service.id} className="border-b border-white/10 pb-4">
                                <button
                                    onClick={() => toggleMobileCategory(service.id)}
                                    className="w-full flex justify-between items-center text-left text-2xl font-serif text-white hover:text-primary transition-colors"
                                >
                                    {service.title}
                                    <svg
                                        className={`w-6 h-6 transform transition-transform duration-300 ${mobileExpandedCategory === service.id ? 'rotate-180 text-primary' : 'text-gray-500'}`}
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    >
                                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                {/* Sub items for mobile */}
                                {mobileExpandedCategory === service.id && (
                                    <div className="mt-4 grid grid-cols-1 gap-3 animate-in slide-in-from-top-2 duration-200">
                                        {service.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => openModal(service, item)}
                                                className="p-3 bg-white/5 rounded-lg border border-white/5 active:bg-white/10 dark:active:border-primary/30"
                                            >
                                                <h4 className="text-white font-medium">{item.name || item.text}</h4>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.desc || item.sub}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Menu Close Button (Bottom) */}
                    <div className="py-8 flex justify-center">
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Overlay */}
            {activeModal && (
                <ServiceModal
                    category={activeModal.category}
                    subItem={activeModal.subItem}
                    onClose={closeModal}
                />
            )}
        </>
    );
}

function ServiceModal({ category, subItem, onClose }) {
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
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.2)' },
                '-=0.3'
            );
        }, modalRef);

        return () => {
            document.body.style.overflow = originalStyle;
            ctx.revert();
        };
    }, []);

    if (!category) return null;

    const modalTitle = subItem.name || subItem.text;
    const modalDesc = subItem.desc || subItem.sub;

    return (
        <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md opacity-0">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition-colors z-[60] bg-black/20 rounded-full p-2"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div ref={contentRef} className="bg-zinc-900 w-full max-w-6xl h-[85vh] md:h-[80vh] rounded-2xl border border-white/10 flex flex-col md:flex-row shadow-2xl relative overflow-hidden opacity-0">

                {/* Content Side */}
                <div className="p-6 md:p-12 md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 bg-zinc-900 z-10 overflow-y-auto md:overflow-visible h-1/2 md:h-auto">
                    <div>
                        <div className="text-primary text-xs md:text-sm tracking-widest uppercase mb-2">{category.title}</div>
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 md:mb-6 leading-tight">
                            {modalTitle}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 font-light border-l-2 border-white/20 pl-4">
                            {modalDesc}
                        </p>

                        <div className="mt-6 md:mt-8 text-gray-400 text-sm">
                            <p>Descripción detallada del servicio o módulo seleccionado. Aquí iría el texto específico para {modalTitle}.</p>
                        </div>
                    </div>

                    <div className="mt-8 hidden md:block">
                        <button className="px-8 py-3 bg-white text-black font-medium text-sm tracking-widest hover:bg-gray-200 transition-colors rounded-full">
                            CONTACTAR
                        </button>
                    </div>
                </div>

                {/* Images Side - Masonry/Grid Style */}
                <div className="p-0 md:w-2/3 bg-black/50 relative overflow-y-auto custom-scrollbar h-1/2 md:h-auto">
                    <div className="grid grid-cols-2 gap-2 p-2 h-full content-start">
                        {category.images.map((img, idx) => (
                            <div
                                key={idx}
                                className={`relative overflow-hidden group min-h-[150px] md:min-h-[300px] ${idx === 0 ? 'col-span-2 row-span-2 min-h-[200px] md:min-h-[500px]' : ''}`}
                            >
                                <img
                                    src={img}
                                    alt={`${modalTitle} example ${idx + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 " />
                                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                                    <span className="text-xs uppercase tracking-widest">{category.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Mobile Contact Button (Sticky at bottom if needed, but placed in text area for now) */}
                    <div className="md:hidden p-4">
                        <button className="w-full px-8 py-3 bg-white text-black font-medium text-sm tracking-widest hover:bg-gray-200 transition-colors rounded-full">
                            CONTACTAR
                        </button>
                    </div>
                </div>
            </div>

            {/* Click outside to close (backdrop) */}
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
}
