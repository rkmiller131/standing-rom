import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { WebGLRenderer } from "three";

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

export type { GLTF, VRM };

export { VRMLoaderPlugin, gltfLoader, dracoLoader, WebGLRenderer };
