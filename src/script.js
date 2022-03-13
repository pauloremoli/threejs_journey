import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const canvas = document.querySelector(".webgl");

// Cursor
const cursor = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
group.add(cube1);

cube1.position.x = 0;
cube1.position.y = 0;
cube1.position.z = 0;

// force the order to apply the rotation
cube1.rotation.reorder("YXZ");

cube1.rotation.x = 0.2;
cube1.rotation.y = 1;
cube1.rotation.z = -1;

const cube2 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: "red" })
);

cube2.position.z = -3;
cube2.position.x = -1;

// group.add(cube2);

const axisHelper = new THREE.AxesHelper();
scene.add(axisHelper);

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(
	45,
	sizes.width / sizes.height,
	0.1,
	100
);

// OrthographicCamera
// const camera = new THREE.OrthographicCamera(
// 	-2 * aspectRatio,
// 	2 * aspectRatio,
// 	2,
// 	-2,
// 	0.1,
// 	100
// );

camera.position.z = 3;
camera.position.y = 0.3;
camera.position.x = 0.3;

camera.lookAt(group.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();
let elapsedTime = clock.getElapsedTime();
const tick = () => {
	const delta = clock.getElapsedTime() - elapsedTime;
	elapsedTime = clock.getElapsedTime();
	// cube1.rotation.y += 1 * delta;
	// cube2.rotation.x += 1 * delta;

	// update camere position based on mouse position
	// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
	// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;

	camera.lookAt(cube1.position);
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
