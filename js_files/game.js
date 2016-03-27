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


  // var PR = PlyReader();
  // var plyData = PR.read("frog1.ply");
  //
  // var frogVertices = plyData.points;

//ROAD STUFF
var roadBuffer;
var numRoadVertices = 6;
var roadVertices = [
  vec3(0*10,6*10,0), vec3(0*10,1*10,0), vec3(12*10,1*10,0),
  vec3(12*10,1*10,0), vec3(12*10,6*10,0), vec3(0*10,6*10,0)
];

//RIVER STUFF
var riverBuffer;
var numRiverVertices = 6;
var riverVertices = [
  vec3(0*10,11*10,0), vec3(0*10,7*10,0), vec3(12*10,7*10,0),
  vec3(12*10,7*10,0), vec3(12*10,11*10,0), vec3(0*10,11*10,0)
];

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

var frogBuffer;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.7, 0.6, 0.7, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    Grid.init();
    initCar();
    initLog();

    // VBO for the cube
    cubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW );

    // VBO for frogger
    frogBuffer = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, frogBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(frogVertices), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW );

    // VBO for the road
    roadBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, roadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(roadVertices), gl.STATIC_DRAW);

    // VBO for the river
    riverBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, riverBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(riverVertices), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );

    mvLoc = gl.getUniformLocation( program, "modelview" );

    // set projection
    pLoc = gl.getUniformLocation( program, "projection" );
    proj = perspective( 50.0, 1.0, 1.0, 500.0 );
    gl.uniformMatrix4fv(pLoc, false, flatten(proj));

    document.getElementById("Viewpoint").innerHTML = "1: Fjarlægt sjónarhorn";
    document.getElementById("Height").innerHTML = "Viðbótarhæð: "+ height;

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){

        switch( e.keyCode ) {
            case 37:	// left arrow
              if((Frog.xPos-Frog.speed) < col0*gridCellWidth+gridCellWidth/2 ) {
                return;
              }
                Frog.xPos -= Frog.speed;
                Frog.col--;
                break;
            case 39:	// right arrow
              if((Frog.xPos+Frog.speed) > col11*gridCellWidth+gridCellWidth/2 ) {
                return;
              }
                Frog.xPos += Frog.speed;
                Frog.col++;
                break;
            case 38: // up arrow
              if((Frog.row*gridCellWidth+Frog.speed) > col11*gridCellWidth+gridCellWidth/2 ) {
                return;
              }
              else if(Frog.onRiver) {
                  Frog.fixXLoc();
              }
                Frog.row++;
                break;
            case 40: //down arrow
              if((Frog.row*gridCellWidth-Frog.speed) < col0*gridCellWidth ) {
                return;
              }
              else if(Frog.onRiver) {
                  Frog.fixXLoc();
              }
                Frog.row--;
                break;
            case 82: //r key
                //restart();
        }
        // gl.bindBuffer( gl.ARRAY_BUFFER, frogBuffer);
        // gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(frogVertices));
        gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(cubeVertices));
    });

    render();
}





// draw a house in location (x, y) of size size
function house( x, y, size, mv ) {

    var mvRoof = mv;

    var coordX = Math.floor((x)/gridCellWidth);
    var coordY = Math.floor((y)/gridCellWidth);
    if(Grid[coordX][coordY] ) {
      gl.uniform4fv( colorLoc, RED );
    } else {
      gl.uniform4fv( colorLoc, BROWN );
    }

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    mv = mult( mv, translate( x, y, size/2 ) );
    mv = mult( mv, scalem( size, size, 10*size ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

}

function drawScenery( mv ) {


    // draw houses
    house(0.0, 0.0, 2.0, mv);

    house(0.0, 0.0, 2.0, mv);
    house(0.0, 0.0, 2.0, mv);

    for (var i = 0; i < 12; i++) {
      for (var j = 0; j < 12; j++) {
        house(i*10+gridCellWidth/2,j*10+gridCellWidth/2,1,mv);
      }
    }

}

function drawRoad(mv) {
  // set color to blue
  gl.uniform4fv( colorLoc, GRAY );

  gl.bindBuffer( gl.ARRAY_BUFFER, roadBuffer );
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
  gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
  gl.drawArrays( gl.TRIANGLES, 0, numRoadVertices );
}
function drawRiver(mv) {
  // set color to blue
  gl.uniform4fv( colorLoc, BLUE );

  gl.bindBuffer( gl.ARRAY_BUFFER, riverBuffer );
  gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
  gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
  gl.drawArrays( gl.TRIANGLES, 0, numRiverVertices );
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

}



function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    var mv = mat4();
    mv = lookAt( vec3(60.0, -100.0+Frog.row*gridCellWidth+gridCellWidth/2, 140.0), vec3(60.0, 150.0, 0.0), vec3(0.0, 0.0, 1.0) );
    drawScenery( mv );
    drawRoad(mv);
    drawRiver(mv);

    for (var i = 1; i <= 5 ; i++) {
      drawRoadRow(mv, i);
    }
    for (var j = 7; j <= 10 ; j++) {
      drawLogRow(mv, j);
    }

    Frog.update();
    Frog.checkCollision();
    Frog.draw(mv);


    requestAnimFrame( render );
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
