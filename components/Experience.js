"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber"; // Added useThree
import { Float, ContactShadows, useGLTF, Environment, useAnimations, useTexture } from "@react-three/drei";
import * as THREE from "three";

function AnimatedModel({ file }) {
  const groupRef = useRef();      
  const scrollRef = useRef();     
  const [hovered, setHovered] = useState(false);
  
  // 1. DETECT MOBILE
  const { viewport } = useThree();
  const isMobile = viewport.width < 5; // Simple check: if 3D scene is narrow, it's mobile

  // 2. Load Model & Animations
  const { scene, animations } = useGLTF(file);
  const { actions, names } = useAnimations(animations, groupRef);

  // 3. Load Textures
  const props = useTexture({
    map: '/textures/color.png',          
    normalMap: '/textures/normal.png',   
    roughnessMap: '/textures/roughness.png', 
    metalnessMap: '/textures/metalness.png', 
    aoMap: '/textures/ao.png',           
  });

  // 4. Apply Textures
  useEffect(() => {
    const FLIP_TEXTURES = false; 
    props.map.flipY = FLIP_TEXTURES;
    props.normalMap.flipY = FLIP_TEXTURES;
    props.roughnessMap.flipY = FLIP_TEXTURES;
    props.metalnessMap.flipY = FLIP_TEXTURES;
    props.aoMap.flipY = FLIP_TEXTURES;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.map = props.map;
        child.material.normalMap = props.normalMap;
        child.material.roughnessMap = props.roughnessMap;
        child.material.metalnessMap = props.metalnessMap;
        child.material.aoMap = props.aoMap;
        child.material.metalness = 1.0; 
        child.material.roughness = 0.5; 
        child.material.needsUpdate = true;
      }
    });
  }, [props, scene]);

  // 5. Manage Animations
  useEffect(() => {
    Object.values(actions).forEach(action => action.stop());
    if (hovered) {
      const explodeAnim = actions["Explosion"] || actions["explode"] || actions[names[1]];
      if (explodeAnim) {
        explodeAnim.reset().fadeIn(0.5).play();
        explodeAnim.clampWhenFinished = true;
        explodeAnim.loop = THREE.LoopOnce;
      }
    } else {
      const flyAnim = actions["Flying"] || actions["Idle"] || actions[names[0]];
      if (flyAnim) {
        flyAnim.reset().fadeIn(0.5).play();
      }
    }
  }, [hovered, actions, names]);

  // 6. SCROLL LOGIC (MOBILE VS DESKTOP)
  useFrame((state) => {
    if (scrollRef.current) {
      const scrollY = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      let progress = Math.min(1, Math.max(0, scrollY / totalHeight));

      // --- DESKTOP COORDINATES (Your Original Zig-Zag) ---
      const desktopP1 = { x: 0.6, y: -2.3, z: 0.1, rX: 0, rY: -0.3, rZ: 0, s: 15 }; 
      const desktopP2 = { x: -7, y: -3.8, z: 0.1, rX: 0, rY: 2.5, rZ: 0, s: 10 };   
      const desktopP3 = { x: 4, y: 0, z: 0.1, rX: 0, rY: -2.7, rZ: 0, s: 7 };     

      // --- MOBILE COORDINATES (Stay in Center, Move Up/Down) ---
      // Smaller scale (s: 8 -> 6) and x is always 0
      const mobileP1 = { x: 0, y: -1.5, z: 0, rX: 0, rY: 0, rZ: 0, s: 8 }; 
      const mobileP2 = { x: 0, y: -3, z: 0, rX: 0.2, rY: 0.5, rZ: 0, s: 6 };   
      const mobileP3 = { x: 0, y: 1, z: 0, rX: 0, rY: 0, rZ: 0, s: 5 };     

      // Select which set to use
      const p1 = isMobile ? mobileP1 : desktopP1;
      const p2 = isMobile ? mobileP2 : desktopP2;
      const p3 = isMobile ? mobileP3 : desktopP3;

      let target = {};

      if (progress < 0.25) {
        target = interpolate(p1, p2, progress / 0.25);
      } else if (progress >= 0.25 && progress < 0.55) {
        target = { ...p2 }; 
      } else if (progress >= 0.55 && progress < 0.8) {
        target = interpolate(p2, p3, (progress - 0.55) / 0.25);
      } else {
        target = { ...p3 };
      }

      scrollRef.current.position.set(target.x, target.y, target.z);
      scrollRef.current.rotation.set(target.rX, target.rY, target.rZ);
      scrollRef.current.scale.setScalar(target.s);
    }

    if (groupRef.current) {
      const mouseX = state.mouse.x;
      const mouseY = state.mouse.y;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.5, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.2, 0.1);
    }
  });

  return (
    <group ref={scrollRef}>
      <group 
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        dispose={null}
      >
        <primitive object={scene} /> 
      </group>
    </group>
  );
}

function interpolate(start, end, t) {
  return {
    x: THREE.MathUtils.lerp(start.x, end.x, t),
    y: THREE.MathUtils.lerp(start.y, end.y, t),
    z: THREE.MathUtils.lerp(start.z, end.z, t),
    rX: THREE.MathUtils.lerp(start.rX, end.rX, t),
    rY: THREE.MathUtils.lerp(start.rY, end.rY, t),
    rZ: THREE.MathUtils.lerp(start.rZ, end.rZ, t),
    s: THREE.MathUtils.lerp(start.s, end.s, t),
  };
}

export default function Experience() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <spotLight position={[-5, 5, 5]} intensity={3} color="#ffffff" />
      <Environment preset="city" />

      <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5}>
        <AnimatedModel file="/model.glb" />
      </Float>

      <ContactShadows position={[0, -4, 0]} opacity={0.6} scale={20} blur={2.5} far={2.5} />
    </>
  );
}