/**
 * @desc 3d球面取点
 * @return <object> x,y,z
 * @param radius
 * @param a
 * @param b
 */
function getPos(radius, a, b) {
    var x = radius * Math.sin(a) * Math.cos(b);
    var y = radius * Math.sin(a) * Math.sin(b);
    var z = radius * Math.cos(a);
    return { x, y, z }; // { x: x, y: y, z: z}
}

/**
 * @desc 随机设置点
 * @param <Group> group ...
 * @param <number> radius ...
 */
function setRandomDot(group, radius) {
    var dotGeo = new THREE.SphereGeometry(10, 20, 20);
    var dotMater = new THREE.MeshPhongMaterial({
        color: '#0ff'
    });
    var dotMesh = new THREE.Mesh(dotGeo, dotMater);
    var pos = getPos(radius, Math.PI * 2 * Math.random(), Math.PI * 2 * Math.random());
    dotMesh.position.set(pos.x, pos.y, pos.z);
    group.add(dotMesh);
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

$(function() {
    var width = $('#earth').width();
    var height = $('#earth').height();
    var radius = 600; // 球的半径
    var scene = new THREE.Scene();
    var groupDots = new THREE.Group();
    var groupLines = new THREE.Group();

    // 相机
    var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.x = -1000;
    camera.position.y = 1000;
    camera.position.z = -1000;
    camera.lookAt({ x: 0, y: 0, z: 0 });

    // 地球
    var earthGeo = new THREE.SphereGeometry(radius, 100, 100);
    var earthMater = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('images/earth.jpg'),
        side: THREE.DoubleSide
    });
    var earthMesh = new THREE.Mesh(earthGeo, earthMater);
    scene.add(earthMesh);

    // 光
    var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(light);

    // 小点
    for (let i = 0; i < 100; i++) {
        setRandomDot(groupDots, radius);
    }
    scene.add(groupDots);

    // 曲线
    var animateDots = [];
    groupDots.children.forEach(elem => {
        var line = addLines(groupDots.children[0].position, elem.position);
        groupLines.add(line.lineMesh);
        animateDots.push(line.curve.getPoints(100));
    });
    scene.add(groupLines);

    // 添加动画
    console.log(animateDots);
    var aGroup = new THREE.Group();
    for (let i = 0; i < animateDots.length; i++) {
        let aGeo = new THREE.SphereGeometry(10, 10, 10);
        let aMater = new THREE.MeshPhongMaterial({ color: 'yellow' });
        let aMesh = new THREE.Mesh(aGeo, aMater);
        aGroup.add(aMesh);
    }

    var vIndex = 0;
    function animateLine() {
        aGroup.children.forEach((elem, index) => {
            let v = animateDots[index][vIndex];
            elem.position.set(v.x, v.y, v.z);
        });
        vIndex++;
        if (vIndex > 100) {
            vIndex = 0;
        }
        requestAnimationFrame(animateLine);
    }
    scene.add(aGroup);
    animateLine();

    // 渲染器
    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true
    });
    $('#earth').html(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // 载入控制器
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    function animate() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
});
