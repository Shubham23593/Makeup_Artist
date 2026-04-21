'use client';

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

const DEFAULT_SLIDES = [
    {
        title: "Snow <br/>Leopard",
        status: "Critically Endangered",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1274&auto=format&fit=crop",
    },
    {
        title: "African <br/>Lion",
        status: "Vulnerable",
        image: "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=1170&auto=format&fit=crop",
    },
    {
        title: "Siberian <br/>Tiger",
        status: "Endangered",
        image: "https://plus.unsplash.com/premium_photo-1673603988651-99f79e4ae7d3?q=80&w=1170&auto=format&fit=crop",
    },
];

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D currentImage;
  uniform sampler2D nextImage;
  uniform float dispFactor;

  void main() {
    vec2 uv = vUv;
    float intensity = 0.6;
    vec4 orig1 = texture2D(currentImage, uv);
    vec4 orig2 = texture2D(nextImage, uv);
    
    vec4 _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));
    vec4 _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));

    gl_FragColor = mix(_currentImage, _nextImage, dispFactor);
  }
`;

export default function ImageSlider({
    slides = DEFAULT_SLIDES,
    autoPlay = true,
    interval = 5000,
    className = "",
    accentColor = "#ef4444",
    showPagination = true
}) {
    const mountRef = useRef(null);
    const titleRef = useRef(null);
    const statusRef = useRef(null);

    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const materialRef = useRef(null);
    const texturesRef = useRef([]);
    const animationFrameRef = useRef(0);

    const [activeIndex, setActiveIndex] = useState(0);
    const [displayTextIndex, setDisplayTextIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!mountRef.current || !slides.length) return;

        const parent = mountRef.current;
        let width = parent.clientWidth;
        let height = parent.clientHeight;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        parent.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const loader = new THREE.TextureLoader();
        loader.crossOrigin = "anonymous";

        const promises = slides.map(slide => {
            return new Promise((resolve) => {
                loader.load(slide.image, (tex) => {
                    tex.magFilter = THREE.LinearFilter;
                    tex.minFilter = THREE.LinearFilter;
                    resolve(tex);
                });
            });
        });

        Promise.all(promises).then((loadedTextures) => {
            texturesRef.current = loadedTextures;

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    dispFactor: { value: 0.0 },
                    currentImage: { value: loadedTextures[0] },
                    nextImage: { value: loadedTextures[0] },
                },
                vertexShader,
                fragmentShader,
                transparent: true,
            });
            materialRef.current = material;

            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
            scene.add(mesh);
            setLoading(false);
        });

        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);
            if (rendererRef.current && sceneRef.current) {
                rendererRef.current.render(sceneRef.current, camera);
            }
        };
        animate();

        const handleResize = () => {
            if (!parent) return;
            const w = parent.clientWidth;
            const h = parent.clientHeight;
            renderer.setSize(w, h);
            camera.left = w / -2; camera.right = w / 2;
            camera.top = h / 2; camera.bottom = h / -2;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameRef.current);
            renderer.dispose();
            if (parent.contains(renderer.domElement)) parent.removeChild(renderer.domElement);
        };
    }, [slides]);

    useEffect(() => {
        if (loading || !materialRef.current || texturesRef.current.length === 0) return;

        const material = materialRef.current;
        const nextTexture = texturesRef.current[activeIndex];

        setIsAnimating(true);
        material.uniforms.nextImage.value = nextTexture;

        const tl = gsap.timeline();

        tl.to([titleRef.current, statusRef.current], {
            y: -30,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
            stagger: 0.05,
            onComplete: () => {
                setDisplayTextIndex(activeIndex);
            }
        });

        gsap.to(material.uniforms.dispFactor, {
            duration: 1.4,
            value: 1,
            ease: "expo.inOut",
            onComplete: () => {
                material.uniforms.currentImage.value = nextTexture;
                material.uniforms.dispFactor.value = 0.0;
                setIsAnimating(false);
            },
        });

        tl.fromTo([titleRef.current, statusRef.current],
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.1 },
            "-=0.4"
        );

    }, [activeIndex, loading]);

    useEffect(() => {
        if (!autoPlay || isAnimating || loading) return;
        const timer = setTimeout(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, interval);
        return () => clearTimeout(timer);
    }, [activeIndex, autoPlay, isAnimating, loading, interval, slides.length]);

    return (
        <div className={`relative w-full h-screen bg-[#0a0a0a] overflow-hidden text-white font-sans ${className}`}>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&display=swap');
            `}</style>

            <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 ${loading ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="w-12 h-px bg-white/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white animate-[loading_1.5s_infinite]" />
                </div>
            </div>

            <main className="relative w-full h-full flex flex-col justify-end pb-20 px-8 md:px-20 lg:px-32">
                <div ref={mountRef} className="absolute inset-0 z-0" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-20 max-w-5xl">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="h-px w-10 bg-white/40" />
                        <span className="text-[10px] uppercase tracking-[0.5em] text-white/50">Exclusive Artistry</span>
                    </div>

                    <h1
                        ref={titleRef}
                        className="font-[Playfair_Display] text-6xl md:text-8xl lg:text-[10rem] font-black leading-[0.8] mb-10 italic"
                        dangerouslySetInnerHTML={{ __html: slides[displayTextIndex]?.title || "" }}
                    />

                    <div ref={statusRef} 
                         className="text-[11px] uppercase tracking-[0.6em] font-bold border-l-2 pl-4 ml-1"
                         style={{ color: accentColor, borderColor: accentColor }}
                    >
                        {slides[displayTextIndex]?.status}
                    </div>
                </div>

                {showPagination && (
                    <div className="absolute bottom-20 right-8 md:right-20 z-20 flex flex-col gap-8">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className="group flex items-center justify-end gap-4 outline-none"
                                disabled={isAnimating}
                            >
                                <span className={`text-[10px] font-bold tracking-widest transition-all duration-500 ${activeIndex === i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}>
                                    0{i + 1}
                                </span>
                                <div className={`h-px transition-all duration-700 bg-white ${activeIndex === i ? "w-12" : "w-4 bg-white/20 group-hover:bg-white/60"}`} />
                            </button>
                        ))}
                    </div>
                )}
            </main>

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
