const canvas = document.getElementById("canvas")

xmax = window.innerWidth
ymax = window.innerHeight

ctx = canvas.getContext('2d')

ctx.canvas.width = xmax
ctx.canvas.height = ymax

var blockSize = 2

xmax = Math.floor(xmax/blockSize)
ymax = Math.floor(ymax/blockSize)

seedRadius = 10


ruleNumber = Math.floor(Math.random()*255)

row = []
for(x = 0; x < xmax; x++){
    row.push(0)
}

y = 0
direction = 1
render()


function render() {
    ctx.font = '48px serif'
    ctx.clearRect(0,0,80,50)
    ctx.fillText(ruleNumber,0,40)

    ctx.clearRect(0,y*blockSize,xmax*blockSize,blockSize)
    for(x = 0; x < xmax; x++){
        if(row[x] == 1){
            pixel(x,y,0,0,0)
        }
    }
    row = nextRow(row,ruleNumber)
    if(y < ymax/2+seedRadius && y > ymax/2-seedRadius){
        r = Math.sqrt(seedRadius*seedRadius-Math.pow(y - ymax/2,2))
        for(i = 0; i < 2*r; i++){
            row[Math.floor(xmax/2-r)+i] = 1
        }
    }
    if(y == ymax-1){
        direction = -1
        ruleNumber = Math.floor(Math.random()*255)
    }
    else if(y == 0){
        direction = 1
        ruleNumber = Math.floor(Math.random()*255)
    }
    y+=direction
    setTimeout(render,2)
}

function nextRow(lastRow,n){
    result = []
    for(j = 0; j < xmax; j++){
        i = (j - 1+xmax)%xmax
        k = (j+1)%xmax
        result.push(rule(lastRow[i],lastRow[j],lastRow[k],n))
    }
    return result
}

function rule(a,b,c,n){
    // Wolfram encoding,n from 0 to 255
    var bitString = n.toString(2)
    var index = parseInt(String(a)+String(b)+String(c),2)
    if(index >= bitString.length){
        return 0
    }
    else {
        return parseInt(bitString[index])
    }
}

function pixel(x,y,r,g,b){
    ctx.fillStyle = rgbToHex(r,g,b)
    ctx.fillRect(x*blockSize,y*blockSize,blockSize,blockSize)
}

function componentToHex(c) {
var hex = c.toString(16);
return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

