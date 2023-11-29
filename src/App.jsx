import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, folder, useControls } from "leva";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { range } from './utils';
import './index.css';

import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

const Geometries = () => {
  // This reference gives us direct access to our mesh
  const mesh = useRef();
  const backgroundGroup = useRef();
  
  // This is our main render target where we'll render and store the scene as a texture
  const mainRenderTarget = useFBO();

  const {
    iorR,
    iorG,
    iorB,
    chromaticAberration,
    refraction
  } = useControls({
    ior: folder({
      iorR: { min: 1.0, max: 2.333, step: 0.001, value: 1.15 },
      iorG: { min: 1.0, max: 2.333, step: 0.001, value: 1.18 },
      iorB: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
    }),
    chromaticAberration: {
      value: 0.5,
      min: 0,
      max: 1.5,
      step: 0.01,
    },
    refraction: {
      value: 0.4,
      min: 0,
      max: 1,
      step: 0.01,
    },
  })

  const uniforms = useMemo(() => ({
    uTexture: {
      value: null
    },
    uIorR: {
      value: 1.0,
    },
    uIorG: {
      value: 1.0,
    },
    uIorB: {
      value: 1.0,
    },
    uRefractPower: {
      value: 0.2,
    },
    uChromaticAberration: {
      value: 1.0
    },
    winResolution: {
      value: new THREE.Vector2(
        window.innerWidth,
        window.innerHeight
      ).multiplyScalar(Math.min(window.devicePixelRatio, 2)), // if DPR is 3 the shader glitches 🤷‍♂️
    },
  }), [])

  useFrame((state) => {
    const { gl, scene, camera } = state;
    mesh.current.visible = false;
    gl.setRenderTarget(mainRenderTarget);
    gl.render(scene, camera);

    mesh.current.material.uniforms.uTexture.value = mainRenderTarget.texture;

    gl.setRenderTarget(null);
    mesh.current.visible = true;

    mesh.current.material.uniforms.uIorR.value = iorR;
    mesh.current.material.uniforms.uIorG.value = iorG;
    mesh.current.material.uniforms.uIorB.value = iorB;

    mesh.current.material.uniforms.uChromaticAberration.value = chromaticAberration;
    mesh.current.material.uniforms.uRefractPower.value = refraction;
  });

  const columns = range(-12.5, 12.5, 2.5);
  const rows = range(-12.5, 12.5, 2.5);

  return (
    <>
      <color attach="background" args={["white"]} />
      <group ref={backgroundGroup}>
        {columns.map((col, i) =>
          rows.map((row, j) => (
            <mesh position={[col, row, -4]}>
              <boxGeometry args={[0.5, .5, .5]} />
              <meshStandardMaterial color="grey" />
            </mesh>
          ))
        )}
      </group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[2.84, 20]} />
        <shaderMaterial
          key={uuidv4()}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </>
  );
};

const Scene = () => {
  return (
    <>
      <Leva collapsed />
      <Canvas camera={{ position: [-3, 0, 6] }} dpr={[1, 2]}>
        <ambientLight intensity={1.4} />
        <Geometries />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default Scene;
