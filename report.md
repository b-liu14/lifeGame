## 软件工程3第一次作业说明文档
### 文件详情
* `index.html`是本次作业的展示网页。
* `report.html`（本文件）为本次作业的说明文档。
* `css/style.css`中定义了网页中元素的样式。
* `js/lifeGame.js`是本次作业的核心，其中实现了生命游戏的地图，逻辑，计时器，用户界面的相关函数。
* `test/ `目录下为测试文件，包括测试代码`lifeGame_test.js`和测试结果展示网页`test.html`。

### 技术细节
我将游戏分为4个模块：地图（`map`），逻辑（`logic`），计时器（`timer`），图形用户界面（`gui`），下面按照该顺序一一进行介绍。

#### map
`map`中使用一个二维`boolean`数组`cell`来标记每一个细胞是否为生，`cell`的维度由初始化时传入的参数`rows`和`cols`决定。同时，使用一个相同大小的二维`boolean`数组`cellSucc`来储存`map`当前状态演化一次后的状态。
细胞状态储存完毕后，只需再实现一些常用接口供`logic`、`timer`和`gui`调用即可，我实现了如下几个接口：
  * `clear()`： 将所有细胞置为“死亡”状态
  * `rows()`： 返回`cell`第一维的大小
  * `cols()`：返回`cell`第二维的大小
  * `reset()`：随机决定每一个细胞的生死状态。具体实现方式为调用`Math.random()`函数，其返回值大于0.8时将细胞置为生，否则置为死。
  * `get(row, col)`：获取某一位置的细胞状态
  * `set(row, col, val)`：设置某一位置的细胞状态为`val`，其中`val`必须为`boolean`类型
  * `getNeighborCount(row, col)`：获取某一位置周围8个位置中活细胞的数目，由于地图是一个“环形”地图，即地图最左边和地图最右边是相邻的，因此在计算时需要先通过如下方法获取该位置左右两列对应的col值和上下两行对应的row值（分别用`iLeft, iRight, iTop, iBottom`来表示），然后即可利用`iLeft, iRight, iTop, iBottom`获取周围八个细胞的状态并计数
    ```javascript
    var iLeft = (col - 1 + this.cols()) % this.cols();
    var iRight = (col + 1) % this.cols();
    var iTop = (row - 1 + this.rows()) % this.rows();
    var iBottom = (row + 1) % this.rows();
    ```

#### logic
logic部分较为简单，只需要实现演化一次的功能即可，我实现了如下接口：
* `runOneTime()`：首先获取每一个细胞周围的状态为生的细胞总数并依据游戏规则决定每一个细胞演化后的状态，并将演化后的结果储存在`cellSucc`中，最后将结果复制回`cell`中即可

#### timer
timer部分实现了如下计时器相关的接口：
* `init()`：设置初始时间间隔`timeInterval`为`100ms`
* `start()`：开始演化。调用`setInterval`，每隔`timeInterval`(ms)执行一次如下过程：首先执行logic.runOneTime()进行一次演化，其次将开始按钮中的文字变为“停止演化”，最后调用gui.render绘制细胞状态
* `stop()`：停止演化。首先清除计时器，然后将开始按钮中的文字变为“开始演化”
* `speedUp()`：加速演化。首先停止演化，然后将`timeInterval`减半，最后重新开始演化
* `slowDown()`：减速演化。与上诉过程类似，唯一的区别是将`timeInterval`变为两倍

#### gui
gui部分负责与用户进行交互，主要实现了如下几个函数（此处不用接口一词是因为有其中几个函数只在内部使用）：
* `init()`：gui初始化，首先调用renderGrid按照map的大小绘制栅格，然后调用bindClickEvents给界面中的按钮绑定点击事件，最后调用render绘制细胞状态
* `renderGrid()`：绘制栅格。首先获得最大可用空间（即html中className为‘grid’的元素所占据的空间），然后通过`cellSize = Math.min(height / rows, width / cols)`来计算每个栅格的长和宽（为了保证每个栅格是一个正方形）。最后按照map中的层次结构往grid中添加子节点，并为对每一个节点进行如下操作：
  - 设置`id`和`classname`
  - 设置`left`，`top`,`width`,`height`等样式（绝对定位）
  - 绑定鼠标点击事件，使得每次点击该细胞，细胞状态发生反转。这里需要强调的是由于`javascript`没有块级作用域，因此不能直接在`for`循环里使用匿名函数绑定`onclick`事件。我的解决方案是使用一个匿名函数自执行的方法将参数捕捉到的参数传入内层函数中。具体实现如下：
  ```javascript
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
  ```
  通过实验可以发现，如果不采用这种办法，那最终传入每一个节点的onclick事件的参数i,j,colDiv都相同
