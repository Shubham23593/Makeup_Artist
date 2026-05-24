"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════
//  SHADERS — preserved exactly from original
// ═══════════════════════════════════════════════════════════════════════
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec2 uTexture1Size;
  uniform vec2 uTexture2Size;
  uniform int uEffectType;

  uniform float uGlobalIntensity;
  uniform float uSpeedMultiplier;
  uniform float uDistortionStrength;
  uniform float uColorEnhancement;

  uniform float uGlassRefractionStrength;
  uniform float uGlassChromaticAberration;
  uniform float uGlassBubbleClarity;
  uniform float uGlassEdgeGlow;
  uniform float uGlassLiquidFlow;

  varying vec2 vUv;

  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;
    return (uv * uResolution - offset) / scaledSize;
  }

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(noise(i), noise(i + vec2(1.0, 0.0)), f.x),
      mix(noise(i + vec2(0.0, 1.0)), noise(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  vec4 glassEffect(vec2 uv, float progress) {
    float glassStrength        = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity;
    float chromaticAberration  = 0.02 * uGlassChromaticAberration * uGlobalIntensity;
    float waveDistortion       = 0.025 * uDistortionStrength;
    float clearCenterSize      = 0.3  * uGlassBubbleClarity;
    float surfaceRipples       = 0.004 * uDistortionStrength;
    float liquidFlow           = 0.015 * uGlassLiquidFlow * uSpeedMultiplier;
    float rimLightWidth        = 0.05;
    float glassEdgeWidth       = 0.025;

    float brightnessPhase      = smoothstep(0.8, 1.0, progress);
    float rimLightIntensity    = 0.08 * (1.0 - brightnessPhase) * uGlassEdgeGlow * uGlobalIntensity;
    float glassEdgeOpacity     = 0.06 * (1.0 - brightnessPhase) * uGlassEdgeGlow;

    vec2  center      = vec2(0.5, 0.5);
    vec2  p           = uv * uResolution;
    vec2  uv1         = getCoverUV(uv, uTexture1Size);
    vec2  uv2_base    = getCoverUV(uv, uTexture2Size);

    float maxRadius   = length(uResolution) * 0.85;
    float bubbleRadius = progress * maxRadius;
    vec2  sphereCenter = center * uResolution;

    float dist          = length(p - sphereCenter);
    float normalizedDist = dist / max(bubbleRadius, 0.001);
    vec2  direction     = (dist > 0.0) ? (p - sphereCenter) / dist : vec2(0.0);
    float inside        = smoothstep(bubbleRadius + 3.0, bubbleRadius - 3.0, dist);
    float distanceFactor = smoothstep(clearCenterSize, 1.0, normalizedDist);
    float time          = progress * 5.0 * uSpeedMultiplier;

    vec2 liquidSurface = vec2(
      smoothNoise(uv * 100.0 + time * 0.3),
      smoothNoise(uv * 100.0 + time * 0.2 + 50.0)
    ) - 0.5;
    liquidSurface *= surfaceRipples * distanceFactor;

    vec2 distortedUV = uv2_base;
    if (inside > 0.0) {
      float refractionOffset = glassStrength * pow(distanceFactor, 1.5);
      vec2  flowDirection    = normalize(direction + vec2(sin(time), cos(time * 0.7)) * 0.3);
      distortedUV -= flowDirection * refractionOffset;
      float combinedWave = (
        sin(normalizedDist * 22.0 - time * 3.5) +
        sin(normalizedDist * 35.0 + time * 2.8) * 0.7 +
        sin(normalizedDist * 50.0 - time * 4.2) * 0.5
      ) / 3.0;
      float waveOffset = combinedWave * waveDistortion * distanceFactor;
      distortedUV -= direction * waveOffset + liquidSurface;
      vec2 flowOffset = vec2(
        sin(time + normalizedDist * 10.0),
        cos(time * 0.8 + normalizedDist * 8.0)
      ) * liquidFlow * distanceFactor * inside;
      distortedUV += flowOffset;
    }

    vec4 newImg;
    if (inside > 0.0) {
      float aberrationOffset = chromaticAberration * pow(distanceFactor, 1.2);
      vec2 uv_r = distortedUV + direction * aberrationOffset * 1.2;
      vec2 uv_g = distortedUV + direction * aberrationOffset * 0.2;
      vec2 uv_b = distortedUV - direction * aberrationOffset * 0.8;
      newImg = vec4(
        texture2D(uTexture2, uv_r).r,
        texture2D(uTexture2, uv_g).g,
        texture2D(uTexture2, uv_b).b,
        1.0
      );
    } else {
      newImg = texture2D(uTexture2, uv2_base);
    }

    if (inside > 0.0 && rimLightIntensity > 0.0) {
      float rim  = smoothstep(1.0 - rimLightWidth, 1.0, normalizedDist)
                 * (1.0 - smoothstep(1.0, 1.01, normalizedDist));
      newImg.rgb += rim * rimLightIntensity;
      float edge = smoothstep(1.0 - glassEdgeWidth, 1.0, normalizedDist)
                 * (1.0 - smoothstep(1.0, 1.01, normalizedDist));
      newImg.rgb  = mix(newImg.rgb, vec3(1.0), edge * glassEdgeOpacity);
    }

    newImg.rgb = mix(newImg.rgb, newImg.rgb * 1.2, (uColorEnhancement - 1.0) * 0.5);
    vec4 currentImg = texture2D(uTexture1, uv1);

    if (progress > 0.95) {
      vec4  pureNewImg    = texture2D(uTexture2, uv2_base);
      float endTransition = (progress - 0.95) / 0.05;
      newImg = mix(newImg, pureNewImg, endTransition);
    }
    return mix(currentImg, newImg, inside);
  }

  vec4 genericEffect(vec2 uv, float progress) {
    vec2 uv1  = getCoverUV(uv, uTexture1Size);
    vec2 uv2  = getCoverUV(uv, uTexture2Size);
    float dist = uDistortionStrength * uGlobalIntensity * sin(progress * 3.14);
    vec2 disp = vec2(
      smoothNoise(uv * 10.0 + float(uEffectType) + progress),
      smoothNoise(uv * 15.0 - float(uEffectType) + progress)
    ) * dist * 0.1;
    vec4 t1 = texture2D(uTexture1, uv1 + disp * (1.0 - progress));
    vec4 t2 = texture2D(uTexture2, uv2 + disp * progress);
    return mix(t1, t2, smoothstep(0.0, 1.0, progress));
  }

  void main() {
    if (uEffectType == 0) {
      gl_FragColor = glassEffect(vUv, uProgress);
    } else {
      gl_FragColor = genericEffect(vUv, uProgress);
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════
//  ENHANCED SLIDE DATA  — richer content per slide
// ═══════════════════════════════════════════════════════════════════════
const SLIDES_FALLBACK = [
  {
    title: "Bridal Makeup",
    subtitle: "Timeless Bridal Artistry",
    headingLines: ["BRIDAL", "RADIANCE", "PERFECTED"],
    description:
      "Transforming your most cherished moment with flawless bridal looks, luminous skin finishes, and timeless elegance crafted just for you.",
    stat: { value: "500+", label: "Happy Brides" },
    badge: "Bridal Specialist",
    media: {
      desktop: "/slider/splide1_smallscreen.jpeg",
      mobile: "/slider/splide1_smallscreen.jpeg",
    },
  },
  {
    title: "HD Makeup",
    subtitle: "Editorial Excellence",
    headingLines: ["HD SKIN", "FLAWLESSLY", "DEFINED"],
    description:
      "High-definition techniques that capture every detail beautifully on camera, screen, and stage — pixel-perfect artistry for the modern world.",
    stat: { value: "8+", label: "Years Experience" },
    badge: "Certified Artist",
    media: {
      desktop: "/slider/splide2_smallscreen.jpeg",
      mobile: "/slider/splide2_smallscreen.jpeg",
    },
  },
  {
    title: "Engagement Makeup",
    subtitle: "Romance Perfected",
    headingLines: ["LOVE'S", "MOST", "BEAUTIFUL LOOK"],
    description:
      "Celebrate your engagement with a radiant glow that captures the magic of the moment and the depth of your love story.",
    stat: { value: "200+", label: "Engagements" },
    badge: "Editorial Specialist",
    media: {
      desktop: "/slider/splide3_smallscreen.jpeg",
      mobile: "/slider/splide3_smallscreen.jpeg",
    },
  },
  {
    title: "Party Makeup",
    subtitle: "Glamour Unleashed",
    headingLines: ["BORN", "TO DAZZLE", "EVERY NIGHT"],
    description:
      "Bold, vibrant, and unforgettable — party looks that turn heads and make every evening an occasion you'll always remember.",
    stat: { value: "1000+", label: "Events Styled" },
    badge: "Glam Expert",
    media: {
      desktop: "/slider/splide4_smallscreen.jpeg",
      mobile: "/slider/splide4_smallscreen.jpeg",
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════
//  SLIDER CONFIG
// ═══════════════════════════════════════════════════════════════════════
const SLIDER_CONFIG = {
  settings: {
    transitionDuration: 1.8,
    autoSlideSpeed: 4500,
    currentEffect: "glass",
    globalIntensity: 1.0,
    speedMultiplier: 1.0,
    distortionStrength: 1.0,
    colorEnhancement: 1.0,
    glassRefractionStrength: 1.0,
    glassChromaticAberration: 1.0,
    glassBubbleClarity: 1.0,
    glassEdgeGlow: 1.0,
    glassLiquidFlow: 1.0,
  },
};

// ═══════════════════════════════════════════════════════════════════════
//  LUXURY PRELOADER
// ═══════════════════════════════════════════════════════════════════════
const Preloader = ({ onLoadComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let startTime;
    const duration = 1600;

    const dotRings = [
      { radius: 18, count: 8 },
      { radius: 32, count: 12 },
      { radius: 46, count: 16 },
      { radius: 60, count: 20 },
      { radius: 74, count: 24 },
    ];

    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const smoothstep = (e0, e1, x) => {
      const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const time = elapsed * 0.001;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,169,126,0.95)";
      ctx.fill();

      dotRings.forEach((ring, ri) => {
        for (let i = 0; i < ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2;
          const pulseTime = time * 2 - ri * 0.4;
          const radiusPulse =
            easeInOutSine((Math.sin(pulseTime) + 1) / 2) * 6 - 3;
          const x = cx + Math.cos(angle) * (ring.radius + radiusPulse);
          const y = cy + Math.sin(angle) * (ring.radius + radiusPulse);

          const highlightPhase = (Math.sin(pulseTime) + 1) / 2;
          const hi = easeInOutCubic(highlightPhase);
          const opc =
            0.3 + easeInOutSine((Math.sin(pulseTime + i * 0.2) + 1) / 2) * 0.7;

          const r = Math.round(200 + (216 - 200) * smoothstep(0.2, 0.8, hi));
          const g = Math.round(169 + (182 - 169) * smoothstep(0.2, 0.8, hi));
          const b = Math.round(126 + (164 - 126) * smoothstep(0.2, 0.8, hi));

          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${opc})`;
          ctx.fill();
        }
      });

      if (elapsed < duration) {
        animationId = requestAnimationFrame(animate);
      } else {
        onLoadComplete();
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [onLoadComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6"
      style={{ background: "#f5f1eb" }}
    >
      <canvas ref={canvasRef} width={240} height={240} />
      <p
        className="text-[10px] tracking-[0.45em] uppercase"
        style={{ color: "#7c6553", fontFamily: "Cormorant Garamond, serif" }}
      >
        Preparing your experience
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
//  DECORATIVE VERTICAL LINE
// ═══════════════════════════════════════════════════════════════════════
const GoldLine = ({ className = "" }) => (
  <div
    className={`w-px ${className}`}
    style={{
      background:
        "linear-gradient(to bottom, transparent, #c8a97e, transparent)",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════════
//  MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function SliderPage() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mainImageRef = useRef(null);
  const contentRef = useRef(null);
  const parallaxRef = useRef(null);
  const [loaded, setLoaded] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slides, setSlides] = useState([]);
  const [slidesFetched, setSlidesFetched] = useState(false);

  const logicRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    material: null,
    textures: [],
    currentSlideIndex: 0,
    pane: null,
    autoSlideTimer: null,
    progressInterval: null,
    progress: 0,
    needsRender: true,
    animFrameId: null,
  });

  // ── helpers ────────────────────────────────────────────────────────
  const getSlideUrl = (slide, forceDesktop = false) => {
    const mob =
      typeof window !== "undefined" && window.innerWidth < 768 && !forceDesktop;
    if (typeof slide?.media === "object" && slide.media !== null) {
      return mob
        ? slide.media.mobile || slide.media.desktop
        : slide.media.desktop;
    }
    return slide?.media || "";
  };

  const allSlides = slides.length > 0 ? slides : SLIDES_FALLBACK;
  const currentSlide = allSlides[activeSlide] || allSlides[0];

  // ── timer ──────────────────────────────────────────────────────────
  const startTimer = () => {
    const { current: logic } = logicRef;
    if (logic.autoSlideTimer) clearTimeout(logic.autoSlideTimer);
    if (logic.progressInterval) clearInterval(logic.progressInterval);
    logic.progress = 0;

    logic.progressInterval = setInterval(() => {
      logic.progress += (100 / SLIDER_CONFIG.settings.autoSlideSpeed) * 50;
      const bar = document.getElementById(
        `progress-bar-${logic.currentSlideIndex}`,
      );
      if (bar) bar.style.width = `${Math.min(logic.progress, 100)}%`;
      if (logic.progress >= 100) {
        clearInterval(logic.progressInterval);
        if (!isTransitioning) nextSlide();
      }
    }, 50);
  };

  const stopTimer = () => {
    const { current: logic } = logicRef;
    if (logic.progressInterval) clearInterval(logic.progressInterval);
    if (logic.autoSlideTimer) clearTimeout(logic.autoSlideTimer);
    const bar = document.getElementById(
      `progress-bar-${logic.currentSlideIndex}`,
    );
    if (bar) bar.style.width = "0%";
  };

  // ── content animation ──────────────────────────────────────────────
  const animateContentIn = () => {
    if (!contentRef.current) return;
    const targets = Array.from(
      contentRef.current.querySelectorAll("[data-anim]"),
    );
    if (!targets.length) return;
    gsap.killTweensOf(targets);
    gsap.fromTo(
      targets,
      { opacity: 0, y: 28, filter: "blur(5px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "filter",
      },
    );
  };

  const animateContentOut = (onComplete) => {
    if (!contentRef.current) {
      onComplete?.();
      return;
    }
    const targets = Array.from(
      contentRef.current.querySelectorAll("[data-anim]"),
    );
    if (!targets.length) {
      onComplete?.();
      return;
    }
    gsap.killTweensOf(targets);
    gsap.to(targets, {
      opacity: 0,
      y: -18,
      filter: "blur(4px)",
      duration: 0.22,
      stagger: 0.04,
      ease: "power2.in",
      onComplete,
      clearProps: "filter",
    });
  };

  // ── slide navigation ───────────────────────────────────────────────
  const navigateTo = (index) => {
    const { current: logic } = logicRef;
    if (logic.material && logic.material.uniforms.uProgress.value > 0) return;
    if (index === logic.currentSlideIndex) return;

    setIsTransitioning(true);
    stopTimer();

    const currTex = logic.textures[logic.currentSlideIndex];
    const nextTex = logic.textures[index];

    logic.material.uniforms.uTexture1.value = currTex;
    logic.material.uniforms.uTexture2.value = nextTex;
    logic.material.uniforms.uTexture1Size.value = currTex.userData.size;
    logic.material.uniforms.uTexture2Size.value = nextTex.userData.size;
    logic.needsRender = true;

    animateContentOut(() => {
      setActiveSlide(index);
    });

    gsap.fromTo(
      logic.material.uniforms.uProgress,
      { value: 0 },
      {
        value: 1,
        duration: SLIDER_CONFIG.settings.transitionDuration,
        ease: "power2.inOut",
        onComplete: () => {
          logic.material.uniforms.uProgress.value = 0;
          logic.material.uniforms.uTexture1.value = nextTex;
          logic.material.uniforms.uTexture1Size.value = nextTex.userData.size;
          logic.currentSlideIndex = index;
          setIsTransitioning(false);
          logic.needsRender = false;
          startTimer();
        },
      },
    );
  };

  const nextSlide = () => {
    const { current: logic } = logicRef;
    if (!allSlides.length) return;
    navigateTo((logic.currentSlideIndex + 1) % allSlides.length);
  };

  const prevSlide = () => {
    const { current: logic } = logicRef;
    if (!allSlides.length) return;
    navigateTo(
      (logic.currentSlideIndex - 1 + allSlides.length) % allSlides.length,
    );
  };

  useEffect(() => {
    if (!loaded) return;
    animateContentIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide, loaded]);

  useEffect(() => {
    if (!loaded || !parallaxRef.current) return;
    const handleMouse = (e) => {
      const { innerWidth: W, innerHeight: H } = window;
      const x = (e.clientX / W - 0.5) * 12;
      const y = (e.clientY / H - 0.5) * 8;
      gsap.to(parallaxRef.current, {
        x,
        y,
        duration: 2.2,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [loaded]);

  useEffect(() => {
    async function getSlides() {
      try {
        const res = await fetch("/api/images");
        const data = await res.json();
        let newSlides = JSON.parse(JSON.stringify(SLIDES_FALLBACK));
        if (data.success && data.images) {
          data.images.forEach((img) => {
            if (img.category === "Slider 1 (Bridal Makeup)")
              newSlides[0].media = img.imageUrl;
            if (img.category === "Slider 2 (HD Makeup)")
              newSlides[1].media = img.imageUrl;
            if (img.category === "Slider 3 (Engagement Makeup)")
              newSlides[2].media = img.imageUrl;
            if (img.category === "Slider 4 (Party Makeup)")
              newSlides[3].media = img.imageUrl;
          });
        }
        setSlides(newSlides);
      } catch {
        setSlides(SLIDES_FALLBACK);
      } finally {
        setSlidesFetched(true);
      }
    }
    getSlides();
  }, []);

  // ── WebGL setup ────────────────────────────────────────────────────
  useEffect(() => {
    if (!slidesFetched || allSlides.length === 0) return;
    if (!canvasRef.current || !mainImageRef.current) return;

    const { current: logic } = logicRef;
    const container = mainImageRef.current;
    const isMob = window.innerWidth < 768;
    const cW = container.clientWidth || window.innerWidth / 2;
    const cH = container.clientHeight || window.innerHeight;

    logic.scene = new THREE.Scene();
    logic.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    logic.camera.position.z = 1;

    logic.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: false,
    });
    logic.renderer.setSize(cW, cH);
    logic.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMob ? 1.5 : 2),
    );

    logic.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture1: { value: null },
        uTexture2: { value: null },
        uProgress: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(cW, cH) },
        uTexture1Size: { value: new THREE.Vector2(1, 1) },
        uTexture2Size: { value: new THREE.Vector2(1, 1) },
        uEffectType: { value: 0 },

        uGlobalIntensity: { value: SLIDER_CONFIG.settings.globalIntensity },
        uSpeedMultiplier: { value: SLIDER_CONFIG.settings.speedMultiplier },
        uDistortionStrength: {
          value: SLIDER_CONFIG.settings.distortionStrength,
        },
        uColorEnhancement: { value: SLIDER_CONFIG.settings.colorEnhancement },
        uGlassRefractionStrength: {
          value: SLIDER_CONFIG.settings.glassRefractionStrength,
        },
        uGlassChromaticAberration: {
          value: SLIDER_CONFIG.settings.glassChromaticAberration,
        },
        uGlassBubbleClarity: {
          value: SLIDER_CONFIG.settings.glassBubbleClarity,
        },
        uGlassEdgeGlow: { value: SLIDER_CONFIG.settings.glassEdgeGlow },
        uGlassLiquidFlow: { value: SLIDER_CONFIG.settings.glassLiquidFlow },
        uFrostIntensity: { value: 0 },
        uFrostCrystalSize: { value: 0 },
        uFrostIceCoverage: { value: 0 },
        uFrostTemperature: { value: 0 },
        uFrostTexture: { value: 0 },
        uRippleFrequency: { value: 0 },
        uRippleAmplitude: { value: 0 },
        uRippleWaveSpeed: { value: 0 },
        uRippleRippleCount: { value: 0 },
        uRippleDecay: { value: 0 },
        uPlasmaIntensity: { value: 0 },
        uPlasmaSpeed: { value: 0 },
        uPlasmaEnergyIntensity: { value: 0 },
        uPlasmaContrastBoost: { value: 0 },
        uPlasmaTurbulence: { value: 0 },
        uTimeshiftDistortion: { value: 0 },
        uTimeshiftBlur: { value: 0 },
        uTimeshiftFlow: { value: 0 },
        uTimeshiftChromatic: { value: 0 },
        uTimeshiftTurbulence: { value: 0 },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, logic.material);
    logic.scene.add(mesh);

    const loadTextures = async () => {
      const loader = new THREE.TextureLoader().setCrossOrigin("anonymous");
      const loadPromises = allSlides.map(
        (slide) =>
          new Promise((resolve, reject) => {
            const url = getSlideUrl(slide);
            loader.load(
              url,
              (tex) => {
                tex.minFilter = THREE.LinearFilter;
                tex.magFilter = THREE.LinearFilter;
                tex.userData = {
                  size: new THREE.Vector2(tex.image.width, tex.image.height),
                };
                resolve(tex);
              },
              undefined,
              (err) => {
                console.error("Texture load failed:", url);
                reject(err);
              },
            );
          }),
      );

      try {
        logic.textures = await Promise.all(loadPromises);

        if (logic.textures.length > 0 && logic.material) {
          logic.material.uniforms.uTexture1.value = logic.textures[0];
          logic.material.uniforms.uTexture1Size.value =
            logic.textures[0].userData.size;
          if (logic.textures.length > 1) {
            logic.material.uniforms.uTexture2.value = logic.textures[1];
            logic.material.uniforms.uTexture2Size.value =
              logic.textures[1].userData.size;
          }
        }

        const renderOnce = () => {
          if (logic.renderer && logic.scene && logic.camera) {
            logic.renderer.render(logic.scene, logic.camera);
          }
        };
        const animate = () => {
          if (
            logic.needsRender &&
            logic.renderer &&
            logic.scene &&
            logic.camera
          ) {
            logic.renderer.render(logic.scene, logic.camera);
          }
          logic.animFrameId = requestAnimationFrame(animate);
        };
        renderOnce();
        logic.needsRender = false;
        animate();
      } catch (err) {
        console.error("Error loading textures:", err);
      }
    };
    loadTextures();

    if (process.env.NODE_ENV === "development" && !logic.pane) {
      import("tweakpane").then(({ Pane: TweakPane }) => {
        logic.pane = new TweakPane({
          title: "Visual Effects",
          expanded: false,
        });
        const f1 = logic.pane.addFolder({ title: "General" });
        f1.addBinding(SLIDER_CONFIG.settings, "globalIntensity", {
          min: 0.1,
          max: 2.0,
        }).on("change", (ev) => {
          logic.material.uniforms.uGlobalIntensity.value = ev.value;
          logic.needsRender = true;
        });
        f1.addBinding(SLIDER_CONFIG.settings, "distortionStrength", {
          min: 0.1,
          max: 3.0,
        }).on("change", (ev) => {
          logic.material.uniforms.uDistortionStrength.value = ev.value;
          logic.needsRender = true;
        });
        const f2 = logic.pane.addFolder({ title: "Glass Effect" });
        f2.addBinding(SLIDER_CONFIG.settings, "glassRefractionStrength", {
          min: 0.1,
          max: 3.0,
        }).on("change", (ev) => {
          if (logic.material) {
            logic.material.uniforms.uGlassRefractionStrength.value = ev.value;
            logic.needsRender = true;
          }
        });
        logic.pane.element.style.display = "none";
      });
    }

    const handleResize = () => {
      const c = mainImageRef.current;
      if (!c || !logic.renderer || !logic.material) return;
      const w = c.clientWidth;
      const h = c.clientHeight;
      logic.renderer.setSize(w, h);
      logic.material.uniforms.uResolution.value.set(w, h);
      logic.needsRender = true;
      setTimeout(() => {
        logic.needsRender = false;
      }, 120);
    };

    const handleKey = (e) => {
      if (e.code === "KeyH" && logic.pane) {
        logic.pane.element.style.display =
          logic.pane.element.style.display === "none" ? "block" : "none";
      }
      if (e.code === "ArrowRight" || e.code === "Space") nextSlide();
      if (e.code === "ArrowLeft") prevSlide();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKey);
      if (logic.animFrameId) cancelAnimationFrame(logic.animFrameId);
      if (logic.pane) {
        try {
          logic.pane.dispose();
        } catch (_) {}
        logic.pane = null;
      }
      logic.renderer?.dispose();
      if (logic.autoSlideTimer) clearTimeout(logic.autoSlideTimer);
      if (logic.progressInterval) clearInterval(logic.progressInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slidesFetched, slides]);

  useEffect(() => {
    if (loaded) startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // ═══════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <main
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ background: "#f5f1eb", fontFamily: "Poppins, sans-serif" }}
      onClick={(e) => {
        if (!e.target.closest(".no-slide-click")) nextSlide();
      }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:wght@300;400;600&family=Poppins:wght@300;400;500;600&display=swap");

        .tp-dfwv {
          z-index: 1000 !important;
          top: 20px !important;
          right: 20px !important;
        }

        @keyframes arrowFade {
          0%,
          100% {
            opacity: 0;
            transform: translateY(-3px);
          }
          50% {
            opacity: 1;
            transform: translateY(4px);
          }
        }
        @keyframes floatGlow {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.65;
            transform: scale(1.05);
          }
        }

        .btn-primary {
          background: linear-gradient(135deg, #c8a97e, #d8b6a4);
          color: #1e1b18;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-primary:hover {
          box-shadow: 0 8px 28px rgba(200, 169, 126, 0.45);
          transform: translateY(-2px) scale(1.03);
        }
        .btn-outline {
          border: 1px solid rgba(124, 101, 83, 0.38);
          color: #7c6553;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-outline:hover {
          background: #1e1b18;
          color: #faf7f3;
          border-color: #1e1b18;
          transform: translateY(-2px);
        }
      `}</style>

      {/* ── Preloader ─────────────────────────────────────────────── */}
      {/* Preloader removed for faster loading */}

      {/* ── Ambient Background Blobs ──────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: "15%",
            left: "35%",
            background: "radial-gradient(circle, #d8b6a4 0%, transparent 70%)",
            opacity: 0.14,
            filter: "blur(80px)",
            animation: "floatGlow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            bottom: "20%",
            right: "10%",
            background: "radial-gradient(circle, #c8a97e 0%, transparent 70%)",
            opacity: 0.11,
            filter: "blur(70px)",
            animation: "floatGlow 11s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            top: "60%",
            left: "15%",
            background: "radial-gradient(circle, #ede7df 0%, transparent 70%)",
            opacity: 0.5,
            filter: "blur(60px)",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MAIN LAYOUT
         ══════════════════════════════════════════════════════════════ */}
      <div
        className={`relative z-10 w-full h-full flex flex-col md:flex-row transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* ─────────────────────────────────────────────────────────
            LEFT — Large WebGL Image
           ───────────────────────────────────────────────────────── */}
        <div
          ref={parallaxRef}
          className="relative w-full md:w-1/2 flex-shrink-0 h-[45vh] md:h-full p-3 md:p-6"
        >
          <div
            ref={mainImageRef}
            className="relative w-full h-full overflow-hidden rounded-3xl md:rounded-[32px]"
            style={{
              boxShadow:
                "0 32px 80px rgba(124,101,83,0.22), 0 8px 24px rgba(124,101,83,0.12)",
            }}
          >
            <canvas ref={canvasRef} className="absolute inset-0" />

            <div
              className="pointer-events-none absolute inset-0 rounded-3xl md:rounded-[32px]"
              style={{ boxShadow: "inset 0 0 80px rgba(200,169,126,0.07)" }}
            />

            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-28"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(245,241,235,0.06), transparent)",
              }}
            />

            <div
              className="absolute top-5 left-5 md:top-7 md:left-7 flex items-baseline gap-1.5"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                color: "rgba(250,247,243,0.85)",
              }}
            >
              <span className="text-xl md:text-2xl font-light leading-none">
                {String(activeSlide + 1).padStart(2, "0")}
              </span>
              <span className="text-xs opacity-60">/</span>
              <span className="text-xs opacity-60">
                {String(allSlides.length).padStart(2, "0")}
              </span>
            </div>

            <div
              className="absolute bottom-5 left-5 md:bottom-7 md:left-7 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(245,241,235,0.18)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(200,169,126,0.25)",
              }}
            >
              <span
                className="text-[9px] md:text-[10px] tracking-[0.28em] uppercase"
                style={{
                  color: "#faf7f3",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                }}
              >
                {currentSlide?.badge || "Makeup Artist"}
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            CENTER — Clean Normal Image Thumbnails (Max 4)
           ───────────────────────────────────────────────────────── */}
        <div
          className="no-slide-click hidden md:flex md:flex-col items-center justify-center gap-3 w-full md:w-[13%] flex-shrink-0 md:h-auto overflow-visible px-4 md:px-3 py-0"
          style={{ scrollbarWidth: "none" }}
        >
          <GoldLine className="hidden md:block h-10 mb-2" />

          {/* Enforce maximum 4 thumbnails using slice */}
          {allSlides.slice(0, 4).map((slide, idx) => {
            const isActive = idx === activeSlide;
            const imgUrl = getSlideUrl(slide, true);

            return (
              <button
                key={idx}
                className={`no-slide-click relative overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-500 ease-out rounded-xl
                  ${
                    isActive
                      ? "w-14 h-14 md:w-full md:h-28 opacity-100 ring-2 ring-[#c8a97e] ring-offset-2 ring-offset-[#f5f1eb] shadow-[0_8px_24px_rgba(200,169,126,0.32)] scale-105"
                      : "w-11 h-11 md:w-[85%] md:h-20 opacity-50 hover:opacity-80 scale-100"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo(idx);
                }}
                aria-label={slide.title}
              >
                <img
                  src={imgUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </button>
            );
          })}

          {/* Progress bars (desktop vertical) */}
          <div className="hidden md:flex flex-col gap-1.5 mt-3 w-full px-2">
            {allSlides.slice(0, 4).map((_, idx) => (
              <div
                key={idx}
                className="w-full h-[2px] rounded-full overflow-hidden"
                style={{ background: "rgba(124,101,83,0.15)" }}
              >
                <div
                  id={`progress-bar-${idx}`}
                  className="h-full rounded-full w-0 transition-none"
                  style={{ background: "#c8a97e" }}
                />
              </div>
            ))}
          </div>

          <GoldLine className="hidden md:block h-10 mt-2" />
        </div>

        {/* ─────────────────────────────────────────────────────────
            RIGHT — Animated Content Area
           ───────────────────────────────────────────────────────── */}
        <div
          ref={contentRef}
          className="no-slide-click flex-1 flex flex-col justify-center px-6 md:pl-5 md:pr-14 lg:pr-20 pb-24 pt-2 md:pb-0 md:pt-0 overflow-y-auto md:overflow-visible min-h-0 min-w-0"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            data-anim
            className="flex items-center gap-2 md:gap-3 mb-3 md:mb-7"
          >
            <div
              className="flex-shrink-0 h-px w-7 md:w-10"
              style={{
                background: "linear-gradient(to right, #c8a97e, #d8b6a4)",
              }}
            />
            <span
              className="text-[10px] md:text-xs tracking-[0.32em] uppercase"
              style={{
                color: "#7c6553",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
              }}
            >
              {currentSlide?.subtitle || "Luxury Beauty Studio"}
            </span>
          </div>

          <div data-anim className="mb-3 md:mb-8">
            {(
              currentSlide?.headingLines || [
                "MAKEUP",
                "TECHNIQUES",
                "DEFINE ELEGANCE",
              ]
            ).map((line, i) => (
              <div
                key={`${activeSlide}-${i}`}
                className="overflow-hidden leading-none"
              >
                <h1
                  className="leading-[0.9] tracking-wide"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontWeight: i === 0 ? 400 : i === 1 ? 700 : 900,
                    fontSize: "clamp(2.2rem, 3.8vw, 5rem)",
                    color: "#1e1b18",
                    letterSpacing: i % 2 === 0 ? "0.02em" : "0.05em",
                    fontStyle: i === 0 ? "italic" : "normal",
                  }}
                >
                  {line}
                </h1>
              </div>
            ))}
          </div>

          <div
            data-anim
            className="flex items-center gap-2 md:gap-3 mb-3 md:mb-7"
          >
            <div
              className="h-px w-10 md:w-14"
              style={{
                background: "linear-gradient(to right, #c8a97e, transparent)",
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "#d8b6a4" }}
            />
            <div
              className="h-px w-5 md:w-8"
              style={{
                background: "linear-gradient(to right, #d8b6a4, transparent)",
              }}
            />
          </div>

          <p
            data-anim
            className="mb-4 md:mb-10 leading-snug md:leading-relaxed"
            style={{
              color: "#7c6553",
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(0.95rem, 1.2vw, 1.15rem)",
              fontWeight: 400,
              maxWidth: "360px",
            }}
          >
            {currentSlide?.description ||
              "Transforming beauty into timeless artistry with modern makeup techniques, glowing skin finishes, and editorial-inspired looks tailored for every occasion."}
          </p>

          <div
            data-anim
            className="no-slide-click flex flex-wrap items-center gap-2 md:gap-4 mb-6 md:mb-10 pointer-events-auto"
          >
            <a
              href="/booking"
              className="btn-primary no-slide-click flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 rounded-full text-xs md:text-sm font-medium"
              style={{
                fontFamily: "Poppins, sans-serif",
                letterSpacing: "0.09em",
              }}
            >
              Book Appointment
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </a>
            <a
  href="/portfolio"
  className="!hidden md:!flex btn-outline no-slide-click items-center gap-2 px-5 md:px-8 py-2.5 md:py-3.5 rounded-full text-[10px] md:text-sm font-medium"
  style={{ fontFamily: "Poppins, sans-serif", letterSpacing: "0.09em" }}
>
  View Portfolio
</a>
          </div>

          <div data-anim className="hidden md:flex items-center gap-5 md:gap-8">
            <div>
              <div
                className="text-xl md:text-2xl font-bold leading-none mb-1"
                style={{
                  color: "#1e1b18",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {currentSlide?.stat?.value || "500+"}
              </div>
              <div
                className="text-[9px] md:text-[10px] tracking-[0.28em] uppercase"
                style={{ color: "#7c6553", fontFamily: "Poppins, sans-serif" }}
              >
                {currentSlide?.stat?.label || "Happy Clients"}
              </div>
            </div>

            <div
              className="w-px h-9 flex-shrink-0"
              style={{ background: "rgba(124,101,83,0.2)" }}
            />

            <div>
              <div
                className="text-xl md:text-2xl font-bold leading-none mb-1"
                style={{
                  color: "#1e1b18",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                8+
              </div>
              <div
                className="text-[9px] md:text-[10px] tracking-[0.28em] uppercase"
                style={{ color: "#7c6553", fontFamily: "Poppins, sans-serif" }}
              >
                Years Expert
              </div>
            </div>

            <div
              className="w-px h-9 flex-shrink-0 hidden sm:block"
              style={{ background: "rgba(124,101,83,0.2)" }}
            />

            <div className="hidden sm:block">
              <div
                className="text-xl md:text-2xl font-bold leading-none mb-1"
                style={{
                  color: "#1e1b18",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                ✦
              </div>
              <div
                className="text-[9px] md:text-[10px] tracking-[0.28em] uppercase"
                style={{ color: "#7c6553", fontFamily: "Poppins, sans-serif" }}
              >
                Certified Artist
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ──────────────────────────────────────── */}
      <div className="hidden md:flex absolute bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1">
        <span
          className="text-[8px] tracking-[0.38em] uppercase"
          style={{
            color: "rgba(124,101,83,0.55)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Scroll
        </span>
        <div className="relative h-7 w-7">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute inset-0"
            style={{
              color: "rgba(124,101,83,0.5)",
              animation: "arrowFade 1.8s ease-in-out infinite",
            }}
          >
            <path d="M7 9l5 5 5-5" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute inset-0 translate-y-2"
            style={{
              color: "#c8a97e",
              animation: "arrowFade 1.8s ease-in-out infinite 0.28s",
            }}
          >
            <path d="M7 9l5 5 5-5" />
          </svg>
        </div>
      </div>

      {/* ── Mobile bottom slide dots ──────────────────────────────── */}
      <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {allSlides.slice(0, 4).map((_, idx) => (
          <button
            key={idx}
            className="no-slide-click transition-all duration-400"
            style={{
              width: idx === activeSlide ? "20px" : "6px",
              height: "6px",
              borderRadius: "4px",
              background:
                idx === activeSlide ? "#c8a97e" : "rgba(124,101,83,0.35)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigateTo(idx);
            }}
          />
        ))}
      </div>
    </main>
  );
}
