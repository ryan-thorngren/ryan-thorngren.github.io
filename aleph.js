const canvas = document.getElementById("canvas")

xmax = window.innerWidth
ymax = window.innerHeight



canvas.width = xmax
canvas.height = ymax

var blockSize = 5

xmax = Math.floor(xmax/blockSize)
ymax = Math.floor(ymax/blockSize)


ctx = canvas.getContext('2d')


ruleNumber = Math.floor(Math.random()*255)

row = []
for(x = 0; x < xmax; x++){
    row.push(0)
}

y = 0
direction = 1
render()


function render() {
    ctx.clearRect(0,y*blockSize,xmax*blockSize,blockSize)
    for(x = 0; x < xmax; x++){
        if(row[x] == 1){
            pixel(x,y,0,0,0)
        }
    }
    row = nextRow(row,ruleNumber)
    if(y < ymax/2+5 && y > ymax/2-5){
        for(i = 0; i < 10; i++){
            row[Math.floor(xmax/2)+i] = 1
        }
    }
    if(y == ymax){
        direction = -1
        ruleNumber = (ruleNumber+1)%256
    }
    else if(y == 0){
        direction = 1
        ruleNumber = (ruleNumber+1)%256
    }
    y+=direction
    setTimeout(render,10)
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

