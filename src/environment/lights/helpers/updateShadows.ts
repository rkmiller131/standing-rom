import { GLTF } from '../../../THREE_Interface'

/**
 * Updates shadows for objects in a GLTF scene.
 * @param {GLTF} gltf - The GLTF object containing the scene to update shadows for.
 * @returns {GLTF} The updated GLTF object.
*/
export default function updateShadows(gltf: GLTF) {
    gltf.scene.traverse((object) => {
      if (object) {
        const isCastShadow =
          object.name === "Cube_3" ||
          object.name === "Cube_7" ||
          object.name === "Cube_8" ||
          object.name === "Cube_9" ||
          object.name === "Cube_10" ||
          object.name === "Cube_11" ||
          object.name === "Cube_12";
        const isReceiveShadow =
          object.name === "Cube_13" ||
          object.name === "Cube_3" ||
          object.name === "Cube_4" ||
          object.name === "Cube_5" ||
          object.name === "Cube_7" ||
          object.name === "Cube_8";

        if (isCastShadow) {
          object.castShadow = true;
        //   console.log(`Set castShadow for object: ${object.name}`);
        }
        if (isReceiveShadow) {
          object.receiveShadow = true;
        //   console.log(`Set receiveShadow for object: ${object.name}`);
        }
      }
    });
    return gltf;
  }