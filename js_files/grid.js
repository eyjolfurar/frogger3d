// GRID STUFF

var Grid = [];

Grid.init = function() {


  for(var i = 0 ; i < columns ; i++) {
    //make rows
    Grid[i]=[];
  }
}

Grid.reset = function(currentRow) {
    for (var i = 0; i < Grid.length; i++) {
      Grid[i][currentRow]=false;
  }
}

Grid.update = function(x, currentRow, type) {

  if(type==="CAR") {
    var coordX = Math.floor((x)/gridCellWidth);

    var xRoundDown = Math.floor((x)/gridCellWidth)*gridCellWidth;
    var xRoundUp = xRoundDown+gridCellWidth;
    // console.log(xRoundDown +" + "+ xRoundUp);

    if (x-carWidth/2 < xRoundDown+gridCellWidth/2+Frog.width/2) {
      if(coordX && coordX<Grid.length && coordX>=0) {
        Grid[coordX][currentRow] = true;
      }
    }

    if(x+carWidth/2 > xRoundUp+gridCellWidth/2-Frog.width/2) {
      if(coordX && coordX<Grid.length-1 && coordX>=0) {
        Grid[coordX+1][currentRow] = true;
      }
    }

    var roundedX = coordX*gridCellWidth;
    // if()
      // if(coordX && coordX<Grid.length && coordX>=0) {
      //   Grid[coordX][currentRow] = true;
      // }

    //(roundedX+carLength/2) > (gridCellWidth/2-Frog.width/2)
  }

}
