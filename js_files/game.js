var canvas;
var gl;

// current viewpoint
var view = 1;

var colorLoc;
var mvLoc;
var pLoc;
var proj;
var vPosition;





// rows
var roadSpeeds = [null, -0.2, 0.4, -0.3, 0.1, -0.9,-0.2, 0.4, -0.3, 0.1, -0.9,-0.2, 0.4, -0.3, 0.1, -0.9];
// var roadSpeeds = [null, -0.2, 0.4, -0.3, 0.1, -0.9,-0.2, 0.1, -0.1, 0.1, -0.1,-0.1, 0.1, -0.1, 0.1, -0.9];

// the 36 vertices of the cube
var cubeBuffer;
var numCubeVertices  = 36;
var cubeVertices = [
    // front side:
    vec3( -0.5,  0.5,  0.5 ), vec3( -0.5, -0.5,  0.5 ), vec3(  0.5, -0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ), vec3(  0.5,  0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ),
    // right side:
    vec3(  0.5,  0.5,  0.5 ), vec3(  0.5, -0.5,  0.5 ), vec3(  0.5, -0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ), vec3(  0.5,  0.5,  0.5 ),
    // bottom side:
    vec3(  0.5, -0.5,  0.5 ), vec3( -0.5, -0.5,  0.5 ), vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5, -0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3(  0.5, -0.5,  0.5 ),
    // top side:
    vec3(  0.5,  0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3( -0.5,  0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ), vec3(  0.5,  0.5,  0.5 ), vec3(  0.5,  0.5, -0.5 ),
    // back side:
    vec3( -0.5, -0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ),
    // left side:
    vec3( -0.5,  0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ), vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ), vec3( -0.5,  0.5, -0.5 )
];

// Frog stuff
var PR;
var plyDataFrog;
var frogVertices = [];
var frogBuffer;

// Car stuff
var plyDataCar;
var carVertices = [];
var carBuffer;

//ROAD STUFF
var terrainBuffer;
var numTerrainVertices = 6;
var terrainVertices = [
  vec3(-0.5,-0.5,0), vec3(-0.5,0.5,0), vec3(0.5,0.5,0),
  vec3(0.5,0.5,0), vec3(0.5,-0.5,0), vec3(-0.5,-0.5,0)
];

//RIVER STUFF
// var riverBuffer;
// var numRiverVertices = 6;
// var riverVertices = [
//   vec3(0*10,11*10,0), vec3(0*10,7*10,0), vec3(12*10,7*10,0),
//   vec3(12*10,7*10,0), vec3(12*10,11*10,0), vec3(0*10,11*10,0)
// ];

