import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import {createRibbonVertices, createHedgehogVertices, transformMesh, getCurvePoints} from  './spinor-geometry.js'

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
var points1
var points2
var curveGeometry1
var curveGeometry2

const controller = {
    toggleLegend: function(){
        minirenderer.domElement.hidden = !minirenderer.domElement.hidden
    },

    toggleFade: function(){
        renderer.autoClearColor = !renderer.autoClearColor
    },

    toggleAxes: function(){
        meshes.axis1.visible = !meshes.axis1.visible
        meshes.axis2.visible = !meshes.axis2.visible
        meshes.axis3.visible = !meshes.axis3.visible
    },

    switchAxis: function(){
        params.axis = 1- params.axis
    },

    switchGeometry: function(){
        meshes.ribbon.visible = !meshes.ribbon.visible
        meshes.hedgehog.visible = !meshes.hedgehog.visible
    },

    rebuildGeometry: function(){
        meshes.hedgehog.geometry.dispose()
        var hhVertices = createHedgehogVertices(params.density,params.density,0.1*params.thickness,1)
        var hhGeometry = new THREE.BufferGeometry()
        hhGeometry.setFromPoints(hhVertices)
        hhGeometry.computeVertexNormals()
        meshes.hedgehog.geometry = hhGeometry
        meshes.hedgehog.initialVertices = hhVertices
        meshes.hedgehog.needsUpdate = true
    },

    goToSource: function() 
    { 
        window.location = "https://github.com/ryan-thorngren/ryan-thorngren.github.io/tree/main/spinors";
    }
}

var meshes = {}

function init() {
    //initialize GUI
    gui = new dat.GUI()
    params = gui.addFolder('parameters');
    gui.show()
    params.speed = 2
    gui.add(params,'speed')
    params.axis = 0
    params.wiggle = 4
    gui.add(params,'wiggle')
    params.fade = 1
    gui.add(params,'fade',1,10)
    params.thickness = 1
    gui.add(params,'thickness',1,10,1)
    params.density = 1
    gui.add(params,'density',1,5,1)
    gui.add(controller,'toggleAxes')
    gui.add(controller,'switchAxis')
    gui.add(controller,'switchGeometry')
    gui.add(controller,'toggleLegend')
    gui.add(controller,'rebuildGeometry')
    gui.add(controller,'toggleFade')
    gui.add(controller,'goToSource')
    gui.close()

    //initialize main scene
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 8
    camera.position.y = 4
    renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true})
    renderer.autoClearColor = true
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
    minirenderer.domElement.hidden = true

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

function initRibbonMesh() {
    var ribbonMaterial = new THREE.MeshNormalMaterial()
    var ribbonGeometry = new THREE.BufferGeometry()
    var ribbonVertices = createRibbonVertices(0.01,0.5,0.1)
    ribbonGeometry.setFromPoints(ribbonVertices)
    ribbonGeometry.computeVertexNormals()

    var ribbonMesh = new THREE.Mesh(ribbonGeometry,ribbonMaterial)
    ribbonMesh.initialVertices = ribbonVertices
    meshes.ribbon = ribbonMesh
    scene.add(meshes.ribbon)
}

function initHedgehogMesh(n,m,width,stretch) {
    var hhMaterial = new THREE.MeshNormalMaterial()
    var hhGeometry = new THREE.BufferGeometry()
    var hhVertices = createHedgehogVertices(n,m,width,stretch)
    hhGeometry.setFromPoints(hhVertices)
    hhGeometry.computeVertexNormals()

    var hhMesh = new THREE.Mesh(hhGeometry,hhMaterial)
    hhMesh.initialVertices = hhVertices
    // meshes.hedgehog.dispose()
    meshes.hedgehog = hhMesh
    scene.add(meshes.hedgehog)
}

function initMeshes() {

    initRibbonMesh()
    meshes.ribbon.visible = false

    initHedgehogMesh(params.density,params.density,0.1*params.thickness,1)

    var sphereRadius = 10
    var sphereGeometry = new THREE.SphereBufferGeometry(sphereRadius,20,20)
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





    points1 = getCurvePoints(0,params.wiggle).firstPoints
    points2 = getCurvePoints(0,params.wiggle).nextPoints
    curveGeometry1 = new THREE.BufferGeometry().setFromPoints(points1)
    curveGeometry2 = new THREE.BufferGeometry().setFromPoints(points2)
    
    var curveMaterial = new THREE.LineBasicMaterial({
    color: 0x00ffff
    })
    
    var curve1 = new THREE.Line(curveGeometry1, curveMaterial)
    var curve2 = new THREE.Line(curveGeometry2, curveMaterial)
    meshes.curve1 = curve1
    meshes.curve2 = curve2
    miniscene.add(curve1)
    miniscene.add(curve2)

    var axisGeometry1 = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0,0,-10),
        new THREE.Vector3(0,0,10)
    ])
    var axisGeometry2 = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0,-10,0),
        new THREE.Vector3(0,10,0)
    ])
    var axisGeometry3 = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-10,0,0),
        new THREE.Vector3(10,0,0)
    ])
    var axisMesh1 = new THREE.Line(axisGeometry1,curveMaterial)
    var axisMesh2 = new THREE.Line(axisGeometry2,curveMaterial)
    var axisMesh3 = new THREE.Line(axisGeometry3,curveMaterial)
    meshes.axis1 = axisMesh1
    meshes.axis2 = axisMesh2
    meshes.axis3 = axisMesh3
    scene.add(meshes.axis1)
    scene.add(meshes.axis2)
    scene.add(meshes.axis3)
    meshes.axis1.visible = false
    meshes.axis2.visible = false
    meshes.axis3.visible = false
}


function updateMeshes(dt) {

    

    transformMesh(meshes.hedgehog,t,params.wiggle,params.axis)
    transformMesh(meshes.ribbon,t,params.wiggle,params.axis)

    points1 = getCurvePoints(t,params.wiggle).firstPoints
    points2 = getCurvePoints(t,params.wiggle).nextPoints
    curveGeometry1 = new THREE.BufferGeometry().setFromPoints(points1)
    curveGeometry2 = new THREE.BufferGeometry().setFromPoints(points2)
    
    meshes.curve1.geometry.dispose()
    meshes.curve1.geometry = curveGeometry1
    meshes.curve2.geometry.dispose()
    meshes.curve2.geometry = curveGeometry2
    meshes.curve1.needsUpdate = true
    meshes.curve2.needsUpdate = true
  
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
