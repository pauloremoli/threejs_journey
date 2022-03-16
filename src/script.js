import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Color } from "three";

const canvas = document.querySelector(".webgl");

//texture
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

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

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

directionalLight.shadow.radius = 10;

// controls the size of the orthograpgic camera
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.bottom = -2;

const directionalLightCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightCamHelper.visible = false;
scene.add(directionalLightCamHelper); 

const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.shadow.camera.fov = 30;
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCamHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCamHelper.visible = false;
scene.add(spotLightCamHelper);

scene.add(directionalLight)

const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 6;
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCamHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCamHelper);
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true;

const sphereShadow = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(1.5, 1.5),
	new THREE.MeshBasicMaterial({color: "black", transparent: true, alphaMap: simpleShadow})
)
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = -0.49;

scene.add(sphereShadow);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    // new THREE.MeshBasicMaterial({map: bakedShadow})
	material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true;
scene.add(sphere, plane)

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);

camera.position.z = 3;
camera.position.y = 0.3;
camera.position.x = 0.3;

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.render(scene, camera);


const clock = new THREE.Clock();
const tick = () => {

	const elapsedTime = clock.getElapsedTime();
	sphere.position.x = Math.cos(elapsedTime) * 1.5;
	sphere.position.z = Math.sin(elapsedTime) * 1.5;
	sphere.position.y = Math.abs(Math.sin(elapsedTime* 3)) ;

	sphereShadow.position.x = sphere.position.x;
	sphereShadow.position.z = sphere.position.z;
	sphereShadow.material.opacity = (1 - sphere.position.y) * 1;
	
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
