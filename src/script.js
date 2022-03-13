import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
group.add(cube1);

cube1.position.x = 0.7;
cube1.position.y = -0.6;
cube1.position.z = -3;

// force the order to apply the rotation
cube1.rotation.reorder("YXZ");

cube1.rotation.x = 0.2;
cube1.rotation.y = 1;
cube1.rotation.z = -1;

scene.add(cube1);

const axisHelper = new THREE.AxisHelper();
scene.add(axisHelper);

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.y = 0.3;
camera.position.x = 0.3;

camera.lookAt(group.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

gsap.to(cube1.rotation, { duration: 1, delay: 1, x: 2 });
gsap.to(cube1.rotation, { duration: 1, delay: 2, x: 0 });

const clock = new THREE.Clock();

const tick = () => {
	camera.lookAt(cube1.position);
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
