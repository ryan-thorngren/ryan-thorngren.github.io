import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';







function createRibbonVertices(length,width,stretch) {
    var numSegments = 1000
    var vertices = []
    for(var i = -numSegments; i < numSegments; i++){
        vertices.push(new THREE.Vector3(i*length,-width*stretch,-width))
        vertices.push(new THREE.Vector3(i*length,width*stretch,-width))
        vertices.push(new THREE.Vector3((i+1)*length,width*stretch,-width))

        vertices.push(new THREE.Vector3(i*length,-width*stretch,-width))
        vertices.push(new THREE.Vector3((i+1)*length,width*stretch,-width))
        vertices.push(new THREE.Vector3((i+1)*length,-width*stretch,-width))

        vertices.push(new THREE.Vector3(i*length,width*stretch,-width))
        vertices.push(new THREE.Vector3(i*length,width*stretch,width))
        vertices.push(new THREE.Vector3((i+1)*length,width*stretch,width))

        vertices.push(new THREE.Vector3(length*i,width*stretch,-width))
        vertices.push(new THREE.Vector3(length*(i+1),width*stretch,width))
        vertices.push(new THREE.Vector3(length*(i+1),width*stretch,-width))

        vertices.push(new THREE.Vector3(length*i,width*stretch,width))
        vertices.push(new THREE.Vector3(length*i,-width*stretch,width))
        vertices.push(new THREE.Vector3(length*(i+1),-width*stretch,width))

        vertices.push(new THREE.Vector3(length*i,width*stretch,width))
        vertices.push(new THREE.Vector3(length*(i+1),-width*stretch,width))
        vertices.push(new THREE.Vector3(length*(i+1),width*stretch,width))

        vertices.push(new THREE.Vector3(length*i,-width*stretch,width))
        vertices.push(new THREE.Vector3(length*i,-width*stretch,-width))
        vertices.push(new THREE.Vector3(length*(i+1),-width*stretch,-width))

        vertices.push(new THREE.Vector3(length*i,-width*stretch,width))
        vertices.push(new THREE.Vector3(length*(i+1),-width*stretch,-width))
        vertices.push(new THREE.Vector3(length*(i+1),-width*stretch,width))
    }


    return vertices

}

function createHedgehogVertices(n,m){
    var sphere = new THREE.SphereBufferGeometry(1,n,m)
    var sphereVertices = sphere.attributes.position.array
    var numCoords = sphereVertices.length
    var numSegments = 100
    var length = 0.1
    var width = 0.1
    var stretch = 1
    var vertices = []
    for(var i = -numSegments; i < numSegments; i++){
        vertices.push(new THREE.Vector3(i*length,-width*stretch,-width))
        vertices.push(new THREE.Vector3(i*length,width*stretch,-width))
        vertices.push(new THREE.Vector3((i+1)*length,width*stretch,-width))

        vertices.push(new THREE.Vector3(i*length,-width*stretch,-width))
        vertices.push(new THREE.Vector3((i+1)*length,width*stretch,-width))
        vertices.push(new THREE.Vector3((i+1)*length,-width*stretch,-width))

        vertices.push(new THREE.Vector3(i*length,width*stretch,-width))
        vertices.push(new THREE.Vector3(i*length,width*stretch,width))
        vertices.push(new THREE.Vector3((i+1)*length,width*stretch,width))

        vertices.push(new THREE.Vector3(length*i,width*stretch,-width))
        vertices.push(new THREE.Vector3(length*(i+1),width*stretch,width))
        vertices.push(new THREE.Vector3(length*(i+1),width*stretch,-width))

        vertices.push(new THREE.Vector3(length*i,width*stretch,width))
        vertices.push(new THREE.Vector3(length*i,-width*stretch,width))
        vertices.push(new THREE.Vector3(length*(i+1),-width*stretch,width))

        vertices.push(new THREE.Vector3(length*i,width*stretch,width))
        vertices.push(new THREE.Vector3(length*(i+1),-width*stretch,width))
        vertices.push(new THREE.Vector3(length*(i+1),width*stretch,width))

        vertices.push(new THREE.Vector3(length*i,-width*stretch,width))
        vertices.push(new THREE.Vector3(length*i,-width*stretch,-width))
        vertices.push(new THREE.Vector3(length*(i+1),-width*stretch,-width))

        vertices.push(new THREE.Vector3(length*i,-width*stretch,width))
        vertices.push(new THREE.Vector3(length*(i+1),-width*stretch,-width))
        vertices.push(new THREE.Vector3(length*(i+1),-width*stretch,width))
    }
    var newVertices = []
    var q = new THREE.Quaternion()


    var axis = new THREE.Vector3(1,0,0)
    for(var i = 0; i < numCoords; i+=3){

        axis.x = sphereVertices[i]
        axis.y = sphereVertices[i+1]
        axis.z = sphereVertices[i+2]
        axis.normalize()
        q.setFromUnitVectors(new THREE.Vector3(1,0,0),axis)

        vertices.forEach((v) => {
            var newVertex = v.clone()
            
            newVertex.applyQuaternion(q)
            newVertices.push(newVertex)
        })
    }

    newVertices.forEach((v) => {
        vertices.push(v)
    })


    return vertices

}

function transformMesh(mesh,t,wiggle) {

    
    var length = mesh.geometry.attributes.position.array.length
    for(var i = 0; i < length/3; i++){
        //amusing glitch:
        // var vect = new THREE.Vector3( 
        //     mesh.geometry.attributes.position.array[3*i],
        //     mesh.geometry.attributes.position.array[3*i+1],
        //     mesh.geometry.attributes.position.array[3*i+2])
        var vect = new THREE.Vector3(
            mesh.initialVertices[i].x,
            mesh.initialVertices[i].y,
            mesh.initialVertices[i].z)
        var r = vect.length()
        vect = vect.applyQuaternion(rotation(r,t,wiggle))
        
        mesh.geometry.attributes.position.array[3*i] = vect.x
        mesh.geometry.attributes.position.array[3*i+1] = vect.y
        mesh.geometry.attributes.position.array[3*i+2] = vect.z
    }
    mesh.geometry.attributes.position.needsUpdate = true;

}

function rotation(r,t,wiggle) {
    var inner = 0.5
    var s = 1
    if (r > inner){
        var s = Math.exp(-Math.pow(r-inner,2)/12)
    }
    return new THREE.Quaternion(1-s + s*Math.sin(t),s*Math.cos(t),wiggle*s*(1-s),0).normalize()
}


function getCurvePoints(t,wiggle) {
    var points1 = []
    var points2 = []
    var twoPieces = false
    var numPoints = 1000
    for(var i = 0; i < numPoints; i++){
        var rot = rotation(10*i/numPoints,t,wiggle)
        var angle = 2*Math.acos(rot.x)/Math.PI
        if(angle < 1){
            var point = new THREE.Vector3(rot.y,rot.z,rot.w).normalize()
            points1.push(point.multiplyScalar(angle*10))
        }
        else {
            angle = angle - 2
            var point = new THREE.Vector3(rot.y,rot.z,rot.w).normalize()
            points2.push(point.multiplyScalar(angle*10))
            twoPieces = true
        }
    }
    return {firstPoints:points1,nextPoints:points2,twoPieces:twoPieces}
}

// defaultExport = {createRibbonVertices, createHedgehogVertices, transformMesh, getCurvePoints}

export {createRibbonVertices, createHedgehogVertices, transformMesh, getCurvePoints}