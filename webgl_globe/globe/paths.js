
function initPaths(allCoords) {
    const material = new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        opacity: 0.6,
        transparent: true,
        color: CURVE_COLOR
    });
    const curveMesh = new THREE.Mesh();

    allCoords.forEach(coords => {
        const curve = new Curve(coords, material);
        curveMesh.add(curve.mesh);
    });

    rootMesh.add(curveMesh);
}