* `render()`：根据每个细胞的状态来绘制每个细胞的颜色，具体实现为`colDiv.style.backgroundColor = gui.bgColor[Number(map.get(i, j))];`，其中`bgColor = ['white', 'black']`
* `bindClickEvents()`：给各个按钮绑定点击事件。具体不再赘述。

通过将功能划分为4个完整的模块，大大降低了模块之间的耦合性，提高代码质量。

### 代码静态分析
使用了eslint（具体规范为eslint-config-google）来对包括测试文件在内的所有js代码进行了代码静态分析，以保证代码质量。因此，本次生命游戏中的js代码完全符合google的代码规范。

### 单元测试方案

#### 单元测试环境
采用mocha 3.0.2在浏览器端进行测试

#### 测试用例设计
在本次实验中，我采取的是测试驱动的开发方法。首先设计了本次实验所需要的所有模块以及所有模块中的接口，然后对每个模块和每个接口进行具体的测试驱动的开发。对于每个模块，都需要测试以确定其确实是一个对象。而对于每一个函数也需要确定其确实是一个函数。下面不再赘述这两部分，仅介绍功能相关的函数的测试用例设计。

##### map模块测试用例设计

###### `init()`
* 通过检查cell的长度是否等于rows、cell中每一个元素指向的数组的长度是否等于cols，来检验init是否正确设置了cell的大小。
* 通过采样（随机选取坐标）检查cell中的元素是否被初始化为false。值得一提的是，最初我的测试方法是遍历每个cell来检查，但是这样效率比较低。而将所有需要遍历的地方改为采样检查后，不但准确性能有所保证，而且大幅降低了测试所花时间（由大于4s变为了约0.2s）。

###### `rows()` & `cols()`
* 通过检查其返回值是否等于调用init是传入的rows,cols值来检查

###### `reset()`
* 由于reset是将每个细胞随机赋值，因此只需检查reset后cell中每个元素的值是否为boolean类型即可。

###### `get(row, col)` & `set(row, col, val)`
* 通过采样选取一些细胞，通过对每个细胞调用set然后get并检查返回值是否与传入set的参数相同即可。

###### `getNeighborCount(row, col)`
* 通过将特定细胞设置为生，然后检查getNeighborCount的返回值是否与预期相符即可。


##### logic模块测试用例设计

###### `runOneTime()`
* 检查如果初始状态下所有细胞均“死亡”，则运行该函数后所有细胞仍然处于死亡状态。
* 检查如果初始状态下某细胞周围有3个活细胞，则演化一次后该细胞一定为生。
* 检查如果初始状态下某细胞周围有2个活细胞，则演化一次后该细胞状态不变。
* 检查如果初始状态下某细胞周围有小于2个活细胞，则演化一次后该细胞死亡
* 检查如果初始状态下某细胞周围有大于3个活细胞，则演化一次后该细胞死亡

##### timer模块测试用例设计

###### `init()`
* 检查是否初始化变量`timeInterval`

###### `start()` & `stop()`
* 检查是否正确开始/停止游戏（通过检查`timer.timer`是否为`undefined`来检查游戏是否开始/停止）
* 检查是否正确修改开始按钮中的提示文字

###### `speedUp()` & `slowDown()`
* 检查是否正确加速/减速游戏（通过检查`timerInterval`的值的变化）
* 检查是否开始游戏

##### gui模块测试用例设计

###### `init()`
* 检查是否正确初始化变量`bgColor`。

###### `renderGrid()`
* 通过采样的方法检查是否成功将细胞栅格绘制出来
* 通过采样的方法检查是否给每个细胞都绑定了点击翻转状态的鼠标事件

###### `bindClickEvents()`
* 检查界面上的按钮的鼠标点击事件是否是函数。

###### `render()`
* 抽样检查细胞的颜色是否在字符串数组`bgColor`中

#### 测试结果
对代码进行了一共45项测试，成功45个，失败0个，用时约0.23s。

#### 运行测试的方法
安装好`mocha`之后在浏览器中打开test/test.html即可运行测试并查看测试结果。
