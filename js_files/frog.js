"use strict";
var Frog = {};

Frog.xPos = gridCellWidth*col6+gridCellWidth/2;
Frog.yPos = 5.0;
Frog.width = 6;
Frog.speed = 10;
Frog.row = 0;

Frog.draw = function(mv) {
    // console.log(this.xpos);
    gl.uniform4fv( colorLoc, YELLOW );

    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    mv = mult( mv, translate( this.xPos, this.yPos, 1 ) );
    mv = mult( mv, scalem( Frog.width,Frog.width,2 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
}

Frog.move = function() {
  console.log("move it");



}
