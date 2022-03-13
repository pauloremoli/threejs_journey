import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import gsap from "gsap";

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

//Debug UI
const gui = new dat.GUI();
const parameters = {
	color: 0xff0000,
	spin: () => {
		gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + 10 });
	},
};

//Scene
const scene = new THREE.Scene();

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
	console.log("Loading complete!");
};
loadingManager.onProgress = (url, number, total) => {
	console.log(
		"Loading file: " +
			url +
			".\nLoaded " +
			itemsLoaded +
			" of " +
			itemsTotal +
			" files."
	);
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load("./door/color.jpg");

const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ map: texture })
);
gui.add(cube.material, "wireframe");
gui.addColor(parameters, "color").onChange(() => {
	cube.material.color.set(parameters.color);
});
gui.add(parameters, "spin");

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

camera.position.z = 3;
camera.position.y = 0.3;
camera.position.x = 0.3;

gui.add(camera.position, "x", -10, 10, 0.01);
gui.add(camera.position, "y", -10, 10, 0.01);
gui.add(camera.position, "z", -10, 10, 0.01);

camera.lookAt(cube.position);
scene.add(camera);

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
