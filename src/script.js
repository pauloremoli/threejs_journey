import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

const group = new THREE.Group();
scene.add(group);

const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
group.add(cube);

cube.position.x = 0;
cube.position.y = 0;
cube.position.z = 0;

// force the order to apply the rotation
cube.rotation.reorder("YXZ");

cube.rotation.x = 0.2;
cube.rotation.y = 1;
cube.rotation.z = -1;

const axisHelper = new THREE.AxesHelper();
scene.add(axisHelper);

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	100
);

camera.position.z = 3;
camera.position.y = 0.3;
camera.position.x = 0.3;

camera.lookAt(group.position);
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
