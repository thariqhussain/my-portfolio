import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const GalaxyBackground = ({ scrollY }) => {
  const containerRef = useRef();
  const pointsRef = useRef();
  const cometRef = useRef();
  const prevScrollY = useRef(0);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- MAIN GALAXY ---
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 8000;
    const posArray = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15; 
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.006,
      color: 0x60a5fa, // Light blue tint
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    pointsRef.current = starField;
    scene.add(starField);

    // --- COMET / SHOOTING STAR ---
    const cometGeo = new THREE.BufferGeometry();
    const cometPos = new Float32Array(3); // Single point
    cometGeo.setAttribute('position', new THREE.BufferAttribute(cometPos, 3));
    const cometMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0, // Hidden by default
      blending: THREE.AdditiveBlending,
    });
    const comet = new THREE.Points(cometGeo, cometMat);
    cometRef.current = comet;
    scene.add(comet);

    camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      starField.rotation.y += 0.0003;
      
      // Comet logic: Fade out over time
      if (cometMat.opacity > 0) {
        cometMat.opacity -= 0.02;
        comet.position.x += 0.1; // Comet moves across screen
        comet.position.y -= 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // --- SCROLL ANIMATION & COMET TRIGGER ---
  useEffect(() => {
    if (pointsRef.current && cometRef.current) {
      const scrollDiff = Math.abs(scrollY - prevScrollY.current);
      
      // Warp Speed Logic
      pointsRef.current.rotation.z = scrollY * 0.0015;
      pointsRef.current.position.z = scrollY * 0.004;

      // Shooting Star Trigger: If user scrolls faster than 50px per frame
      if (scrollDiff > 50 && cometRef.current.material.opacity <= 0) {
        const side = Math.random() > 0.5 ? -1 : 1;
        cometRef.current.position.set(side * 3, Math.random() * 2, -1);
        cometRef.current.material.opacity = 1;
      }

      prevScrollY.current = scrollY;
    }
  }, [scrollY]);

  return <div ref={containerRef} className="galaxy-canvas-container" />;
};

export default GalaxyBackground;