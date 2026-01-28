/** @jsxImportSource react */
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Move cursor with mouse
        const onMouseMove = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
        };

        // Expand on hoverable elements
        const onMouseEnter = () => {
            gsap.to(cursor, {
                scale: 2.5,
                backgroundColor: 'rgba(255, 87, 34, 0.2)', // Semi-transparent orange
                border: '1px solid #FF5722',
                duration: 0.3
            });
        };

        const onMouseLeave = () => {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: '#FF5722',
                border: 'none',
                duration: 0.3
            });
        };

        window.addEventListener('mousemove', onMouseMove);

        const clickables = document.querySelectorAll('a, button, .clickable');
        clickables.forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            clickables.forEach((el) => {
                el.removeEventListener('mouseenter', onMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-3 h-3 bg-action rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            style={{ willChange: 'transform' }}
        />
    );
}
