function initStats() {

    var stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("Stats-output").appendChild(stats.domElement);

    return stats;
}

// 添加线条
function addLines(v0, v3) {
    // 夹角
    var angle = (v0.angleTo(v3) * 180) / Math.PI / 10; // 0 ~ Math.PI
    var aLen = angle * 50,
        hLen = angle * angle * 120;
    var p0 = new THREE.Vector3(0, 0, 0);

    // 开始，结束点
    // var v0 = groupDots.children[0].position;
    // var v3 = groupDots.children[1].position;

    // 法线向量
    var rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone()));

    // 顶点坐标
    var vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0));

    // 控制点坐标
    var v1 = getLenVcetor(v0.clone(), vtop, aLen);
    var v2 = getLenVcetor(v3.clone(), vtop, aLen);

    // 绘制贝塞尔曲线
    var curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
    var geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(50);
    var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // Create the final object to add to the scene
    return {
        curve: curve,
        lineMesh: new THREE.Line(geometry, material)
    };
}

// 计算v1,v2 的中点
function getVCenter(v1, v2) {
    let v = v1.add(v2);
    return v.divideScalar(2);
}

// 计算V1，V2向量固定长度的点
function getLenVcetor(v1, v2, len) {
    let v1v2Len = v1.distanceTo(v2);
    return v1.lerp(v2, len / v1v2Len);
}

function getPos(radius, a, b) {
    var x = radius * Math.sin(a) * Math.cos(b);
    var y = radius * Math.sin(a) * Math.sin(b);
    var z = radius * Math.cos(a);
    return { x, y, z }; // { x: x, y: y, z: z}
}

var starTexture = new THREE.TextureLoader().load( "../../images/star.png" );
var starSize = 20;
function setRandomStar(group, radius) {
    // var dotGeo = new THREE.SphereGeometry(radius/60, 10, 10);
    // var dotMater = new THREE.MeshPhongMaterial({
    //     color: '#0ff'
    // });
    var geometry = new THREE.PlaneGeometry( starSize, starSize );
    var material = new THREE.MeshLambertMaterial({
        map: starTexture,
        transparent: true,
        side: THREE.DoubleSide
    } );

    var dotMesh = new THREE.Mesh(geometry, material);
    var pos = getPos(radius-starSize, Math.PI * 2 * Math.random(), Math.PI * 2 * Math.random());
    dotMesh.position.set(pos.x, pos.y, pos.z);
    group.add(dotMesh);
}
