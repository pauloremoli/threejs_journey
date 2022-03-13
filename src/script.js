import "./style.css";
import * as THREE from "three";
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

const cube2 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: "red" })
);

cube2.position.z = -3;
cube2.position.x = -1;

group.add(cube2);

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
