
// variables for moving log
var logDirection = 0.0;
var logXPos = 100.0;
var logYPos = 6.0;
var height = 0.0;
var turn = 0.0;
var logLength = 16;
var logWidth = 3;

var logs = [];

function initLog() {
  for (var i = 7; i <= 10 ; i++) {
    logs[i] = [];
  }
  //logs[row][number of logs] = x position
  for (var j = 7; j <= 10 ; j++) {
    RANDOM = getRandom(0 , 50);
    logs[j][0]=100 + RANDOM;
    logs[j][1]=50 + RANDOM;
    logs[j][2]=10 + RANDOM;
  }
}

function updateLogLocation (row, speed) {

  for(var i = 0 ; i <= 2 ; i++) {
    logs[row][i] += speed * 2;

    if(logs[row][i] > 130+20) logs[row][i] = 0-20;
    else if(logs[row][i] < 0-20) logs[row][i] = 130+20;
    Grid.update( logs[row][i] , row)
  }
}

// draw log as two brown cubes
function drawLog( mv, x, row) {
    if(row%2 === 0 ) logDirection = 0.0;
    else logDirection = 180.0;
    // console.log(row);
    // console.log(x);
    mv = mult( mv, translate( x, row*gridCellWidth+gridCellWidth/2, 0.0 ) );
    mv = mult( mv, rotateZ( logDirection ) ) ;

    // set color to brown
    gl.uniform4fv( colorLoc, BROWN );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    var mv1 = mv;
    // lower body of the log
    mv = mult( mv, scalem( logLength, logWidth, 2.0 ) );
    mv = mult( mv, translate( 0.0, 0.0, 0.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );


}
