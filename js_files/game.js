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
var roadSpeeds = [0.3, -0.2, 0.4, -0.3, 0.1];

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

//ROAD STUFF
var roadBuffer;
var numRoadVertices = 6;
var roadVertices = [
  vec3(0*10,5*10,0), vec3(0*10,1*10,0), vec3(12*10,1*10,0),
  vec3(12*10,1*10,0), vec3(12*10,5*10,0), vec3(0*10,5*10,0)
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

    // VBO for the cube
    cubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW );

    // VBO for frogger
    frogBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, frogBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW );

    // VBO for the road
    roadBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, roadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(roadVertices), gl.STATIC_DRAW);

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
                Frog.xPos -= Frog.speed;
                Frog.move();
                break;
            case 39:	// right arrow
                Frog.xPos += Frog.speed;
                Frog.move();
                break;
            case 38: // up arrow
                Frog.yPos += Frog.speed;
                Frog.row++;
                Frog.move();
                break;
            case 40: //down arrow
                Frog.yPos -= Frog.speed;
                Frog.row--;
                Frog.move();
                break;
            case 82: //r key
                //restart();
        }
        gl.bindBuffer( gl.ARRAY_BUFFER, frogBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(cubeVertices));
    });

    render();
}





// draw a house in location (x, y) of size size
function house( x, y, size, mv ) {

    var mvRoof = mv;

    gl.uniform4fv( colorLoc, RED );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    mv = mult( mv, translate( x, y, size/2 ) );
    mv = mult( mv, scalem( size, size, size ) );

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

function drawRoadRow(mv, row) {


    Grid.reset(row);
    updateCarLocation( row, roadSpeeds[row]);
    drawCar( mv, cars[row][0], row );
    drawCar( mv, cars[row][1], row );
    drawCar( mv, cars[row][2], row );

    // collision test
    // var testx = Math.floor((70)/gridCellWidth);
    // if(gridCoords[testx][1] === true) console.log("BOOM");
    //
}



function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    var mv = mat4();
    switch( view ) {
        case 1:
            // Distant and stationary viewpoint
	    mv = lookAt( vec3(60.0, -130.0, 150.0+height), vec3(60.0, 150.0, 0.0), vec3(0.0, 0.0, 1.0) );
	    drawScenery( mv );
      drawRoad(mv);

      for (var i = 1; i <= 5 ; i++) {
        drawRoadRow(mv, i);
      }

      break;
    }

    Frog.draw(mv);


    requestAnimFrame( render );
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
