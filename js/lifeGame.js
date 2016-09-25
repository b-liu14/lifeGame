/* eslint-env browser */
var map;
var logic;
var timer;
var gui;

map = {
  // init the cell of rows * cols with false
  init: function(rows, cols) {
    // cellSucc saves the current cell status
    map.cell = new Array(rows);
    // cellSucc saves the succeed cell status
    map.cellSucc = new Array(rows);
    for (var i = 0; i < rows; i++) {
      map.cell[i] = new Array(cols);
      map.cellSucc[i] = new Array(cols);
    }
    map.clear(map.cell);
    map.clear(map.cellSucc);
  },

  // clear all the alive cell
  clear: function(cell) {
    for (var i = 0; i < map.rows(); i++) {
      for (var j = 0; j < map.cols(); j++) {
        cell[i][j] = false;
      }
    }
  },

  // get the rows of map
  rows: function() {
    return map.cell.length;
  },

  // get the columns of map
  cols: function() {
    return map.cell[0].length;
  },

  // random reset the cell with the living ratio 0.2
  reset: function() {
    for (var i = 0; i < map.rows(); i++) {
      for (var j = 0; j < map.cols(); j++) {
        map.cell[i][j] = (Math.random() > 0.8);
      }
    }
  },

  // get the statue of cell[row][col]
  get: function(row, col) {
    return map.cell[row][col];
  },

  // set the statue of cell[row][col]
  set: function(row, col, val) {
    map.cell[row][col] = val;
  },

  // get the living count in neighbor of cell[row][col]
  getNeighborCount: function(row, col) {
    var iLeft = (col - 1 + map.cols()) % map.cols();
    var iRight = (col + 1) % map.cols();
    var iTop = (row - 1 + map.rows()) % map.rows();
    var iBottom = (row + 1) % map.rows();
    var get = map.get;
    return (get(iTop, iLeft) + get(row, iLeft) + get(iBottom, iLeft) +
      get(iTop, col) + get(iBottom, col) +
      get(iTop, iRight) + get(row, iRight) + get(iBottom, iRight));
  }
};

// game logic
logic = {
  runOneTime: function() {
    var i;
    var j;
    for (i = 0; i < map.rows(); i++) {
      for (j = 0; j < map.cols(); j++) {
        var count = map.getNeighborCount(i, j);
        if (count === 3) {
          map.cellSucc[i][j] = true;
        } else if (count === 2) {
          map.cellSucc[i][j] = map.cell[i][j];
        } else {
          map.cellSucc[i][j] = false;
        }
      }
    }

    for (i = 0; i < map.rows(); i++) {
      for (j = 0; j < map.cols(); j++) {
        map.cell[i][j] = map.cellSucc[i][j];
      }
    }
  }
};

timer = {
  init: function() {
    timer.timeInterval = 100;
    timer.beginButton = document.getElementsByName('begin')[0];
  },

  start: function() {
    timer.timer = setInterval(function() {
      logic.runOneTime();
      timer.beginButton.innerHTML = '停止演化';
      gui.render();
    }, timer.timeInterval);
  },

  stop: function() {
    clearInterval(timer.timer);
    timer.timer = undefined;
    timer.beginButton.innerHTML = '开始演化';
  },

  speedUp: function() {
    timer.stop();
    timer.timeInterval /= 2;
    timer.start();
  },

  slowDown: function() {
    timer.stop();
    timer.timeInterval *= 2;
    timer.start();
  }

};

gui = {
  init: function() {
    gui.renderGrid();
    gui.bindClickEvents();
    // store the color of cell: white -> died cell, black -> alive cell
    // then we can get the cell color by using:
    //    cellColor = gui.bgColor[Number(cellStatus)];
    gui.bgColor = ['white', 'black'];
    gui.render();
  },

  renderGrid: function() {
    gui.grid = document.getElementsByClassName('grid')[0];
    // remove all the children node of grid
    while (gui.grid.childNodes.length > 0) {
      gui.grid.removeChild(gui.grid.firstChild);
    }

    var style = window.getComputedStyle(gui.grid, null);
    var height = Number(style.height.slice(0, -2));
    var width = Number(style.width.slice(0, -2));
    var rows = map.rows();
    var cols = map.cols();
    var cellSize = Math.min(height / rows, width / cols);
    var distLeft = (width - cellSize * cols) / 2;
    var distTop = (height - cellSize * rows) / 2;

    // insert cells into grid;
    for (var i = 0; i < rows; i++) {
      var rowDiv = document.createElement("div");
      rowDiv.style.height = cellSize;
      rowDiv.style.width = width + 'px';
      rowDiv.id = "row_" + i;
      gui.grid.appendChild(rowDiv);
      for (var j = 0; j < cols; j++) {
        var colDiv = document.createElement("div");
        colDiv.id = "col_" + i + '_' + j;
        colDiv.className = 'cell';
        colDiv.style.left = distLeft + cellSize * j + 'px';
        colDiv.style.top = distTop + cellSize * i + 'px';
        colDiv.style.width = cellSize + 'px';
        colDiv.style.height = cellSize + 'px';
        // bind the onclick event using anonymous function
        (function(i, j, colDiv) {
          var row = i;
          var col = j;
          var item = colDiv;
          colDiv.onclick = function() {
            var cellStatue = map.get(row, col);
            map.set(row, col, !cellStatue);
            item.style.backgroundColor = gui.bgColor[Number(!cellStatue)];
          };
        })(i, j, colDiv);
        rowDiv.appendChild(colDiv);
      }
    }
  },

  // render the cell with color
  render: function() {
    for (var i = 0; i < map.rows(); i++) {
      for (var j = 0; j < map.cols(); j++) {
        var colDiv = document.getElementById("col_" + i + '_' + j);
        colDiv.style.backgroundColor = gui.bgColor[Number(map.get(i, j))];
      }
    }
  },

  // bind click event to buttons
  bindClickEvents: function() {
    var clearButton = document.getElementsByName('clear')[0];
    clearButton.onclick = function() {
      if (timer.timer !== undefined) {
        timer.stop();
      }
      map.clear(map.cell);
      gui.render();
    };

    var randomButton = document.getElementsByName('random')[0];
    randomButton.onclick = function() {
      if (timer.timer !== undefined) {
        timer.stop();
      }
      map.reset();
      gui.render();
    };

    var beginButton = document.getElementsByName('begin')[0];
    beginButton.onclick = function() {
      if (timer.timer === undefined) {
        timer.start();
      } else {
        timer.stop();
      }
    };

    var speedUpButton = document.getElementsByName('speedUp')[0];
    speedUpButton.onclick = function() {
      timer.speedUp();
    };

    var slowDownButton = document.getElementsByName('slowDown')[0];
    slowDownButton.onclick = function() {
      timer.slowDown();
    };
  }
};
