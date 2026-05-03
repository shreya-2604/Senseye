import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { motion } from 'framer-motion';
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

const SECTIONS = ['main', 'problem-statement', 'solution', 'features'];

const FEATURE_CARDS = [
  {
    title: 'Image based sensing',
    description: 'Captures spatial detail in real time to identify obstacles with clarity and precision.',
  },
  {
    title: 'Hands-free modular design',
    description: 'A wearable architecture that keeps the user unencumbered while adapting to daily routines.',
  },
  {
    title: 'Real-time processing',
    description: 'Processes environmental data instantly so guidance stays responsive as conditions change.',
  },
  {
    title: 'Smartphone independent',
    description: 'Operates as a self-contained system, reducing dependency on external devices or apps.',
  },
];

function App() {
  const [showModel, setShowModel] = useState(false);
  const [activeSection, setActiveSection] = useState('main');
  const [isPageReady, setIsPageReady] = useState(false);

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
          const assetUrls = ['/bg-vid.mp4', '/bg.jpg', '/problem.png'];

          await Promise.all([
            document.fonts?.ready ?? Promise.resolve(),
            ...assetUrls.map((url) => {
              if (url.endsWith('.mp4')) {
                return new Promise((resolve) => {
                  const video = document.createElement('video');
                  video.preload = 'auto';
                  video.muted = true;
                  video.src = url;
                  video.onloadeddata = () => resolve();
                  video.onerror = () => resolve();
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
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleSections[0]) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        threshold: 0.6,
      }
    );

    SECTIONS.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
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
            {sec === 'main'
              ? 'Home'
              : sec === 'problem-statement'
                ? 'Problem statement'
                : sec === 'solution'
                  ? 'Solution'
                  : 'Key Features'}
          </button>
        ))}
      </nav>

      {/* HERO SECTION */}
      <section id="main" className={`hero-section ${isPageReady ? 'is-ready' : 'is-loading'}`}>
        {/* Background Video */}
        <video 
          className="hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/bg-vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay */}
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          {/* Animated SENSEYE & Braille Text together */}
          <motion.div
            className="text-container"
            style={{ left: '50%' }}
            initial={{ x: '-50%', opacity: 0, scale: 0.97 }}
            animate={{
              x: showModel ? '-42vw' : '-50%',
              opacity: showModel ? 1 : 0,
              scale: showModel ? 1 : 0.97,
            }}
            transition={{ duration: 3.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
              <Canvas shadows="percentage" dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
                <Suspense fallback={null}>
                  <Stage environment={null} intensity={0.6} adjustCamera={1.2}>
                    <ShoeModel />
                  </Stage>
                </Suspense>
                <CustomControls />
              </Canvas>
            )}
          </motion.div>
        </div>
      </section>

      {/* WHO WE HELP */}
      <section id="problem-statement" className={`content-section ${isPageReady ? 'is-ready' : 'is-loading'}`}>
        <div className="transparent-box flex-box">
          <div className="text-content" style={{ textAlign: 'center' }}>
            <h2>Who we empower?</h2>
            <p>
              More than 2.2 billion people worldwide live with vision impairment. Many still lack dependable, real-time awareness of the spaces around them, making safe and confident mobility unnecessarily difficult.
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
          <h2 style={{ color: '#FAFAFA', marginBottom: '1.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>Designed for independence</h2>
          <p style={{ fontSize: '1.3rem', maxWidth: '1200px', margin: '0 auto', lineHeight: '1.8', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
            SENSEYE is a wearable navigation system that translates spatial information into intuitive haptic guidance. Using high-fidelity depth sensing and rapid onboard processing, it detects environmental obstacles and communicates direction through precise foot-based feedback, helping users move with greater confidence and independence.
          </p>
        </div>

        {/* Slide 2: Foot Sleeve */}
        <div className="transparent-box flex-box" style={{ position: 'relative', zIndex: 1, minHeight: '50vh', gap: '2rem', alignItems: 'center' }}>
          <div className="image-content" style={{ height: '600px', width: '100%', flex: 1 }}>
            <Canvas shadows="percentage" dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
              <Suspense fallback={null}>
                <Stage environment={null} intensity={0.6} adjustCamera={1.1}>
                  <SleeveModel />
                </Stage>
              </Suspense>
              <CustomControls />
            </Canvas>
          </div>
          <div className="text-content" style={{ textAlign: 'center', flex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            <h3 className="subsection-title">Foot Sleeve</h3>
            <h4 className="subsection-subtitle">Haptic Feedback Actuator</h4>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto', maxWidth: '600px' }}>
              Engineered to deliver precise directional vibration, this module helps users interpret nearby obstacles quickly and navigate complex environments with confidence.
            </p>
          </div>
        </div>

        {/* Slide 3: Belt Unit */}
        <div className="transparent-box flex-box" style={{ position: 'relative', zIndex: 1, minHeight: '50vh', gap: '2rem', alignItems: 'center' }}>
          <div className="text-content" style={{ textAlign: 'center', flex: 1, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            <h3 className="subsection-title">Belt Unit</h3>
            <h4 className="subsection-subtitle">Depth Sensing Module</h4>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: '0 auto', maxWidth: '600px' }}>
              Equipped with depth sensing and continuous processing, the belt tracks spatial topology in real time to identify the distance and direction of potential hazards.
            </p>
          </div>
          <div className="image-content" style={{ height: '600px', width: '100%', flex: 1 }}>
            <Canvas shadows="percentage" dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
              <Suspense fallback={null}>
                <Stage environment={null} intensity={0.6} adjustCamera={1.3}>
                  <BeltModel />
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
          <h2>Key Features</h2>
          <div className="feature-grid">
            {FEATURE_CARDS.map((feature) => (
              <motion.article
                key={feature.title}
                className="feature-card"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="feature-card-glow" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
