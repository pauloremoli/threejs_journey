import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

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

const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshStandardMaterial()
);

scene.add(cube);

cube.position.x = 0;
cube.position.y = 0;
cube.position.z = 0;

// force the order to apply the rotation
cube.rotation.reorder("YXZ");

cube.rotation.x = 0.2;
cube.rotation.y = 1;
cube.rotation.z = -1;

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);

camera.position.z = 10;
camera.position.y = 0.3;
camera.position.x = 0.3;

camera.lookAt(cube.position);
scene.add(camera);

//Lights
const hemisphereLight = new THREE.HemisphereLight("blue", "yellow", 0.5);
scene.add(hemisphereLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);
directionalLight.position.set(1, 0.25, 0);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(
	0x78ff00,
	0.5,
	10,
	Math.PI * 0.1,
	0.25,
	1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

rectAreaLight.position.set(-1.5, 0, 4.5);
rectAreaLight.lookAt(new THREE.Vector3());

//helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
	hemisphereLight,
	0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
	directionalLight,
	0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
window.requestAnimationFrame(() => {
	spotLightHelper.update();
});

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);

const tick = () => {
	camera.lookAt(cube.position);
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
