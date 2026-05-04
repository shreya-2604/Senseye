import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { motion } from 'framer-motion';
import testimonialVideo from './assets/senseye_review.mp4';
import './index.css';

function ShoeModel() {
  const { scene } = useGLTF('/Senseye_shoe.glb');
  const cloned = useMemo(() => scene.clone(), [scene]);
  // Tilt the shoe at a 45 degree angle and adjust scale (further reduced size)
  return <primitive object={cloned} rotation={[0, -Math.PI / 4, Math.PI / 8]} scale={0.8} />;
}
useGLTF.preload('/Senseye_shoe.glb');

function SleeveModel() {
  const { scene } = useGLTF('/Senseye_sleeve.glb');
  const cloned = useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} rotation={[0, -Math.PI / 8, Math.PI / 16]} scale={1.45} />;
}
useGLTF.preload('/Senseye_sleeve.glb');

function BeltModel() {
  const { scene } = useGLTF('/Senseye_belt.glb');
  const cloned = useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} rotation={[0, -Math.PI / 4, Math.PI / 8]} scale={1.4} />;
}
useGLTF.preload('/Senseye_belt.glb');

// Custom controls to allow normal page scrolling and pinch-to-zoom
function CustomControls() {
  const { gl } = useThree();
  
  useEffect(() => {
    const handleWheel = (e) => {
      // Trackpad pinch gestures usually have e.ctrlKey set to true
      if (!e.ctrlKey) {
        // Normal scroll: stop the event from reaching OrbitControls (prevents 3D zoom).
        e.stopPropagation();
      } else {
        // Pinch gesture: let OrbitControls handle it to zoom the 3D model, 
        // but prevent the browser from zooming the entire webpage.
        e.preventDefault();
      }
    };
    
    // Attach listener to the parent container in capture phase
    const container = gl.domElement.parentElement;
    if (container) {
      container.addEventListener('wheel', handleWheel, { capture: true, passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel, { capture: true });
      }
    };
  }, [gl]);

  return (
    <OrbitControls 
      autoRotate 
      autoRotateSpeed={5} 
      enablePan={false} 
      minPolarAngle={Math.PI / 4} 
      maxPolarAngle={Math.PI / 1.5} 
    />
  );
}

// Hook to keep canvas invalidating for smooth rotation even with frameloop="demand"
function KeepCanvasAlive() {
  const invalidate = useThree((state) => state.invalidate);
  useFrame(() => {
    invalidate();
  });
  return null;
}

const SECTIONS = ['main', 'pricing', 'specs', 'problem-statement', 'solution', 'features', 'testimonial'];

const NAV_LABELS = {
  main: 'Home',
  pricing: 'Pricing',
  specs: 'Specifications',
  'problem-statement': 'Problem statement',
  solution: 'Solution',
  features: 'Key Features',
  testimonial: 'Testimonial',
};

const FEATURE_CARDS = [
  {
    title: 'Image based sensing',
    description: 'Captures spatial detail in real time to identify obstacles with clarity and precision.',
  },
  {
    title: 'Hands-free modular design',
    description: 'A wearable architecture that keeps the users hands free while adapting to daily routines.',
  },
  {
    title: 'Real-time Processing',
    description: 'Processes environmental data instantly so guidance stays responsive as conditions change.',
  },
  {
    title: 'Smartphone Independent',
    description: 'Operates as a self-contained system, reducing dependency on external devices or the internet.',
  },
];

const SPEC_LIST = [
  { label: 'Sensor Type', value: 'Stereo vision - OakdLite 13 MP' },
  { label: 'Detection Range', value: '0.2 m – 1 m' },
  { label: 'Field of View', value: '70°–90°' },
  { label: 'Latency', value: '< 200 ms' },
  { label: 'Connectivity', value: 'Wi-fi' },
  { label: 'Battery Life', value: '6–8 hours' },
  { label: 'Charging', value: 'USB‑C' },
  { label: 'Weight', value: '< 500g total' },
  { label: 'Water Resistance', value: 'Splash / rain resistant' },
];