// // vertices for roof
// var rVertices = [
//
//     // bottom side:
//     vec3(  0.5,  0.5, 0.5 ), vec3( 0.5,  -0.5, 0.5 ), vec3( -0.5,  -0.5,  0.5 ),
//     vec3( -0.5,  -0.5,  0.5 ), vec3(  -0.5,  0.5,  0.5 ), vec3(  0.5,  0.5, 0.5 ),
//     //side
//     vec3(  0.5,  0.5, 0.5 ), vec3( 0.5,  -0.5, 0.5 ), vec3( 0.0,  0.0,  1.0 ),
//     //side
//     vec3(  0.5,  -0.5, 0.5 ), vec3( -0.5,  -0.5, 0.5 ), vec3( 0.0,  0.0,  1.0 ),
//     //side
//     vec3(  -0.5,  -0.5, 0.5 ), vec3( -0.5,  0.5, 0.5 ), vec3( 0.0,  0.0,  1.0 ),
//     //side
//     vec3(  -0.5,  0.5, 0.5 ), vec3( 0.5,  0.5, 0.5 ), vec3( 0.0,  0.0,  1.0 )
//
// ];
var yLookAt = -60.0+Frog.row*gridCellWidth+gridCellWidth/2;
var zLookAt = 40;
var victory = false;
var isDead = false;
var randomNumbers1 = [];
var randomNumbers2 = [];


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.7, 0.6, 0.7, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    PR = PlyReader()
    plyDataFrog = PR.read("frog2.ply");
    frogVertices = plyDataFrog.points;

    plyDataCar = PR.read("L200-OBJ.ply");
    carVertices = plyDataCar.points;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    Grid.init();
    initCar();
    initLog();
    generateRandomNumbers();

    // VBO for the cube
    cubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW );

    // VBO for frogger
    frogBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, frogBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(frogVertices), gl.STATIC_DRAW );
    // gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW );

    // VBO for car
    carBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, carBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(carVertices), gl.STATIC_DRAW );

    // VBO for the road
    terrainBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, terrainBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(terrainVertices), gl.STATIC_DRAW);

    // // VBO for the river
    // riverBuffer = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, riverBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(riverVertices), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );

    mvLoc = gl.getUniformLocation( program, "modelview" );

    // set projection
    pLoc = gl.getUniformLocation( program, "projection" );
    proj = perspective( 50.0, 1.0, 1.0, 500.0 );
    gl.uniformMatrix4fv(pLoc, false, flatten(proj));

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){

        switch( e.keyCode ) {
            case 37:	// left arrow
              if((Frog.xPos-Frog.speed) < col0*gridCellWidth+gridCellWidth/2 ) {
                return;
              }
              if(!victory && !isDead) {
                Frog.xPos -= Frog.speed;
                Frog.col--;
              }
                break;
            case 39:	// right arrow
              if((Frog.xPos+Frog.speed) > col11*gridCellWidth+gridCellWidth/2 ) {
                return;
              }
              if(!victory && !isDead) {
                Frog.xPos += Frog.speed;
                Frog.col++;
              }
              break;
            case 38: // up arrow
              if((Frog.row*gridCellWidth+Frog.speed) > col11*gridCellWidth+gridCellWidth/2 ) {
                return;
              }
              else if(Frog.onRiver) {
                  Frog.fixXLoc();
              }
              if(!victory && !isDead) {
                Frog.row++;
              }
              break;
            case 40: //down arrow
              if((Frog.row*gridCellWidth-Frog.speed) < col0*gridCellWidth ) {
                return;
              }
              else if(Frog.onRiver) {
                  Frog.fixXLoc();
              }
              if(!victory && !isDead) {
                Frog.row--;
              }
              break;
            case 82: //r key
                restart();
        }
        // gl.bindBuffer( gl.ARRAY_BUFFER, frogBuffer);
        // gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(frogVertices));
        gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(cubeVertices));
    });

    render();
}


function generateRandomNumbers() {

  for (var i = 0; i < 14*14; i++) {
      randomNumbers1[i] = getRandom(-30,170);
      randomNumbers2[i] = getRandom(-30,170);
  }
}


