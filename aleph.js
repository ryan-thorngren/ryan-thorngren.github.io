//my jam on a really cool CA visualization on the old thealef.net


const canvas = document.getElementById("canvas")

var xmax = window.innerWidth
var ymax = window.innerHeight

var ctx = canvas.getContext('2d')

ctx.canvas.width = xmax
ctx.canvas.height = ymax

var blockSize = 2

var xmax = Math.floor(xmax/blockSize)
var ymax = Math.floor(ymax/blockSize)

var numColors = 5
var rgbColors = genRgbColors()
var colors = rgbColors.map(rgbToHex)

var numRules = Math.pow(numColors,3*numColors-2)
var ruleNumber = Math.floor(Math.random()*numRules)

var seedRadius = 10

// var ruleNumber = Math.floor(Math.random()*1000000000)

// var row = []
// for(x = 0; x < xmax; x++){
//     row.push(0)
// }
var row = []
for(x = 0; x < xmax; x++){
    row.push(0)
}

var y = 0
var direction = 1

render()



function render() {

    //clear next row
    ctx.clearRect(0,y*blockSize,xmax*blockSize,blockSize)
    for(x = 0; x < xmax; x++){
        pixel(x,y,row[x])
    }

    //compute next row
    row = nextRow(row,ruleNumber)

    //draw next row
    if(y < ymax/2+seedRadius && y > ymax/2-seedRadius){
        r = Math.sqrt(seedRadius*seedRadius-Math.pow(y - ymax/2,2))
        for(i = 0; i < 2*r; i++){
            row[Math.floor(xmax/2-r)+i] = 100
        }
    }

    //reverse if at boundary
    if(y == ymax-1){
        direction = -1
        ruleNumber = Math.floor(Math.random()*numRules)
        rgbColors = updateRgbColors()
        colors = rgbColors.map(rgbToHex)
    }
    else if(y == 0){
        direction = 1
        ruleNumber = Math.floor(Math.random()*numRules)
        rgbColors = updateRgbColors()
        colors = rgbColors.map(rgbToHex)
    }

    //iterate and recurse
    y+=direction
    setTimeout(render,8)
}

function nextRow(lastRow,n){
    result = []
    for(j = 0; j < xmax; j++){
        i = (j - 1+xmax)%xmax
        k = (j+1)%xmax
        result.push(rule(lastRow[i]+lastRow[j]+lastRow[k],n))
    }
    return result
}

function rule(a,n){
    // Wolfram "totalistic cellular automaton"
    //two lines of magic
    var bitString = n.toString(numColors)
    if(a >= bitString.length){
        return 0
    }
    else {
        return parseInt(bitString[a])
    }
}

function genRgbColors(){
    var result = []
    for(var i = 0; i < numColors; i++){
        result.push([
            Math.floor(Math.random()*255),
            Math.floor(Math.random()*255),
            Math.floor(Math.random()*255)
        ])
    }
    return result
}

function updateRgbColors(){
    var result = []
    for(var i = 0; i < numColors; i++){
        result.push(
            [
                (rgbColors[i][0] + Math.floor(Math.random()*50-25))%255,
                (rgbColors[i][1] + Math.floor(Math.random()*50-25))%255,
                (rgbColors[i][2] + Math.floor(Math.random()*50-25))%255
            ]
        )
    }
    return result
}

function pixel(x,y,p){
    ctx.fillStyle = colors[p]
    ctx.fillRect(x*blockSize,y*blockSize,blockSize,blockSize)
}


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(c) {
    return "#" + componentToHex(c[0]) + componentToHex(c[1]) + componentToHex(c[2]);
}
