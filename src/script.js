import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AmbientLight, MeshBasicMaterial } from "three";

// textures
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
	"/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/4.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

const environmentMapTexture = cubeTextureLoader.load([
	"/textures/environmentMaps/1/px.jpg",
	"/textures/environmentMaps/1/nx.jpg",
	"/textures/environmentMaps/1/py.jpg",
	"/textures/environmentMaps/1/ny.jpg",
	"/textures/environmentMaps/1/pz.jpg",
	"/textures/environmentMaps/1/nz.jpg",
]);

const canvas = document.querySelector(".webgl");

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
	const fullscreenElement =
		document.fullscreenElement || document.webkitFullscreenElement;
	if (!fullscreenElement) {
		if (canvas.fullscreenElement) {
			canvas.requestFullscreen();
		} else if (canvas.webkitRequestFullscreen) {
			canvas.webkitRequestFullscreen();
		}
	} else {
		document.exitFullscreen();
		if (canvas.exitFullscreen) {
			canvas.exitFullscreen();
		} else if (canvas.webkitExitFullscreen) {
			canvas.webkitExitFullscreen();
		}
	}
});

// Cursor
const cursor = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

const scene = new THREE.Scene();

// Objects

// const material = new MeshBasicMaterial();
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;
// material.transparent = true;
// material.map = doorColorTexture;

// const material = new THREE.MeshNormalMaterial();
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 200;

const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 0;

// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;

material.envMap = environmentMapTexture;

const sphere = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 20, 20),
	material
);
sphere.position.x = 1.5;

const torus = new THREE.Mesh(
	new THREE.TorusBufferGeometry(0.3, 0.2, 100, 100),
	material
);
torus.position.x = -1.5;
scene.add(torus);

const plane = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(1, 1, 20, 20),
	material
);

plane.geometry.setAttribute(
	"uv2",
	new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

plane.position.x = 0;
scene.add(plane);

scene.add(sphere);

// Light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(pointLight);

// Camera
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);

camera.position.z = 10;
camera.position.y = 0.3;
camera.position.x = 0.3;

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	sphere.rotation.y = elapsedTime * 0.2;
	torus.rotation.y = elapsedTime * 0.2;
	plane.rotation.y = elapsedTime * 0.2;

	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
