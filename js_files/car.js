
// variables for moving car
var carDirection = 0.0;
var carXPos = 100.0;
var carYPos = 0.0;
var height = 0.0;
var turn = 0.0;
var carLength = 8;
var carWidth = 3;

var cars = [];

function initCar() {
  for (var i = 1; i <= 5 ; i++) {
    cars[i] = [];
  }
  //cars[row][number of cars] = x position
  for (var j = 1; j <= 5 ; j++) {
    RANDOM = getRandom(0 , 50);
    cars[j][0]=100 + RANDOM;
    cars[j][1]=50 + RANDOM;
    cars[j][2]=10 + RANDOM;
  }
}

function updateCarLocation (row, speed) {

  for(var i = 0 ; i <= 2 ; i++) {
    cars[row][i] += speed;
    //Collission

    //
    if(cars[row][i] > 130+20) cars[row][i] = 0-20;
    else if(cars[row][i] < 0-20) cars[row][i] = 130+20;
    Grid.update( cars[row][i] , row, "CAR");
  }
}

// draw car as two blue cubes
function drawCar( mv, x, row) {
    if(row%2 === 0 ) carDirection = 0.0;
    else carDirection = 180.0;

    mv = mult( mv, translate( x, row*gridCellWidth+gridCellWidth/2, 0.0 ) );
    mv = mult( mv, rotateZ( carDirection ) ) ;

    // set color to blue
    gl.uniform4fv( colorLoc, BLUE );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    var mv1 = mv;
    // lower body of the car
    mv = mult( mv, scalem( carLength, carWidth, 2.0 ) );
    mv = mult( mv, translate( 0.0, 0.0, 0.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    // upper part of the car
    mv1 = mult( mv1, scalem( 4.0, 3.0, 2.0 ) );
    mv1 = mult( mv1, translate( -0.2, 0.0, 1.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
}
