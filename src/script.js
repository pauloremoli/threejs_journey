import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const textureLoader = new THREE.TextureLoader();
const textureMatcap = textureLoader.load("/matcap.png");
const fontLoader = new FontLoader();

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
	new THREE.MeshBasicMaterial({ color: 0xffff00 })
);

// scene.add(cube);

cube.position.x = 0;
cube.position.y = 0;
cube.position.z = 0;

// force the order to apply the rotation
cube.rotation.reorder("YXZ");

cube.rotation.x = 0.2;
cube.rotation.y = 1;
cube.rotation.z = -1;

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
	const textGeometry = new TextGeometry("Paulo Remoli", {
		font,
		size: 0.5,
		height: 0.2,
		bevelEnabled: true,
		bevelSize: 0.02,
		bevelThickness: 0.1,
		bevelOffset: 0,
		bevelSegments: 5,
		curveSegments: 2,
	});
	const textMaterial = new THREE.MeshNormalMaterial();
	const matecapMaterial = new THREE.MeshMatcapMaterial({
		matcap: textureMatcap,
	});
	const text = new THREE.Mesh(textGeometry, textMaterial);
	textGeometry.center();

	const geometryDonut = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
	for (let index = 0; index < 100; index++) {
		const donut = new THREE.Mesh(geometryDonut, matecapMaterial);

		donut.position.x = (Math.random() - 0.5) * 20;
		donut.position.y = (Math.random() - 0.5) * 20;
		donut.position.z = (Math.random() - 0.5) * 20;

		donut.rotation.x = Math.random() * Math.PI;
		donut.rotation.y = Math.random() * Math.PI;

		scene.add(donut);
	}

	scene.add(text);
});

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);

camera.position.z = 3;
camera.position.y = 0.3;
camera.position.x = 0.3;

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
