/* global map logic timer gui:true */
/* global assert describe it context beforeEach:true */
/* eslint-env browser */

describe('map', function() {
  it('should be a Object', function() {
    assert.isObject(map);
  });

  var rows;
  var cols;
  beforeEach(function() {
    rows = 30;
    cols = 29;
    map.init(rows, cols);
  });

  context('init', function() {
    it('should be a function', function() {
      assert.isFunction(timer.init);
    });
    it('should set the right size of cell', function() {
      assert.equal(map.cell.length, rows);
      for (var i = 0; i < cols; i++) {
        assert.equal(map.cell[i].length, cols);
      }
    });
    it('should set every element to false', function() {
      var nSample = map.rows() * map.cols() / 100;
      for (var k = 0; k < nSample; k++) {
        var i = Math.round(Math.random() * (map.rows() - 1));
        var j = Math.round(Math.random() * (map.cols() - 1));
        assert.equal(map.cell[i][j], false);
      }
    });
  });

  context('rows', function() {
    it('should be a function', function() {
      assert.isFunction(map.rows);
    });
    it('should return the right rows', function() {
      assert.equal(map.rows(), rows);
    });
  });

  context('cols', function() {
    it('should be a function', function() {
      assert.isFunction(map.cols);
    });
    it('should return the right cols', function() {
      assert.equal(map.cols(), cols);
    });
  });

  context('reset', function() {
    it('should be a function', function() {
      assert.isFunction(map.reset);
    });
    it('should make every element to be boolean type', function() {
      map.reset();
      var nSample = map.rows() * map.cols() / 100;
      for (var k = 0; k < nSample; k++) {
        var i = Math.round(Math.random() * (map.rows() - 1));
        var j = Math.round(Math.random() * (map.cols() - 1));
        assert.equal(typeof map.cell[i][j], typeof false);
      }
    });
  });

  context('get & set', function() {
    it('should be two function', function() {
      assert.isFunction(map.get);
      assert.isFunction(map.set);
    });
    it('should get and set the right status', function() {
      map.reset();
      var nSample = map.rows() * map.cols() / 100;
      for (var k = 0; k < nSample; k++) {
        var i = Math.round(Math.random() * (map.rows() - 1));
        var j = Math.round(Math.random() * (map.cols() - 1));
        assert.equal(map.get(i, j), map.cell[i][j]);
        map.set(i, j, false);
        assert.equal(map.get(i, j), false);
        map.set(i, j, true);
        assert.equal(map.get(i, j), true);
      }
    });
  });

  context('getNeighborCount', function() {
    it('should be a function', function() {
      assert.isFunction(map.getNeighborCount);
    });
    it('should get the right count in neighbor', function() {
      assert.equal(map.getNeighborCount(0, 0), 0);
      map.reset();
      assert.equal(map.getNeighborCount(0, 0),
        map.get(0, 1) + map.get(1, 0) + map.get(1, 1) +
        map.get(0, cols - 1) + map.get(1, cols - 1) +
        map.get(rows - 1, 0) + map.get(rows - 1, 1) +
        map.get(rows - 1, cols - 1)
      );
      assert.equal(map.getNeighborCount(10, 10),
        map.get(9, 9) + map.get(9, 10) + map.get(9, 11) +
        map.get(10, 9) + map.get(10, 11) +
        map.get(11, 9) + map.get(11, 10) + map.get(11, 11)
      );
    });
  });
});

describe('logic', function() {
  it('should be a Object', function() {
    assert.isObject(logic);
  });

  var rows;
  var cols;
  beforeEach(function() {
    rows = 30;
    cols = 29;
    map.init(rows, cols);
  });

  context('runOneTime', function() {
    it('should be a function', function() {
      assert.isFunction(logic.runOneTime);
    });
    it('should make every cell died ' +
    'if every cell is death before runOneTime', function() {
      logic.runOneTime();
      var nSample = map.rows() * map.cols() / 100;
      for (var k = 0; k < nSample; k++) {
        var i = Math.round(Math.random() * (map.rows() - 1));
        var j = Math.round(Math.random() * (map.cols() - 1));
        assert.equal(map.cell[i][j], false);
      }
    });
    it('should make a cell alive if the neighbor count is 3', function() {
      map.set(0, 0, true);
      map.set(0, 1, true);
      map.set(0, cols - 1, true);
      logic.runOneTime();
      assert.equal(map.get(1, 0), true);
    });
    it('should make a cell keep its status ' +
    'if the neighbor count is 2', function() {
      map.set(0, 0, true);
      map.set(0, cols - 1, true);
      logic.runOneTime();
      assert.equal(map.get(1, 0), false);

      map.set(10, 10, true);
      map.set(10, 11, true);
      map.set(11, 11, true);
      logic.runOneTime();
      assert.equal(map.get(11, 11), true);
    });
    it('should make a cell die ' +
    'if the neighbor count is smaller than 2', function() {
      map.set(10, 10, true);
      map.set(11, 11, true);
      logic.runOneTime();
      assert.equal(map.get(11, 11), false);

      map.set(11, 11, true);
      logic.runOneTime();
      assert.equal(map.get(11, 11), false);
    });
    it('should make a cell die ' +
    'if the neighbor count is bigger than 3', function() {
      map.set(10, 9, true);
      map.set(10, 10, true);
      map.set(10, 11, true);
      map.set(11, 9, true);
      map.set(11, 10, true);
      logic.runOneTime();
      assert.equal(map.get(11, 10), false);
    });
  });
});