function renderSpecIcon(label) {
  const common = { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch (label) {
    case 'Sensor Type':
      return (
        <svg {...common}><path d="M12 7a5 5 0 100 10 5 5 0 000-10z" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12h3" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 12h3" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      );
    case 'Detection Range':
      return (
        <svg {...common}><path d="M3 12h18" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round"/><path d="M6 9v6" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round"/><path d="M18 9v6" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round"/></svg>
      );
    case 'Field of View':
      return (
        <svg {...common}><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" stroke="#67BAF4" strokeWidth="1.2" fill="none"/><circle cx="12" cy="12" r="2" fill="#67BAF4"/></svg>
      );
    case 'Latency':
      return (
        <svg {...common}><circle cx="12" cy="12" r="9" stroke="#67BAF4" strokeWidth="1.4" fill="none"/><path d="M12 7v6l4 2" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      );
    case 'Connectivity':
      return (
        <svg {...common}><path d="M5 12c3-3 6-3 9 0" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 15c2-2 4-2 6 0" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="18" r="1" fill="#67BAF4"/></svg>
      );
    case 'Battery Life':
      return (
        <svg {...common}><rect x="2" y="7" width="16" height="10" rx="2" stroke="#67BAF4" strokeWidth="1.4" fill="none"/><rect x="18" y="10" width="2" height="4" rx="0.5" fill="#67BAF4"/></svg>
      );
    case 'Charging':
      return (
        <svg {...common}><path d="M11 6v6h4" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12h3v6h12v-6h3" stroke="#67BAF4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      );
    case 'Weight':
      return (
        <svg {...common}><path d="M6 20v-2a6 6 0 016-6h0a6 6 0 016 6v2" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 6h18" stroke="#67BAF4" strokeWidth="1.4" strokeLinecap="round"/></svg>
      );
    case 'Water Resistance':
      return (
        <svg {...common}><path d="M12 2s4 4 4 7a4 4 0 11-8 0c0-3 4-7 4-7z" stroke="#67BAF4" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      );
    default:
      return null;
  }
}

const featureCardVariants = {
  hidden: { opacity: 0, y: 34 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: index * 0.14,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function VideoTestimonial() {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime > 32) {
        video.pause();
        video.currentTime = 9;
        setIsPlaying(false);
      }
    };

    const handlePlay = () => {
      if (video.currentTime < 9) {
        video.currentTime = 9;
      }
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    const section = wrapperRef.current;
    const video = videoRef.current;

    if (!section || !video) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        if (video.currentTime < 9) {
          video.currentTime = 9;
        }
        video.play();
      } else {
        video.pause();
      }
    }
  };

  return (
    <div className="testimonial-wrapper" ref={wrapperRef}>
      <div className="testimonial-video">
        <video
          ref={videoRef}
          className="testimonial-video-element"
          onLoadedMetadata={() => {
            if (videoRef.current) videoRef.current.currentTime = 9;
          }}
        >
          <source src={testimonialVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {!isPlaying && (
          <button className="video-play-button" onClick={handlePlayClick} aria-label="Play video">
            ▶
          </button>
        )}
      </div>
        <div className="testimonial-quote">
        <p className="testimonial-text">
          This helps our children travel independently—going to college, returning home, and even using public transport, which was previously very difficult.
        </p>
        <p className="testimonial-author">— Caregiver, Netraheen Kanya Vidyalaya, Jabalpur</p>
      </div>
    </div>
  );
}

function App() {
  const [showModel, setShowModel] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const [isPageReady, setIsPageReady] = useState(false);
  const heroVideoRef = useRef(null);
  const sectionRatios = useRef({});

  // Intro animation: reveal model shortly after page is ready
  useEffect(() => {
    let t = null;
    if (isPageReady) {
      t = setTimeout(() => setShowModel(true), 200);
    }
    return () => t && clearTimeout(t);
  }, [isPageReady]);

      useEffect(() => {
        const preloadAssets = async () => {
          const assetUrls = ['/senseye_bg.mp4', '/bg.jpg', '/problem.png'];

          await Promise.all([
            document.fonts?.ready ?? Promise.resolve(),
            ...assetUrls.map((url) => {
              if (url.endsWith('.mp4')) {
                  return new Promise((resolve) => {
                    const video = document.createElement('video');
                    // Only fetch metadata to avoid downloading the full file during preload
                    video.preload = 'metadata';
                    video.muted = true;
                    video.src = url;

                    const onLoaded = () => {
                      cleanup();
                      resolve();
                    };

                    const onError = () => {
                      cleanup();
                      resolve();
                    };

                    // Fallback in case network stalls — don't block forever
                    const timeout = setTimeout(() => {
                      cleanup();
                      resolve();
                    }, 5000);

                    function cleanup() {
                      clearTimeout(timeout);
                      video.removeEventListener('loadedmetadata', onLoaded);
                      video.removeEventListener('error', onError);
                    }

                    video.addEventListener('loadedmetadata', onLoaded);
                    video.addEventListener('error', onError);
                  });
                }

              return new Promise((resolve) => {
                const image = new Image();
                image.onload = () => resolve();
                image.onerror = () => resolve();
                image.src = url;
              });
            }),
          ]);

          setIsPageReady(true);
        };

        const handleWindowLoad = () => {
          preloadAssets();
        };

        if (document.readyState === 'complete') {
          preloadAssets();
          return undefined;
        }

        window.addEventListener('load', handleWindowLoad);

        return () => {
          window.removeEventListener('load', handleWindowLoad);
        };
      }, []);

  useEffect(() => {
    // Track per-section intersection ratios so we can always pick
    // the most visible section as the active one (not just when it first intersects).
    const ratios = sectionRatios.current;

    const observer = new IntersectionObserver(
      (entries) => {
        // Update stored ratios for changed entries
        entries.forEach((entry) => {
          ratios[entry.target.id] = entry.intersectionRatio;
        });

        // Pick the section with the largest ratio
        let maxId = SECTIONS[0];
        let maxRatio = 0;
        SECTIONS.forEach((id) => {
          const r = ratios[id] || 0;
          if (r > maxRatio) {
            maxRatio = r;
            maxId = id;
          }
        });

        // Only update when there's a visible section; this avoids flicker when scrolling between sections
        if (maxRatio > 0.12) {
          setActiveSection((prev) => (prev === maxId ? prev : maxId));
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    SECTIONS.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Initialize ratio to 0 to ensure consistent keys
        ratios[sectionId] = ratios[sectionId] || 0;
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Handle manual navigation
  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Ensure hero video begins playback and keeps looping reliably
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return undefined;

    const tryPlay = async () => {
      try {
        // Some browsers require play() to be initiated after metadata/load
        await video.play();
      } catch (e) {
        // Ignore; autoplay may be blocked until user interaction
      }
    };

    const onLoadedMetadata = () => {
      // Attempt play after metadata is available
      tryPlay();
    };

    const onEnded = () => {
      // Fallback loop: reset time and play
      try {
        video.currentTime = 0;
        video.play().catch(() => {});
      } catch (e) {}
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('ended', onEnded);

    // If page is already ready, try to play immediately (muted autoplay should work)
    if (isPageReady) tryPlay();

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('ended', onEnded);
    };
  }, [isPageReady]);

  return (
    <div className="app-container">
      {!isPageReady && <div className="page-loader" aria-live="polite">Loading SENSEYE...</div>}
      {/* NAVIGATION BAR */}
      <nav className={`top-nav ${isPageReady ? 'is-ready' : 'is-loading'}`}>
        {SECTIONS.map((sec) => (
          <button
            key={sec}
            className={`nav-link ${activeSection === sec ? 'active' : ''}`}
            onClick={() => scrollTo(sec)}
          >
            {NAV_LABELS[sec] || sec}
          </button>
        ))}
      </nav>

      {/* HERO SECTION */}
      <section id="main" className={`hero-section ${isPageReady ? 'is-ready' : 'is-loading'}`}>
        {/* Background Video */}
        <video
          ref={heroVideoRef}
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/bg.jpg"
        >
          <source src="/senseye_bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

     
        {/* Dark overlay */}
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          {/* Animated SENSEYE & Braille Text together */}
          <motion.div
            className="text-container"
            style={{ left: '50%' }}
            initial={{ x: '-50%', opacity: 0, scale: 0.99 }}
            animate={{
              x: showModel ? '-42vw' : '-50%',
              opacity: showModel ? 1 : 0,
              scale: showModel ? 1 : 0.99,
            }}
            transition={{ duration: 1.8, delay: 0.2, ease: 'easeInOut' }}
          >
            <div className="braille">
              ⠎⠑⠝⠎⠑⠽⠑
            </div>
            
            <h1 className="logo">
              SENSEYE
            </h1>

            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              perception beyond sight
            </motion.p>
          </motion.div>

          {/* 3D Model overlapping the last letter of SENSEYE */}
          <motion.div 
            className="canvas-container"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: showModel ? 1 : 0, x: showModel ? 0 : 100 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
          >
            {showModel && (
              <>
                <Canvas frameloop="demand" dpr={1} camera={{ position: [0, 0, 4], fov: 50 }}>
                  <KeepCanvasAlive />
                  <Suspense fallback={null}>
                    <Stage environment={null} intensity={0.6} adjustCamera={1.2}>
                      <ShoeModel />
                    </Stage>
                  </Suspense>
                  <CustomControls />
                </Canvas>
              </>
            )}
          </motion.div>
        </div>
      </section>

        {/* PRICING */}
        <section id="pricing" className={`content-section pricing-section ${isPageReady ? 'is-ready' : 'is-loading'}`}>
          <div className="pricing-card">
            <p className="pricing-kicker">Pricing</p>
            <h2>Starting at ₹15,000 only</h2>
            <p className="pricing-copy">
              Invest in a safer, more independent tomorrow. 
            </p>
            <p className="pricing-copy">
              Take the first step. <span className="order-now">Order now.</span>
            </p>
            
          </div>
        </section>

         {/* SPECIFICATIONS */}
      <section id="specs" className={`content-section specs-section ${isPageReady ? 'is-ready' : 'is-loading'}`}>
        <div className="content-box specs-container">
          <h2>Specifications</h2>
          <div className="specs-grid">
            {SPEC_LIST.map((s) => (
              <div key={s.label} className="spec-item">
                <div className="spec-icon" aria-hidden>
                  {renderSpecIcon(s.label)}
                </div>
                <div className="spec-body">
                  <div className="spec-label">{s.label}</div>
                  <div className="spec-value">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE HELP */}
      <section id="problem-statement" className={`content-section ${isPageReady ? 'is-ready' : 'is-loading'}`}>
        <div className="transparent-box flex-box">
          <div className="text-content" style={{ textAlign: 'center' }}>
            <h2>Who do we empower?</h2>
            <p>
              Over 2.2 billion people live with vision impairment worldwide, yet many still navigate without real-time awareness of their surroundings. This turns simple, everyday movement into a constant challenge.
            </p>
          </div>
          <div className="image-content">
            <img src="/problem.png" alt="Visual impairment challenge" className="section-image" />
          </div>
        </div>
      </section>

      

      {/* DESIGNED FOR INDEPENDENCE */}
      <section id="solution" className={`content-section ${isPageReady ? 'is-ready' : 'is-loading'}`} style={{ 
        position: 'relative', 
        background: "url('/bg.jpg') center/cover no-repeat fixed", 
        padding: '4rem 0', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem' 
      }}>
        
        {/* Lighter Dark Overlay for the entire section to keep brightness */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(10, 10, 10, 0.4)', zIndex: 0 }}></div>
        
        {/* Intro Text */}
        <div style={{ position: 'relative', zIndex: 1, padding: '1rem 4rem', textAlign: 'center' }}>
          <h2 style={{ color: '#FAFAFA', marginBottom: '1.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            Designed for <span className="independence-word">independence</span>
          </h2>
          <p style={{ fontSize: '1.3rem', maxWidth: '1200px', margin: '0 auto', lineHeight: '1.8', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
Senseye is a wearable navigation system that converts environmental information into intuitive haptic feedback. Using depth sensing, it detects obstacles in real time and communicates their direction through vibrations on the foot, enabling safer and more confident movement.          </p>
        </div>

        {/* Slide 2: Belt Unit */}
        <div className="transparent-box flex-box" style={{ position: 'relative', zIndex: 1, minHeight: '50vh', gap: '2rem', alignItems: 'center' }}>
          <div className="image-content" style={{ height: '600px', width: '100%', flex: 1 }}>
            <Canvas frameloop="demand" dpr={1} camera={{ position: [0, 0, 4], fov: 50 }}>
              <KeepCanvasAlive />
              <Suspense fallback={null}>
                <Stage environment={null} intensity={0.6} adjustCamera={1.3}>
                  <BeltModel />
                </Stage>
              </Suspense>
              <CustomControls />
            </Canvas>
          </div>
          <div className="text-content" style={{ textAlign: 'center', flex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            <h3 className="subsection-title">Belt Unit</h3>
            <h4 className="subsection-subtitle">The Eyes</h4>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto', maxWidth: '600px' }}>
            Uses a depth camera and onboard computing to analyze real-time spatial data and identify obstacles based on direction and distance.            </p>
          </div>
        </div>

        {/* Slide 3: Foot Sleeve */}
        <div className="transparent-box flex-box" style={{ position: 'relative', zIndex: 1, minHeight: '50vh', gap: '2rem', alignItems: 'center' }}>
          <div className="text-content" style={{ textAlign: 'center', flex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            <h3 className="subsection-title">Foot Sleeve</h3>
            <h4 className="subsection-subtitle">The Guide</h4>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto', maxWidth: '600px' }}>
              Receives signals via Wi-Fi and delivers directional vibrations through three actuators, enabling intuitive and responsive navigation.
            </p>
          </div>
          <div className="image-content" style={{ height: '600px', width: '100%', flex: 1 }}>
            <Canvas frameloop="demand" dpr={1} camera={{ position: [0, 0, 4], fov: 50 }}>
              <KeepCanvasAlive />
              <Suspense fallback={null}>
                <Stage environment={null} intensity={0.6} adjustCamera={1.1}>
                  <SleeveModel />
                </Stage>
              </Suspense>
              <CustomControls />
            </Canvas>
          </div>
        </div>

      </section>

      
      {/* KEY FEATURES */}
      <section id="features" className={`content-section ${isPageReady ? 'is-ready' : 'is-loading'}`}>
        <div className="content-box features-panel">
          <h2>Why choose us?</h2>
          <div className="feature-grid">
            {FEATURE_CARDS.map((feature, index) => (
              <motion.article
                key={feature.title}
                className="feature-card"
                custom={index}
                variants={featureCardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="feature-card-glow" />
                <span className="feature-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      

      {/* USER TESTIMONIAL */}
      <section id="testimonial" className={`content-section testimonial-section ${isPageReady ? 'is-ready' : 'is-loading'}`}>
        <div className="content-box testimonial-content">
          <VideoTestimonial />
        </div>
      </section>

    </div>
  );
}

export default App;
