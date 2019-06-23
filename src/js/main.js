//////////////////////
///  SCENE/CAMERA  ///
//////////////////////
var scene;
var camera;
var renderer;

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
var stats;
var eScale = 1;//(1 / 510) * 0.00002;
var tScale = 1000000;
var secInDay = 87600;
var planetObjects = {};
var planets = [];
var dEm = 0;
var t1;
function init() {
    stats = initStats();
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

    generateObjects();
    generateSolarSystem();

    t1 = Date.now() / 1000;

    render();
}

// Scale of the earth, use to get screen coordinates
// Time scale, and days to seconds conversion

function generateSolarSystem() {
    lScale = (1 / 510) * 0.00002;
    // Initialize and keep track of current angle of planets
    planet_data.forEach(function (planet) {
        planets.push({
            "name" : planet.name,
            "theta" : 0,
            "dTheta" : (2 * Math.PI) / (planet.period_days * secInDay),
            "diameter" : planet.diameter * lScale * 1000,
            "distance_KM" : planet.distance_KM * lScale,
            "period" : planet.period * this.tScale,
            "inclination" : planet.inclination * (Math.PI / 180),
            "rotation" : (2 * Math.PI) / (planet.rotation_days * secInDay)
        });
    });

    // Draw planetary trajectories in the scene.  These will be fixed
    var trajectories = {};
    planets.forEach(function (planet) {

        var targetMaterial = new THREE.LineDashedMaterial({
            color: 0xF8F8FF,
            // color: 0xfffff,
            transparent: true,
            opacity: .4,
            dashSize: 5,
            gapSize: 5
        });
        var targetOrbit = new THREE.EllipseCurve(
            0,0,
            planet.distance_KM, planet.distance_KM,
            0, 2.0 * Math.PI,
            false);
        var targetPath = new THREE.CurvePath(targetOrbit.getPoints(1000));
        targetPath.add(targetOrbit);
        var targetGeometry = targetPath.createPointsGeometry(100);
        var targetTrajectory = new THREE.Line(targetGeometry, targetMaterial);
        targetTrajectory.rotation.x = Math.PI / 2;
        targetTrajectory.rotation.x += planet.inclination;
        scene.add( targetTrajectory );
        trajectories[planet.name] = targetTrajectory;
    });

    //Create planets and add to the scene
    planets.forEach(function (planet) {
        if (planet.name === "pluto") {planet.diameter *= 10}
        var planetGeometry = new THREE.SphereGeometry(planet.diameter, 50, 50);
        var planetMaterial = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture("../../textures/" + planet.name + "_texture.jpg"),
            color: 0xf2f2f2,
            specular: 0xbbbbbb,
            shininess: 2
        });

        var planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.x = planet.distance_KM;
        scene.add( planetMesh );

        if (planet.name === "earth") {
            // Step 3: Adding Moon
            var moonGeometry = new THREE.SphereGeometry(planet.diameter*0.9, 50,50);
            var moonMaterial = new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load("../../images/moon_texture.jpg")
            });
            moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.position.x = planet.distance_KM*1.2;
            dEm = 0.2 * planet.distance_KM;
            scene.add(moon);
        }

        if (planet.name === "saturn") {
            // Step 3: Add rings for the Moon
            rings =[];
            for (var i = 0; i < 10; i++) {
                var randStart = Math.random() * planet.diameter + planet.diameter;
                var ringGeo = new THREE.RingGeometry(randStart, randStart + .1, 100, 20, 0, 2 * Math.PI);
                var ringMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffeecc,
                    side: THREE.DoubleSide
                });
                var ring = new THREE.Mesh(ringGeo, ringMaterial);
                ring.rotation.x -= (Math.PI/2);
                ring.position.x = planet.distance_KM;
                scene.add(ring);
                rings.push(ring);
            }
        }

        planetObjects[planet.name] = planetMesh;
    });
}

function renderSolar() {
    // get current time and time differnce
    var t2 = Date.now() / 1000;
    var dT = (t2 - t1) * tScale;
    t1 = t2;

    planets.forEach(function (planet) {
        planetObjects[planet.name].rotation.y += planet.rotation * 10;
        var dTheta = planet.dTheta * dT;
        planet.theta += dTheta;
        var phi = planet.inclination * Math.sin(planet.theta);

        //Determine x,y, and z coordinates of planets based off theta + phi
        planetObjects[planet.name].position.z = planet.distance_KM * Math.sin(planet.theta)
            * eScale;
        planetObjects[planet.name].position.x = planet.distance_KM * Math.cos(planet.theta)
            * eScale;
        planetObjects[planet.name].position.y = - planet.distance_KM * Math.cos((Math.PI / 2) - phi)  * eScale;

        if (planet.name === "earth") {
            theta += 2 * Math.PI / 400;
            moon.position.x = planetObjects[planet.name].position.x + dEm * Math.cos(theta);
            moon.position.z = planetObjects[planet.name].position.z + dEm * Math.sin(theta);
            moon.position.y = planetObjects[planet.name].position.y - dEm * Math.cos(theta);
        }
        if (planet.name === "saturn") {
            rings.forEach((ring)=>{
                ring.position.copy(planetObjects[planet.name].position)
            });
        }
    });
}


// Mesh objects
var earth, clouds, starField, groupDots, moon, rings, sun;

function generateObjects() {
    // Step 1: Adding Sun
    var sunGeometry = new THREE.SphereGeometry(1, 50, 50);
    var sunMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("../../textures/sun_texture.jpg"),
        // color: 0xf2e8b7,
        // emissive: 0x91917b,
        // specular: 0x777d4a,
        shininess: 62,
        envMaps: "refraction"
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Step 1: Adding Cloud Geometry and Material for the Earth
    var cloudGeometry = new THREE.SphereGeometry(1.03,  50, 50);
    var cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("../../images/clouds_2.jpg"),
        transparent: true,
        opacity: 0.1
    });
    clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    // Step 2: Star field and Stars
    var starGeometry = new THREE.SphereGeometry(1000, 50, 50);
    var starMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("../images/galaxy_starfield.png"),
        side: THREE.DoubleSide,
        shininess: 0
    });
    starField = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starField);

    // Step 2: Adding stars for star field
    groupDots = new THREE.Group();
    for (let i = 0; i < 500; i++) {
        setRandomStar(groupDots, 1000);
    }
    scene.add(groupDots);
}

//Render loop
function render() {
    stats.update();

    renderSolar();

    // self-rotation for earth and clouds
    sun.rotation.y += .0009;
    // clouds.rotation.y += .00005;

    // Flyby
    if (camera.position.z < 0) {
        dx *= -1;
    }
    camera.position.x += dx;
    camera.position.y += dy;
    camera.position.z += dz;
    camera.lookAt(earthVec);
    // Flyby reset
    if (camera.position.z < -100) {
        camera.position.set(0,35,70);
    }

    // Star render
    groupDots.children.forEach((star)=>{
        star.rotation.x += 0.00001;
        star.rotation.y += 0.00001;
        star.rotation.z += 0.00001;

        lightness > 500 ? lightness = 0 : lightness++;
        star.material.color = new THREE.Color("hsl(200, 40%, " + lightness + "%)");
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, false);

init();