"use strict";
var Frog = {};

Frog.xPos = gridCellWidth*col6+gridCellWidth/2;
Frog.width = 6;
Frog.speed = 10;
Frog.row = 0;

Frog.draw = function(mv) {
    // console.log(this.xpos);
    gl.uniform4fv( colorLoc, GREEN );

    gl.bindBuffer( gl.ARRAY_BUFFER, frogBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    mv = mult( mv, translate( this.xPos, this.row*gridCellWidth+gridCellWidth/2, 1 ) );
    mv = mult( mv, scalem( Frog.width,Frog.width,2 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, frogVertices.length );
}

Frog.move = function() {

  console.log("move it");

}

Frog.checkCollision = function() {

    // Collission detection
    var testx = Math.floor((Frog.xPos)/gridCellWidth);
    if(Grid[testx][Frog.row] === true) {
      console.log("BOOM");
      Frog.xPos = gridCellWidth*col6+gridCellWidth/2;
      Frog.row = 0;
    }
}
