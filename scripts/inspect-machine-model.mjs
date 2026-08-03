import { readFile } from "node:fs/promises";
import path from "node:path";
import { Box3, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

globalThis.ProgressEvent ??= class ProgressEvent {};
globalThis.self ??= globalThis;

const modelPath = path.join(
  process.cwd(),
  "public",
  "models",
  "helix-machine.glb",
);
const modelBuffer = await readFile(modelPath);
const loader = new GLTFLoader();
const gltf = await new Promise((resolve, reject) => {
  loader.parse(
    modelBuffer.buffer.slice(
      modelBuffer.byteOffset,
      modelBuffer.byteOffset + modelBuffer.byteLength,
    ),
    "",
    resolve,
    reject,
  );
});

gltf.scene.updateMatrixWorld(true);

const hierarchy = [];
let objectCount = 0;
let triangleCount = 0;

gltf.scene.traverse((object) => {
  objectCount += 1;
  const worldPosition = object.getWorldPosition(new Vector3());
  const record = {
    children: object.children.map((child) => child.name || child.type),
    name: object.name || "(unnamed)",
    parent: object.parent?.name || object.parent?.type || null,
    type: object.type,
    worldPosition: worldPosition.toArray(),
  };

  if (object.isMesh) {
    const position = object.geometry.getAttribute("position");
    const triangles = object.geometry.index
      ? object.geometry.index.count / 3
      : position.count / 3;
    const worldBounds = new Box3().setFromObject(object);

    triangleCount += triangles;
    Object.assign(record, {
      localBounds: {
        max: object.geometry.boundingBox?.max.toArray() ?? null,
        min: object.geometry.boundingBox?.min.toArray() ?? null,
      },
      material: Array.isArray(object.material)
        ? object.material.map((material) => material.name)
        : object.material.name,
      triangles,
      vertices: position.count,
      worldBounds: {
        max: worldBounds.max.toArray(),
        min: worldBounds.min.toArray(),
        size: worldBounds.getSize(new Vector3()).toArray(),
      },
    });
  }

  hierarchy.push(record);
});

process.stdout.write(
  `${JSON.stringify(
    {
      fileBytes: modelBuffer.byteLength,
      hierarchy,
      objectCount,
      sceneBounds: (() => {
        const bounds = new Box3().setFromObject(gltf.scene);
        return {
          max: bounds.max.toArray(),
          min: bounds.min.toArray(),
          size: bounds.getSize(new Vector3()).toArray(),
        };
      })(),
      triangleCount,
    },
    null,
    2,
  )}\n`,
);
