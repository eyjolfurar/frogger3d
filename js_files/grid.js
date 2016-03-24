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

Grid.update = function(x, currentRow) {

  var coordX = Math.floor((x)/gridCellWidth);
  if(coordX<Grid.length && coordX>=0) {
    Grid[coordX][currentRow] = true;
  }
}
