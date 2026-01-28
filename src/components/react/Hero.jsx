/** @jsxImportSource react */
import React, { useEffect, useRef } from 'react';
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
            // Split text logic simulated by manually creating spans or treating lines
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
                subTextRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                '-=0.5'
            );

            // 3. Scroll Shrink Effect
            gsap.to(containerRef.current, {
                scrollTrigger: {
                    trigger: document.body,
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
        <section
            ref={containerRef}
            className="h-screen w-full flex flex-col items-center justify-center bg-background text-white relative overflow-hidden transform-gpu"
        >
            <div className="flex flex-col items-center z-10">
                {/* Animated Brand Logo using User Provided SVG Geometry */}
                <div className="mb-12 w-64 h-64 md:w-96 md:h-96 relative">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 500 500"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                    >
                        {/* Optional Background - removed to blend with Hero */}
                        {/* <rect width="500" height="500" fill="#000000"/> */}

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

                <h1 ref={textRef} className="text-4xl md:text-7xl font-bold tracking-tight mb-4 flex overflow-hidden text-center">
                    {titleChars}
                </h1>

                <p ref={subTextRef} className="text-secondary text-lg md:text-xl font-light tracking-wide text-center uppercase">
                    Arquitectura &bull; Construcción &bull; Reformas
                </p>
            </div>

            <div className="absolute bottom-10 animate-bounce text-secondary cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
            </div>
        </section>
    );
}
