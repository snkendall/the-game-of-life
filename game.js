var mainElement = document.getElementById('main')
if (mainElement) {
  var game = Life(mainElement);

  // Connect #step_btn to the step function
  game.playing = false;
  game.intervalId;
  document.getElementById('step_btn')
    .addEventListener('click', ()=> game.step());

  document.getElementById('play_btn')
    .addEventListener('click', game.togglePlaying);


  document.getElementById('reset_btn')
    .addEventListener('click', game.random);

    document.getElementById('clear_btn')
    .addEventListener('click', game.clear);

  // TODO: Connect other buttons.
}

function Life(container, width=12, height=12) {
  // Create boards for the present and future.
  // Game boards are somewhat expensive to create, so we're going
  // to be reusing them. Each time we step the game, `future`
  // becomes `present` and vice versa.
  var present = new Board(width, height);
  var future = new Board(width, height);

  // Create a <table> to hold our cells.
  var tableArray = [];
  var table = createTable();

  // Put the table in our container
  container.appendChild(table);

  // Add a mouse down listener to our table
  table.addEventListener('mousedown', toggleCellFromEvent);

  function createTable() {
    // create <table> element
    var table = document.createElement('table');       // <table
    table.classList.add('board')                       //   class='board'>
    for (var r = 0; r < height; r++) {
      var tr = document.createElement('tr');           //   <tr>
      for (var c = 0; c < width; c++) {                //     For instance, at r=2, c=3:
        var td = document.createElement('td');         //     <td
        td.id = `${r}-${c}`                            //       id="2-3">
        // We'll put the coordinate on the cell
        // Element itself, letting us fetch it
        // in a click listener later.
        td.coord = [r, c];
        tr.appendChild(td);
        tableArray.push(td);                            //     </td>
      }
      table.appendChild(tr);                           //   </tr>
    }                                                  //  </table>
    return table
  }

  function toggleCellFromEvent(event) {
    // FIXME: This currently always toggles cell (0, 0).
    // How do we get the coordinate of the cell that was clicked on?
    // HINT: https://developer.mozilla.org/en-US/docs/Web/API/Event/target

    var cell = event.target;
    present.toggle(cell.coord);
    paint();
  }

  function paint() {
    // TODO:
    //   1. For each <td> in the table:
    //     a. If its cell is alive, give the <td> the `alive` CSS class.
    //     b. Otherwise, remove the `alive` class.
    //
    // To find all the <td>s in the table, you might query the DOM for them, or you
    // could choose to collect them when we create them in createTable.
    //
    // HINT:
    //   https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    //   https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName

    tableArray.forEach(function(td){
      var status = present.get(td.coord);
      if (status){ td.setAttribute('class', 'alive');}
      else { td.setAttribute('class', 'dead');}
    });
  }

  function step(rules) {
    // Hello, destructuring assignment:
    //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    ;[present, future] = tick(present, future, rules);  // tick is from board.js

    paint();
  }

  function play() {
    // Start playing by running the `step` function
    // automatically repeatedly every fixed time interval
    game.intervalId = setInterval(game.step, 500);
    game.playing = true;

    // HINT:
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
  }

  function stop() {
    // TODO: Stop autoplay.
    // HINT:
    clearInterval(game.intervalId);
    game.playing = false;

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval
  }

  function togglePlaying() {
    // TODO: If we're playing, stop. Otherwise, start playing.
    game.playing ? game.stop() : game.play();
    // if (game.playing){
    //   game.stop();
    // } else {
    //   game.play();
    // }
  }

  function clear() {
    step(() => 0);
    // stop();
    // present = new Board(width, height);
    // paint();
  }

  function random() {
    // TODO: Randomize the board
    step(() => Math.round(Math.random()));

  }

  return {play, step, stop, togglePlaying, random, clear};
}
