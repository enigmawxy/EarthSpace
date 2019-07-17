
const COLOR_SPHERE_NIGHT = 0xa58945;

function initSphere() {
    const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 40, 30);
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({
        map: loader.load('./images/45naBE9.jpg'),
        color: COLOR_SPHERE_NIGHT
    });
    const mesh = new THREE.Mesh(geometry, material);

    rootMesh.add(mesh);
}
