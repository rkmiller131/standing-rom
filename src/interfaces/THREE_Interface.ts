import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import {
  WebGLRenderer,
  AudioListener,
  AudioLoader,
  TextureLoader,
} from 'three';

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
const audioListener = new AudioListener();
const audioLoader = new AudioLoader();
const textureLoader = new TextureLoader();

export type { GLTF, VRM };

export {
  VRMLoaderPlugin,
  gltfLoader,
  dracoLoader,
  WebGLRenderer,
  audioListener,
  audioLoader,
  textureLoader,
};