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
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Set to false for better mobile performance
      alpha: true 
    });
    
    // Responsive Star Count: Fewer stars on mobile to save battery/performance
    const isMobile = window.innerWidth < 768;
    const starsCount = isMobile ? 3000 : 8000;
    const starSize = isMobile ? 0.012 : 0.006; // Larger stars on mobile screens

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15; 
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      size: starSize,
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    pointsRef.current = starField;
    scene.add(starField);

    // Comet Logic
    const cometGeo = new THREE.BufferGeometry();
    cometGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
    const cometMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const comet = new THREE.Points(cometGeo, cometMat);
    cometRef.current = comet;
    scene.add(comet);

    camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      starField.rotation.y += 0.0003;
      if (cometMat.opacity > 0) {
        cometMat.opacity -= 0.02;
        comet.position.x += 0.12;
        comet.position.y -= 0.06;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (pointsRef.current) {
      const scrollDiff = Math.abs(scrollY - prevScrollY.current);
      // Faster scroll reaction for mobile touch swiping
      pointsRef.current.rotation.z = scrollY * 0.002;
      pointsRef.current.position.z = scrollY * 0.005;

      // Sensitive Comet Trigger
      if (scrollDiff > 30 && cometRef.current.material.opacity <= 0) {
        const side = Math.random() > 0.5 ? -1 : 1;
        cometRef.current.position.set(side * 3, (Math.random() - 0.5) * 4, -1);
        cometRef.current.material.opacity = 1;
      }
      prevScrollY.current = scrollY;
    }
  }, [scrollY]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />;
};

export default GalaxyBackground;