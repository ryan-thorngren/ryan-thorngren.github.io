import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';


var gui
var params
var scene
var camera
var renderer
var fadePlane
var miniscene
var minicamera
var minirenderer
var t
var clock

const controller = {
    toggleLegend: function(){
        minirenderer.domElement.hidden = !minirenderer.domElement.hidden
    },

    toggleFade: function(){
        renderer.autoClearColor = !renderer.autoClearColor
    }
}

var meshes = {}

function init() {

    //initialize GUI
    gui = new dat.GUI()
    params = gui.addFolder('parameters');
    gui.show()
    params.speed = 1
    gui.add(params,'speed')
    params.fade = 1
    gui.add(params,'fade',1,10)
    gui.add(controller,'toggleLegend')
    gui.add(controller,'toggleFade')

    //initialize main scene
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true})
    renderer.autoClearColor = false
    fadePlane = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshBasicMaterial( {color:0, transparent: true, opacity: 0.1 } ) );
    fadePlane.lookAt(camera.position)
    scene.add( fadePlane )
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    //initialize mini scene for legends
    miniscene = new THREE.Scene()
    minicamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    minicamera.translateZ(15)
    minicamera.translateY(10)
    minicamera.lookAt(0,0,0)
    minirenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: false})
    minirenderer.setSize(window.innerWidth/4, window.innerHeight/4)
    document.getElementById("insert").appendChild(minirenderer.domElement)


    //initialize clock
    t = 0
    clock = new THREE.Clock();
    clock.getDelta();

    //intialize controls
    const controls = new OrbitControls( camera, renderer.domElement )
    controls.update()
    const minicontrols = new OrbitControls( minicamera, minirenderer.domElement )
    minicontrols.update()

    //what it says on the tin
    initMeshes()

}

function initMeshes() {

    
    var cubeMaterial = new THREE.MeshNormalMaterial()
    var cubeGeometry = new THREE.BoxGeometry(1,1,1)
    var cubeMesh = new THREE.Mesh(cubeGeometry,cubeMaterial)
    meshes.cube = cubeMesh
    scene.add(meshes.cube)
    camera.position.z = 5

    var sphereGeometry = new THREE.SphereBufferGeometry(10,20,20)
    var wireframe = new THREE.WireframeGeometry(sphereGeometry)
    var sphereFrame = new THREE.LineSegments(wireframe)
    sphereFrame.material.depthTest = false
    sphereFrame.material.opacity = 0.25
    sphereFrame.material.transparent = true
    miniscene.add(sphereFrame)
    var sphereMaterial = new THREE.MeshBasicMaterial({color:"rgb(50,3,120)"})
    sphereMaterial.opacity = 0.3
    sphereMaterial.transparent = true
    var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
    miniscene.add(sphere)



    const geometry = new THREE.BoxGeometry( 11.6,11.6,11.6 )
    const cube = new THREE.Mesh( geometry,new THREE.MeshNormalMaterial())
    meshes.miniCube = cube
    miniscene.add( meshes.miniCube )

}


function updateMeshes(dt) {

    meshes.cube.rotation.x += dt
    meshes.cube.rotation.y += dt
    meshes.cube.rotation.z += dt


    meshes.miniCube.rotation.x += dt
    meshes.miniCube.rotation.y += dt
    meshes.miniCube.rotation.z += dt
  
}

function render() {
    requestAnimationFrame(render)
    var dt = clock.getDelta()*params.speed/10;

    renderer.render(scene, camera)
    minirenderer.render(miniscene,minicamera)

    updateMeshes(dt)
    
    t += dt

    fadePlane.lookAt(camera.position)
    fadePlane.position.needsUpdate = true
    fadePlane.material.opacity = 0.1/params.fade


}



init()
render()