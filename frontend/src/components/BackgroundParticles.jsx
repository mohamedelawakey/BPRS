import { useEffect, useRef } from 'react';
import './BackgroundParticles.css';

function BackgroundParticles() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: null, y: null });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 12000);

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    baseX: 0,
                    baseY: 0,
                    size: Math.random() * 2.5 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: (Math.random() - 0.5) * 0.4,
                    opacity: Math.random() * 0.5 + 0.2,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.02 + 0.01,
                    color: Math.random() > 0.5 ? '102, 126, 234' : '118, 75, 162'
                });
            }

            // Store base positions for mouse interaction
            particles.forEach(p => {
                p.baseX = p.x;
                p.baseY = p.y;
            });
        };

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: null, y: null };
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const mouse = mouseRef.current;

            particles.forEach((particle, index) => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.pulse += particle.pulseSpeed;

                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Mouse interaction - particles move away from mouse
                let drawX = particle.x;
                let drawY = particle.y;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particle.x - mouse.x;
                    const dy = particle.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 150;

                    if (distance < maxDistance) {
                        const force = (maxDistance - distance) / maxDistance;
                        const angle = Math.atan2(dy, dx);
                        drawX = particle.x + Math.cos(angle) * force * 30;
                        drawY = particle.y + Math.sin(angle) * force * 30;
                    }
                }

                // Pulsing opacity
                const pulseOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(particle.pulse));

                // Draw particle with glow
                ctx.beginPath();
                ctx.arc(drawX, drawY, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${particle.color}, ${pulseOpacity})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgba(${particle.color}, 0.5)`;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw connections
                particles.slice(index + 1).forEach((otherParticle) => {
                    const odx = drawX - otherParticle.x;
                    const ody = drawY - otherParticle.y;
                    const odistance = Math.sqrt(odx * odx + ody * ody);

                    if (odistance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(drawX, drawY);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(102, 126, 234, ${0.15 * (1 - odistance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });

                // Draw line to mouse if close
                if (mouse.x !== null && mouse.y !== null) {
                    const mdx = drawX - mouse.x;
                    const mdy = drawY - mouse.y;
                    const mdistance = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (mdistance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(drawX, drawY);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(255, 107, 107, ${0.3 * (1 - mdistance / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        resizeCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="background-particles" />;
}

export default BackgroundParticles;
