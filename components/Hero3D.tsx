"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function String({ position, length }: { position: [number, number, number]; length: number }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.008, 0.008, length, 8]} />
      <meshStandardMaterial color="#8A6C5D" transparent opacity={0.62} />
    </mesh>
  );
}

function Cloud() {
  return (
    <group>
      <mesh position={[-0.28, 0, 0]} scale={0.56}>
        <sphereGeometry args={[0.48, 20, 20]} />
        <meshStandardMaterial color="#FFF8EF" roughness={0.65} />
      </mesh>
      <mesh position={[0.12, 0.12, 0]} scale={0.74}>
        <sphereGeometry args={[0.48, 20, 20]} />
        <meshStandardMaterial color="#FFF8EF" roughness={0.65} />
      </mesh>
      <mesh position={[0.5, -0.02, 0]} scale={0.48}>
        <sphereGeometry args={[0.48, 20, 20]} />
        <meshStandardMaterial color="#FFF8EF" roughness={0.65} />
      </mesh>
      <RoundedBox args={[1.25, 0.36, 0.42]} radius={0.18} smoothness={4} position={[0.1, -0.18, 0]}>
        <meshStandardMaterial color="#FFF8EF" roughness={0.65} />
      </RoundedBox>
    </group>
  );
}

function Sun() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color="#F2A93C" roughness={0.55} />
      </mesh>
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.62, Math.sin(angle) * 0.62, 0]}
            rotation={[0, 0, angle]}
          >
            <capsuleGeometry args={[0.055, 0.18, 4, 8]} />
            <meshStandardMaterial color="#F2A93C" roughness={0.55} />
          </mesh>
        );
      })}
    </group>
  );
}

function Star() {
  return (
    <group>
      {Array.from({ length: 5 }).map((_, index) => (
        <RoundedBox
          key={index}
          args={[0.17, 0.76, 0.2]}
          radius={0.08}
          smoothness={4}
          rotation={[0, 0, (index / 5) * Math.PI * 2]}
          position={[
            Math.sin((index / 5) * Math.PI * 2) * 0.18,
            Math.cos((index / 5) * Math.PI * 2) * 0.18,
            0,
          ]}
        >
          <meshStandardMaterial color="#E8927C" roughness={0.6} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Heart() {
  return (
    <group rotation={[0, 0, Math.PI]} scale={0.72}>
      <mesh position={[-0.22, 0.12, 0]}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial color="#EF7C5C" roughness={0.58} />
      </mesh>
      <mesh position={[0.22, 0.12, 0]}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial color="#EF7C5C" roughness={0.58} />
      </mesh>
      <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.66, 0.66, 0.52]}>
        <boxGeometry args={[0.72, 0.72, 0.5]} />
        <meshStandardMaterial color="#EF7C5C" roughness={0.58} />
      </mesh>
    </group>
  );
}

function MobileScene() {
  const group = useRef<Group>(null);
  const reduced = useReducedMotion();

  useFrame((state, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x +=
      (state.pointer.y * 0.09 - group.current.rotation.x) * 0.025;
    group.current.rotation.z +=
      (-state.pointer.x * 0.07 - group.current.rotation.z) * 0.025;
  });

  return (
    <group ref={group} position={[0, 0.15, 0]}>
      <mesh position={[0, 1.72, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.045, 2.65, 6, 12]} />
        <meshStandardMaterial color="#9C715C" roughness={0.65} />
      </mesh>
      <mesh position={[0, 1.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.035, 10, 40]} />
        <meshStandardMaterial color="#9C715C" roughness={0.65} />
      </mesh>

      <String position={[-1.06, 0.9, 0]} length={1.55} />
      <Float speed={reduced ? 0 : 1.4} rotationIntensity={reduced ? 0 : 0.12} floatIntensity={reduced ? 0 : 0.16}>
        <group position={[-1.06, 0.05, 0]} scale={0.82}>
          <Cloud />
        </group>
      </Float>

      <String position={[0.92, 0.98, 0.08]} length={1.38} />
      <Float speed={reduced ? 0 : 1.2} rotationIntensity={reduced ? 0 : 0.14} floatIntensity={reduced ? 0 : 0.18}>
        <group position={[0.92, 0.18, 0.08]} scale={0.76}>
          <Sun />
        </group>
      </Float>

      <String position={[-0.28, 0.42, 0.34]} length={2.1} />
      <Float speed={reduced ? 0 : 1.05} rotationIntensity={reduced ? 0 : 0.16} floatIntensity={reduced ? 0 : 0.14}>
        <group position={[-0.28, -0.72, 0.34]} scale={0.72}>
          <Star />
        </group>
      </Float>

      <String position={[1.25, 0.25, -0.32]} length={2.42} />
      <Float speed={reduced ? 0 : 1.3} rotationIntensity={reduced ? 0 : 0.18} floatIntensity={reduced ? 0 : 0.16}>
        <group position={[1.25, -1.08, -0.32]} scale={0.66}>
          <Heart />
        </group>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.2, 6], fov: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={2.3} />
      <directionalLight position={[4, 5, 5]} intensity={2.6} color="#FFF3D5" />
      <directionalLight position={[-3, 1, 4]} intensity={1.25} color="#F5A98F" />
      <MobileScene />
    </Canvas>
  );
}
