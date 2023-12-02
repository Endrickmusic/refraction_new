import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, folder, useControls } from "leva";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";
import { range } from './utils';
import './index.css';
import { Geometries } from './Geometries.jsx'

import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';


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