// draw a house in location (x, y) of size size
function house( x, y, z, size, mv ) {

    var mvRoof = mv;

    // var coordX = Math.floor((x)/gridCellWidth);
    // var coordY = Math.floor((y)/gridCellWidth);
    // if(Grid[coordX][coordY] ) {
    //   gl.uniform4fv( colorLoc, RED );
    // } else {
      gl.uniform4fv( colorLoc, WHITE );
    // }

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    mv = mult( mv, translate( x, y, z ) );
    mv = mult( mv, scalem( 1.5*size, size, size ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

}

function drawScenery( mv ) {


    // draw houses
    // house(0.0, 0.0, 2.0, mv);
    //
    // house(0.0, 0.0, 2.0, mv);
    // house(0.0, 0.0, 2.0, mv);
    //
    // for (var i = 0; i < 12; i++) {
    //   for (var j = 0; j < 12; j++) {
    //     house(i*10+gridCellWidth/2,j*10+gridCellWidth/2,1,mv);
    //   }
    // }

}

function drawRoad(mv) {
  // set color to blue
  gl.uniform4fv( colorLoc, GRAY );

  gl.bindBuffer( gl.ARRAY_BUFFER, terrainBuffer );
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

  mv = mult( mv, translate( 6*gridCellWidth, 4*gridCellWidth-gridCellWidth/2, 0.5 ) );
  mv = mult( mv, scalem( 20*gridCellWidth, 50, 1.0 ) );

  gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
  gl.drawArrays( gl.TRIANGLES, 0, numTerrainVertices );
}

function drawRiver(mv) {
  // set color to blue
  gl.uniform4fv( colorLoc, BLUE );

  gl.bindBuffer( gl.ARRAY_BUFFER, terrainBuffer );
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

  mv = mult( mv, translate( 6*gridCellWidth, 9*gridCellWidth, 0.5 ) );
  mv = mult( mv, scalem( 27*gridCellWidth, 40, 1.0 ) );

  gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
  gl.drawArrays( gl.TRIANGLES, 0, numTerrainVertices );
}

function drawFields(mv, x, y, z, scaleX, scaleY, scaleZ) {
  gl.uniform4fv( colorLoc, GREENGROUND );

  gl.bindBuffer( gl.ARRAY_BUFFER, terrainBuffer );
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

  mv = mult( mv, translate( x, y , z ) );
  mv = mult( mv, scalem( scaleX, scaleY, scaleZ ) );

  gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
  gl.drawArrays( gl.TRIANGLES, 0, numTerrainVertices );
}

function drawSky(mv, x, y, z, scaleX, scaleY, scaleZ) {
  var mvCloud = mv;
  gl.uniform4fv( colorLoc, BLUELIGHT );

  gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

  mv = mult( mv, translate( x, y , z ) );
  mv = mult( mv, scalem( scaleX, scaleY, scaleZ ) );

  gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
  gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

  for (var i = 0; i < 14*14; i++) {
      house(randomNumbers1[i] , 120, randomNumbers2[i],4-Frog.row/14, mvCloud);
    }
}

function drawRoadRow(mv, row) {

    Grid.reset(row);
    updateCarLocation( row, roadSpeeds[row]);
    drawCar( mv, cars[row][0], row );
    drawCar( mv, cars[row][1], row );
    drawCar( mv, cars[row][2], row );

}

function drawLogRow(mv, row) {

    Grid.reset(row);
    updateLogLocation( row, roadSpeeds[row]);
    drawLog( mv, logs[row][0], row );
    drawLog( mv, logs[row][1], row );
    drawLog( mv, logs[row][2], row );
    drawLog( mv, logs[row][3], row );
}

function drawHouses(mv) {
  // house(160, 150, 20, mv);
  // house(-10, 170, 15, mv);
  // house(70, 280, 15, mv);
  // house(110, 200, 15, mv);
  // house(130, 230, 15, mv);
  // house(20, 260, 15, mv);
  // house(-50, 230, 15, mv);
  // house(90, 240, 15, mv);
  // house(-10, 260, 15, mv);
  // house(50, 220, 15, mv);
  // house(70, 210, 15, mv);
}

function restart() {
  Frog.xPos = gridCellWidth*col6+gridCellWidth/2;
  Frog.row = 0;
  Frog.col = 6;
  Frog.onRiver = false;
  victory = false;
  isDead = false;
  document.getElementById("victory-message").innerHTML = ""
  document.getElementById("restart-message").innerHTML = ""
}



function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    var mv = mat4();
    var xLookAt = Frog.xPos;
    if(xLookAt>85) xLookAt = 85;
    else if(xLookAt<35) xLookAt = 35;
    if(victory || isDead) {
      if(zLookAt>4) zLookAt -= 0.5;
      if(yLookAt>0) yLookAt -= 1.3;
      if(yLookAt<-1.3) yLookAt += 1.3;
    }
    else {
      yLookAt = -60.0+Frog.row*gridCellWidth+gridCellWidth/2;
      zLookAt =40;
    }
    mv = lookAt( vec3(xLookAt, yLookAt, zLookAt), vec3(xLookAt, yLookAt+150, zLookAt-40), vec3(0.0, 0.0, 1.0) );
    drawScenery( mv );
    drawRoad(mv);
    drawRiver(mv);
    //fields
    drawFields(mv, 6*gridCellWidth, 7 , 0.4, 25*gridCellWidth, 2*gridCellWidth, 1.0);
    drawFields(mv, 6*gridCellWidth, row6*10+gridCellWidth/2 , 0.4, 20*gridCellWidth, 15+gridCellWidth/2, 1.0);
    drawFields(mv, 6*gridCellWidth, row11*10+gridCellWidth/2 , 0.4, 27*gridCellWidth, 10, 1.0);
    //sky
    drawSky(mv, 60 , 120, 1, 270, 1, 150);
    // drawHouses(mv);


    for (var i = 1; i <= 5 ; i++) {
      drawRoadRow(mv, i);
    }
    for (var j = 7; j <= 10 ; j++) {
      drawLogRow(mv, j);
    }

    if(victory) {
      document.getElementById("victory-message").innerHTML = "Congratulations! You won!"
      document.getElementById("restart-message").innerHTML = "Hit 'R' to play again"
    } else if(isDead) {
      document.getElementById("victory-message").innerHTML = "Woops! You lost!"
      document.getElementById("restart-message").innerHTML = "Hit 'R' to play again"
    }

    Frog.update();
    Frog.checkCollision();
    Frog.draw(mv);



    requestAnimFrame( render );
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
