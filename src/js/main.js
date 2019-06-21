//////////////////////
///  SCENE/CAMERA  ///
//////////////////////
var scene;
var camera;
var renderer;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth/window.innerHeight, 0.1, 2000 );
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    camera.position.set(0, 30, 70);

    //Orbit Controls
    var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    // LIGHTS
    var light1 = new THREE.AmbientLight( 0x888888 );
    scene.add(light1);
    var light2 = new THREE.DirectionalLight( 0xfdfcf0, 1 );
    light2.position.set(50,50,50);
    scene.add(light2);

    //////////////////////
    /////  OBJECTS  //////
    //////////////////////

    //Earth
    var earthGeometry = new THREE.SphereGeometry(10, 50, 50);
    var earthMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("../images/earth_texture_2.jpg"),
        color: 0xf2f2f2,
        specular: 0xbbbbbb,
        shininess: 2
    });
    var earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Cloud Geomtry and Material
    var cloudGeometry = new THREE.SphereGeometry(10.3,  50, 50);
    var cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("../images/clouds_2.jpg"),
        transparent: true,
        opacity: 0.1
    });

    //Create a cloud mesh and add it to the scene.
    var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    //Starfield
    var starGeometry = new THREE.SphereGeometry(1000, 50, 50);
    var starMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("../images/galaxy_starfield.png"),
        side: THREE.DoubleSide,
        shininess: 0
    });
    var starField = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starField);

    //Moon
    var moonGeometry = new THREE.SphereGeometry(3.5, 50,50);
    var moonMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("../images/moon_texture.jpg")
    });
    var moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(35,0,0);
    scene.add(moon);

    rings =[];
    for (var i = 0; i < 10; i++) {
        var randStart = Math.random() * 3.5 + 4;
        var ringGeo = new THREE.RingGeometry(randStart, randStart + .1, 100, 20, 0, 2 * Math.PI);
        var ringMaterial = new THREE.MeshPhongMaterial({
            color: 0xffeecc,
            side: THREE.DoubleSide
        });
        var ring = new THREE.Mesh(ringGeo, ringMaterial);
        ring.rotation.x -= (Math.PI/2);
        ring.position.set(35, 0, 0);
        scene.add(ring);
        rings.push(ring);
    }

    // Draw Points on sphere
    var groupDots = new THREE.Group();
    // 小点
    for (let i = 0; i < 500; i++) {
        setRandomStar(groupDots, 1000);
    }
    scene.add(groupDots);

    ///////////////////////////
    /// RENDERING/ANIM LOOP ///
    ///////////////////////////

    //Set the moon's orbital radius, start angle, and angle increment value
    var r = 35;
    var theta = 0;
    var dTheta = 2 * Math.PI / 1000;

    //Vector pointing towards the earth
    var earthVec = new THREE.Vector3(0,0,0);

    //Set position increments
    var dx = .01;
    var dy = -.01;
    var dz = -.05;

    var lightness = 0;
    //Render loop
    var render = function() {
        earth.rotation.y += .0009;
        clouds.rotation.y += .00005;

        //Moon orbit
        theta += dTheta;
        moon.position.x = r * Math.cos(theta);
        moon.position.z = r * Math.sin(theta);
        rings.forEach((ring)=>{
            ring.position.x = r * Math.cos(theta);
            ring.position.z = r * Math.sin(theta);
        });
        //Flyby
        if (camera.position.z < 0) {
            dx *= -1;
        }
        camera.position.x += dx;
        camera.position.y += dy;
        camera.position.z += dz;

        camera.lookAt(earthVec);

        //Flyby reset
        if (camera.position.z < -100) {
            camera.position.set(0,35,70);
        }

        groupDots.children.forEach((star)=>{
            star.rotation.x += 0.00001;
            star.rotation.y += 0.00001;
            star.rotation.z += 0.00001;

            lightness > 500 ? lightness = 0 : lightness++;
            star.material.color = new THREE.Color("hsl(200, 40%, " + lightness + "%)");
        });

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    render();
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();

window.addEventListener('resize', onResize, false);



