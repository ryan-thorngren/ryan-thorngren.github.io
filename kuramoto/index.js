import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';


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
var meshes = {}
var numSprites = 1000

const controller = {
    toggleLegend: function(){
        minirenderer.domElement.hidden = !minirenderer.domElement.hidden
    },

    toggleFade: function(){
        renderer.autoClearColor = !renderer.autoClearColor
    },

    randomizePositions: function(){
        meshes.sprites.forEach((s) => {
            s.angle = Math.random()*Math.PI*2
            s.updatePosition()
        })
    },

    setPositionsToZero: function(){
        meshes.sprites.forEach((s) => {
            s.angle = 0
            s.updatePosition()
        })
    },

    spiralizePositions: function(){
        for(var i = 0; i < numSprites; i++){
            meshes.sprites[i].angle = (i/numSprites)*Math.PI*6
            meshes.sprites[i].updatePosition()
        }
    }
}


function init() {

    //initialize GUI
    gui = new dat.GUI()
    params = gui.addFolder('parameters');
    gui.show()
    params.speed = 5
    gui.add(params,'speed')
    params.force = 645
    gui.add(params,'force')
    params.fade = 1
    gui.add(params,'fade',1,10)
    gui.add(controller,'randomizePositions')
    gui.add(controller,'setPositionsToZero')
    gui.add(controller,'spiralizePositions')
    gui.add(controller,'toggleLegend')
    gui.add(controller,'toggleFade')

    //initialize main scene
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
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
    // minicamera.translateY(10)
    minicamera.lookAt(0,0,0)
    minirenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true})
    minirenderer.setSize(window.innerWidth/4, window.innerHeight/4)
    minirenderer.autoClearColor = false
    document.getElementById("insert").appendChild(minirenderer.domElement)
    var fadePlane2 = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshBasicMaterial( {color:0, transparent: true, opacity: 0.01 } ) );
    fadePlane2.lookAt(camera.position)
    miniscene.add( fadePlane2 )

    //initialize clock
    t = 0
    clock = new THREE.Clock();
    clock.getDelta();



    //intialize controls
    // const controls = new OrbitControls( camera, renderer.domElement )
    // controls.update()
    // const minicontrols = new OrbitControls( minicamera, minirenderer.domElement )
    // minicontrols.update()

    //what it says on the tin
    initMeshes()

}

function initMeshes() {

    
    const map = new THREE.TextureLoader().load( 'sprite.png' )
    meshes.sprites = []
    for(var i = 0; i < numSprites; i++){
        const material = new THREE.SpriteMaterial( { map: map } )
        const sprite = new THREE.Sprite( material )
        sprite.scale.set(0.1,0.1,0.1)
        sprite.f = i/numSprites
        sprite.material.color = new THREE.Color("hsl(" + Math.floor((i/numSprites)*255) +", 100%, 50%)")
        sprite.angle = 0
        sprite.updatePosition = function () {
            this.position.set((1-this.f)*3*Math.cos(this.angle),(1-this.f)*3*Math.sin(this.angle),0)
        }
        sprite.updatePosition()
        meshes.sprites.push(sprite)
        scene.add(sprite)
    }
    
    const material = new THREE.SpriteMaterial( { map: map } )
    const sprite = new THREE.Sprite( material )
    meshes.orderParam = sprite
    miniscene.add(sprite)

    // var sphereGeometry = new THREE.SphereBufferGeometry(10,20,20)
    // var wireframe = new THREE.WireframeGeometry(sphereGeometry)
    // var sphereFrame = new THREE.LineSegments(wireframe)
    // sphereFrame.material.depthTest = false
    // sphereFrame.material.opacity = 0.25
    // sphereFrame.material.transparent = true
    // miniscene.add(sphereFrame)
    // var sphereMaterial = new THREE.MeshBasicMaterial({color:"rgb(50,3,120)"})
    // sphereMaterial.opacity = 0.3
    // sphereMaterial.transparent = true
    // var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
    // miniscene.add(sphere)

    controller.randomizePositions()



}


function updateMeshes(dt) {

    var interaction = (params.force/1000)/numSprites
    var x = 0
    var y = 0
    meshes.sprites.forEach((s) => {
        var force = 0
        x+=s.position.x
        y+=s.position.y
        meshes.sprites.forEach((s2) => {
            force += interaction*Math.sin(s2.angle-s.angle)
        })
        s.angle = (s.angle + dt*s.f + dt*force)%(2*Math.PI)
        s.updatePosition()
    })
    x/=numSprites
    y/=numSprites

    meshes.orderParam.position.x = x*7
    meshes.orderParam.position.y = y*7

    // meshes.miniCube.rotation.x += dt
    // meshes.miniCube.rotation.y += dt
    // meshes.miniCube.rotation.z += dt
  
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