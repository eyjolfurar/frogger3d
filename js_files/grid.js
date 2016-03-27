// GRID STUFF

var Grid = [];

Grid.init = function() {


  for(var i = 0 ; i < columns ; i++) {
    //make rows
    Grid[i]=[];
  }
}

Grid.reset = function(currentRow) {

  if(1<=currentRow && currentRow <= 6) {
    // its a car
    for (var i = 0; i < Grid.length; i++) {
      Grid[i][currentRow]=false;
    }
  }
  if(7<=currentRow && currentRow <= 10) {
    // its a log
    for (var i = 0; i < Grid.length; i++) {
      Grid[i][currentRow]=true;
    }
  }
}

Grid.update = function(x, currentRow) {

  if(1<=currentRow && currentRow <= 6) {
    // its a car
    var coordX = Math.floor((x)/gridCellWidth);
    var xRoundDown = Math.floor((x)/gridCellWidth)*gridCellWidth;
    var xRoundUp = xRoundDown+gridCellWidth;
    // check if car touches left cell
    if (x-carLength/2 < xRoundDown+gridCellWidth/2+Frog.width/2) {
      if(coordX && coordX<Grid.length && coordX>=0) {
        Grid[coordX][currentRow] = true;
      }
    }
    // check if car touches right cell
    if(x+carLength/2 > xRoundUp+gridCellWidth/2-Frog.width/2) {
      if(coordX && coordX<Grid.length-1 && coordX>=0) {
        Grid[coordX+1][currentRow] = true;
      }
    }
  }
  if(7<=currentRow && currentRow <= 10) {
    // its a log
    var coordX = Math.floor((x)/gridCellWidth);
    var xRoundDown = Math.floor((x)/gridCellWidth)*gridCellWidth;
    var xRoundUp = xRoundDown+gridCellWidth;
    // check if log touches left cell
    if (x-logLength/2 < xRoundDown+gridCellWidth/2+Frog.width/2) {
      if(coordX && coordX<Grid.length && coordX>=0) {

        Grid[coordX][currentRow] = false;
        // make game easier...
        Grid[coordX-1][currentRow] = false;
      }
    }
    // check if log touches right cell
    if(x+logLength/2 > xRoundUp+gridCellWidth/2-Frog.width/2) {
      if(coordX && coordX<Grid.length-1 && coordX>=0) {
        Grid[coordX][currentRow] = false;
        // make game easier...
        Grid[coordX+1][currentRow] = false;
      }
    }
  }

}