describe('timer', function() {
  it('should be a Object', function() {
    assert.isObject(timer);
  });

  var rows;
  var cols;
  beforeEach(function() {
    rows = 30;
    cols = 29;
    map.init(rows, cols);
    timer.init();
  });
  context('init', function() {
    it('should be a function', function() {
      assert.isFunction(timer.init);
    });
    it('should initial the timeInterval', function() {
      assert.equal(typeof timer.timeInterval, typeof 0);
    });
  });
  context('start', function() {
    it('should be a function', function() {
      assert.isFunction(timer.start);
    });
    it('should start the game', function() {
      timer.start();
      assert.equal(typeof timer.timer, typeof 1);
    });
    it('should change the innerHTML in beginButton', function() {
      timer.start();
      setTimeout(function() {
        assert.equal(timer.beginButton.innerHTML, '停止演化');
      }, timer.timeInterval);
    });
  });
  context('stop', function() {
    it('should be a function', function() {
      assert.isFunction(timer.stop);
    });
    it('should stop the game', function() {
      timer.start();
      timer.stop();
      assert.equal(typeof timer.timer, 'undefined');
    });
    it('should change the innerHTML in beginButton', function() {
      timer.start();
      assert.equal(timer.beginButton.innerHTML, '开始演化');
    });
  });
  context('speedUp', function() {
    it('should be a function', function() {
      assert.isFunction(timer.speedUp);
    });
    it('should speedUp game', function() {
      var timeIntervalPres = timer.timeInterval;
      timer.speedUp();
      assert.isBelow(timer.timeInterval, timeIntervalPres);
    });
    it('should start the game', function() {
      timer.speedUp();
      assert.equal(typeof timer.timer, typeof 1);
    });
  });
  context('slowDown', function() {
    it('should be a function', function() {
      assert.isFunction(timer.slowDown);
    });
    it('should slowDown game', function() {
      var timeIntervalPres = timer.timeInterval;
      timer.slowDown();
      assert.isAbove(timer.timeInterval, timeIntervalPres);
    });
    it('should start the game', function() {
      timer.slowDown();
      assert.equal(typeof timer.timer, typeof 1);
    });
  });
});

describe('gui', function() {
  it('should be a Object', function() {
    assert.isObject(gui);
  });

  var rows;
  var cols;
  beforeEach(function() {
    rows = 30;
    cols = 29;
    map.init(rows, cols);
    timer.init();
    gui.init();
  });
  context('init', function() {
    it('should be a function', function() {
      assert.isFunction(gui.init);
    });
    it("should init the bgColor's element to string type", function() {
      assert.equal(gui.bgColor.length, 2);
      assert.equal(typeof gui.bgColor[0], typeof '');
      assert.equal(typeof gui.bgColor[1], typeof '');
    });
  });
  context('renderGrid', function() {
    it('should be a function', function() {
      assert.isFunction(gui.renderGrid);
    });
    it('should render the grid', function() {
      assert.equal(gui.grid.className, 'grid');

      var nSample = map.rows() * map.cols() / 100;
      for (var k = 0; k < nSample; k++) {
        var i = Math.round(Math.random() * (map.rows() - 1));
        var j = Math.round(Math.random() * (map.cols() - 1));
        var item = gui.grid.children[i].children[j];
        assert.equal(item.id, 'col_' + i + '_' + j);
        assert.equal(item.className, 'cell');
      }
    });
    it('should bind the click event(statue change and color reversal) ' +
    'to the cell', function() {
      var nSample = map.rows() * map.cols() / 100;
      for (var k = 0; k < nSample; k++) {
        var i = Math.round(Math.random() * (map.rows() - 1));
        var j = Math.round(Math.random() * (map.cols() - 1));
        var item = gui.grid.children[i].children[j];
        assert.isFunction(item.onclick);

        assert.equal(item.style.backgroundColor, gui.bgColor[0]);
        assert.equal(map.get(i, j), false);

        item.click();
        assert.equal(item.style.backgroundColor, gui.bgColor[1]);
        assert.equal(map.get(i, j), true);

        item.click();
        assert.equal(item.style.backgroundColor, gui.bgColor[0]);
        assert.equal(map.get(i, j), false);
      }
    });
  });
  context('bindClickEvents', function() {
    it('should be a function', function() {
      assert.isFunction(gui.bindClickEvents);
    });
    it('should bind click function to buttons', function() {
      assert.isFunction(document.getElementsByName('clear')[0].onclick);
      assert.isFunction(document.getElementsByName('random')[0].onclick);
      assert.isFunction(document.getElementsByName('begin')[0].onclick);
      assert.isFunction(document.getElementsByName('speedUp')[0].onclick);
      assert.isFunction(document.getElementsByName('slowDown')[0].onclick);
    });
  });
  context('render', function() {
    it('should call render the cell', function() {
      var nSample = map.rows() * map.cols() / 100;
      for (var k = 0; k < nSample; k++) {
        var i = Math.round(Math.random() * (map.rows() - 1));
        var j = Math.round(Math.random() * (map.cols() - 1));
        var colDiv = document.getElementById("col_" + i + '_' + j);
        var color = colDiv.style.backgroundColor;
        var isRendered = Number(color === gui.bgColor[0]) +
          Number(color === gui.bgColor[1]);
        assert.equal(isRendered, 1);
      }
    });
  });
});
