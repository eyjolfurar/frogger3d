"use strict";
var Frog = {};

Frog.xPos = gridCellWidth*col6+gridCellWidth/2;
Frog.width = 6;
Frog.speed = 10;
Frog.row = 0;
Frog.col = 6;
Frog.onRiver = false;

Frog.draw = function(mv) {
    // console.log(this.xpos);
    gl.uniform4fv( colorLoc, GREEN );

    gl.bindBuffer( gl.ARRAY_BUFFER, frogBuffer );
    // gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    mv = mult( mv, translate( this.xPos, this.row*gridCellWidth+gridCellWidth/2, 1 ) );
    mv = mult( mv, scalem( 3,3,3 ) );
    // rotate frog
    mv = mult( mv, rotate( 90, [1,1,1]) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, frogVertices.length );
    // gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
}

Frog.update = function() {

  // console.log("move it");
  if (this.row >= 7 && this.row <= 10) {
      // frog is at the river
      this.onRiver = true;
      this.xPos += roadSpeeds[this.row];
      if(roadSpeeds[this.row]>0) {
        // right direction
        // check if frog has moved to next column
        if(this.xPos > this.col*10+5+5) {
          this.col++;
        }
      }
      else {
        // left direction
        // check if frog has moved to next column
        if(this.xPos < this.col*10+5-5) {
          this.col--;
        }
      }
  } else {
    this.onRiver = false;
  }
}

Frog.fixXLoc = function() {

  this.xPos = this.col*10+5;

}

Frog.checkCollision = function() {

    // Collission detection
    var testx = Math.floor((Frog.xPos)/gridCellWidth);
    if(Grid[testx][Frog.row] === true) {
      console.log("BOOM");

      Frog.xPos = gridCellWidth*col6+gridCellWidth/2;
      Frog.row = 0;
      Frog.col = 6;
    }
}
