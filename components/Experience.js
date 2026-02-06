"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  useGLTF,
  Environment,
  useAnimations,
  useTexture
} from "@react-three/drei";
import * as THREE from "three";

/* =========================================================
   MODEL
========================================================= */

function AnimatedModel({ file }) {
  const groupRef = useRef();
  const scrollRef = useRef();
  const [hovered, setHovered] = useState(false);

  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  const { scene, animations } = useGLTF(file);
  const { actions, names } = useAnimations(animations, groupRef);

  const textures = useTexture({
    map: "/textures/color.png",
    normalMap: "/textures/normal.png",
    roughnessMap: "/textures/roughness.png",
    metalnessMap: "/textures/metalness.png",
    aoMap: "/textures/ao.png"
  });

  /* ---------------- APPLY TEXTURES ---------------- */

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.map = textures.map;
        child.material.normalMap = textures.normalMap;
        child.material.roughnessMap = textures.roughnessMap;
        child.material.metalnessMap = textures.metalnessMap;
        child.material.aoMap = textures.aoMap;
        child.material.metalness = 1;
        child.material.roughness = 0.5;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, textures]);

  /* ---------------- ANIMATION CONTROL ---------------- */

  useEffect(() => {
    Object.values(actions).forEach(a => a.stop());

    if (hovered) {
      const explode =
        actions["Explosion"] ||
        actions["explode"] ||
        actions[names[1]];
      explode?.reset().fadeIn(0.5).play();
    } else {
      const fly =
        actions["Flying"] ||
        actions["Idle"] ||
        actions[names[0]];
      fly?.reset().fadeIn(0.5).play();
    }
  }, [hovered, actions, names]);

  /* ---------------- SCROLL LOGIC ---------------- */

  useFrame((state) => {
    if (!scrollRef.current) return;

    const scrollY = window.scrollY;

    /* ===== FEATURES VISIBILITY (MOBILE ONLY) ===== */
    const features = document.getElementById("features");
    const featuresVisible =
      isMobile &&
      features &&
      features.getBoundingClientRect().top < window.innerHeight * 0.7;

    /* ===== MOBILE EXIT ===== */
    if (featuresVisible) {
      const outPos = { x: 6, y: -8, z: 0 };

      scrollRef.current.position.x = THREE.MathUtils.lerp(
        scrollRef.current.position.x,
        outPos.x,
        0.08
      );

      scrollRef.current.position.y = THREE.MathUtils.lerp(
        scrollRef.current.position.y,
        outPos.y,
        0.08
      );

      scrollRef.current.position.z = THREE.MathUtils.lerp(
        scrollRef.current.position.z,
        outPos.z,
        0.08
      );

      return;
    }

    /* ===== NORMAL MOVEMENT ===== */

    const totalHeight =
      document.body.scrollHeight - window.innerHeight;

    let progress = Math.min(
      1,
      Math.max(0, scrollY / totalHeight)
    );

    const desktopP1 = { x: 0.6, y: -2.3, z: 0.1, rX: 0, rY: -0.3, rZ: 0, s: 15 };
    const desktopP2 = { x: -7, y: -3.8, z: 0.1, rX: 0, rY: 2.5, rZ: 0, s: 10 };
    const desktopP3 = { x: 4, y: 0, z: 0.1, rX: 0, rY: -2.7, rZ: 0, s: 7 };

    const mobileP1 = { x: 0, y: -1.5, z: 0, rX: 0, rY: 0, rZ: 0, s: 8 };
    const mobileP2 = { x: 0, y: -3, z: 0, rX: 0.2, rY: 0.5, rZ: 0, s: 6 };
    const mobileP3 = { x: 0, y: 1, z: 0, rX: 0, rY: 0, rZ: 0, s: 5 };

    const p1 = isMobile ? mobileP1 : desktopP1;
    const p2 = isMobile ? mobileP2 : desktopP2;
    const p3 = isMobile ? mobileP3 : desktopP3;

    let target;

    if (progress < 0.25) {
      target = interpolate(p1, p2, progress / 0.25);
    } else if (progress < 0.55) {
      target = { ...p2 };
    } else if (progress < 0.8) {
      target = interpolate(p2, p3, (progress - 0.55) / 0.25);
    } else {
      target = { ...p3 };
    }

    const offsetX = isMobile ? -2 : 0;
    const offsetY = isMobile ? -1.2 : 0;

    scrollRef.current.position.set(
      target.x + offsetX,
      target.y + offsetY,
      target.z
    );

    scrollRef.current.rotation.set(
      target.rX,
      target.rY,
      target.rZ
    );

    scrollRef.current.scale.setScalar(target.s);

    /* mouse rotation only desktop */
    if (groupRef.current && !isMobile) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.mouse.x * 0.5,
        0.1
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -state.mouse.y * 0.2,
        0.1
      );
    }
  });

  return (
    <group ref={scrollRef}>
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={scene} />
      </group>
    </group>
  );
}

/* ========================================================= */

function interpolate(start, end, t) {
  return {
    x: THREE.MathUtils.lerp(start.x, end.x, t),
    y: THREE.MathUtils.lerp(start.y, end.y, t),
    z: THREE.MathUtils.lerp(start.z, end.z, t),
    rX: THREE.MathUtils.lerp(start.rX, end.rX, t),
    rY: THREE.MathUtils.lerp(start.rY, end.rY, t),
    rZ: THREE.MathUtils.lerp(start.rZ, end.rZ, t),
    s: THREE.MathUtils.lerp(start.s, end.s, t)
  };
}

/* =========================================================
   EXPERIENCE
========================================================= */

export default function Experience() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <spotLight position={[-5, 5, 5]} intensity={3} />
      <Environment preset="city" />

      {isMobile ? (
        <AnimatedModel file="/model.glb" />
      ) : (
        <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5}>
          <AnimatedModel file="/model.glb" />
        </Float>
      )}

      <ContactShadows
        position={[0, -4, 0]}
        opacity={0.6}
        scale={20}
        blur={2.5}
        far={2.5}
      />
    </>
  );
}
