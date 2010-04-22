function jqetris(selector) {

	var jq = this;
	var maxX = 10;
	var maxY = 20;
	var gravity = 1000; // milliseconds
	var totalLines = 0;
	var points = 0;
	var level = 1;
	var pointsForLines = [0, 40, 100, 300, 1200];
	var timer = null;
	var m = new Array(maxX);
	var divs = new Array(maxX);
	var piece = null;
	var pieces = [ S, Z, O, I, L, J, T ];
	var main = selector;
	
	for ( var i = 0; i < maxX; i++) {
		m[i] = new Array(maxY);
		divs[i] = new Array(maxY);
		for ( var j = 0; j < maxY; j++) {
			m[i][j] = 0;
		}
	}
	
	init();

	function block(x, y) {
		this.x = x;
		this.y = y;
		this.div = $('<div>').addClass('piece');
		this.div.css('left', (this.x * 30) + 'px');
		this.div.css('top', (this.y * 30) + 'px');

		this.move = function(pos) {
			this.x += pos[0];
			this.y += pos[1];
			m[this.x][this.y] = m[this.x][this.y] == 2 ? 2 : 0;
			this.div.css('left', (this.x * 30) + 'px');
			this.div.css('top', (this.y * 30) + 'px');
		};
		this.moves = function(pos) {
			var x = this.x + pos[0];
			var y = this.y + pos[1];
			return x >= 0 && y >= 0 && x < maxX && y < maxY
					&& m[x][y] != 1;
		};

		this.rotate = function(pos) {
			this.x += pos[0];
			this.y += pos[1];
			m[this.x][this.y] = m[this.x][this.y] == 2 ? 2 : 0;
			this.div.css('left', (this.x * 30) + 'px');
			this.div.css('top', (this.y * 30) + 'px');
		};
	}

	function Piece(blocks, states) {

		var state = 0;
		var states = states;
		var blocks = blocks;
		var shifts = {
			left : [ -1, 0 ],
			right : [ 1, 0 ],
			down : [ 0, 1 ]
		};
		
		this.getBlocks = function() {
			return blocks;
		};

		this.rotate = function() {
			var state2 = state == 3 ? 0 : state + 1;
			var pos = states[state2];
			var canMove = true;
			$.each(blocks, function(i, b) {
				if (!(canMove = b.moves(pos[i])))
					return false;
			});
			if (canMove) {
				$.each(blocks, function(i, b) {
					b.rotate(pos[i]);
				});
				state = state2;
			}
		};

		this.display = function(selector) {
			$.each(blocks, function(i, b) {
				$(selector).append(b.div);
			});
		};

		this.freeze = function() {
			// change values 2 in matrix to 1, so we know it's no longer the
			// current piece
			$.each(blocks, function(i, b) {
				m[b.x][b.y] = 1;
				divs[b.x][b.y] = b.div;
			});
		};

		this.move = function(direction) {
			var canMove = true;
			$.each(blocks, function(i, b) {
				if (!(canMove = b.moves(shifts[direction])))
					return false;
			});
			if (canMove) {
				$.each(blocks, function(i, b) {
					b.move(shifts[direction]);
				});
			}
			return canMove;
		};
	}

	// S piece
	function S() {
		var b1 = new block(4, 1);
		var b2 = new block(5, 1);
		var b3 = new block(5, 0);
		var b4 = new block(6, 0);
		var blocks = [ b1, b2, b3, b4 ];
		// relative positions to previous state
		var states = [ [ [ -1, -1 ], [ 0, 0 ], [ 1, -1 ], [ 2, 0 ] ],
				[ [ 1, 1 ], [ 0, 0 ], [ -1, 1 ], [ -2, 0 ] ],
				[ [ -1, -1 ], [ 0, 0 ], [ 1, -1 ], [ 2, 0 ] ],
				[ [ 1, 1 ], [ 0, 0 ], [ -1, 1 ], [ -2, 0 ] ] ];
		$.each(blocks, function(i, b) {
			b.div.addClass('piece_s');
		});
		this.inner = new Piece(blocks, states);
	}
	// Z piece
	function Z() {
		var b1 = new block(4, 0);
		var b2 = new block(5, 0);
		var b3 = new block(5, 1);
		var b4 = new block(6, 1);
		var blocks = [ b1, b2, b3, b4 ];
		// relative positions to previous state
		var states = [ [ [ -1, 1 ], [ 0, 0 ], [ 1, 1 ], [ 2, 0 ] ],
				[ [ 1, -1 ], [ 0, 0 ], [ -1, -1 ], [ -2, 0 ] ],
				[ [ -1, 1 ], [ 0, 0 ], [ 1, 1 ], [ 2, 0 ] ],
				[ [ 1, -1 ], [ 0, 0 ], [ -1, -1 ], [ -2, 0 ] ] ];
		$.each(blocks, function(i, b) {
			b.div.addClass('piece_z');
		});
		this.inner = new Piece(blocks, states);
	}
	// I piece
	function I() {
		var b1 = new block(3, 0);
		var b2 = new block(4, 0);
		var b3 = new block(5, 0);
		var b4 = new block(6, 0);
		var blocks = [ b1, b2, b3, b4 ];
		// relative positions to previous state
		var states = [ [ [ -1, 1 ], [ 0, 0 ], [ 1, -1 ], [ 2, -2 ] ],
				[ [ 1, -1 ], [ 0, 0 ], [ -1, 1 ], [ -2, 2 ] ],
				[ [ -1, 1 ], [ 0, 0 ], [ 1, -1 ], [ 2, -2 ] ],
				[ [ 1, -1 ], [ 0, 0 ], [ -1, 1 ], [ -2, 2 ] ] ];
		$.each(blocks, function(i, b) {
			b.div.addClass('piece_i');
		});
		this.inner = new Piece(blocks, states);
	}
	// O piece
	function O() {
		var b1 = new block(4, 0);
		var b2 = new block(4, 1);
		var b3 = new block(5, 0);
		var b4 = new block(5, 1);
		var blocks = [ b1, b2, b3, b4 ];
		// relative positions to previous state - cheating :)
		var states = [ [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ],
				[ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ],
				[ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ],
				[ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ] ];
		$.each(blocks, function(i, b) {
			b.div.addClass('piece_o');
		});
		this.inner = new Piece(blocks, states);
	}
	// L piece
	function L() {
		var b1 = new block(4, 1);
		var b2 = new block(4, 0);
		var b3 = new block(5, 0);
		var b4 = new block(6, 0);
		var blocks = [ b1, b2, b3, b4 ];
		// relative positions to previous state
		var states = [ [ [ -2, 0 ], [ -1, -1 ], [ 0, 0 ], [ 1, 1 ] ],
				[ [ 0, -2 ], [ 1, -1 ], [ 0, 0 ], [ -1, 1 ] ],
				[ [ 2, 0 ], [ 1, 1 ], [ 0, 0 ], [ -1, -1 ] ],
				[ [ 0, 2 ], [ -1, 1 ], [ 0, 0 ], [ 1, -1 ] ] ];
		$.each(blocks, function(i, b) {
			b.div.addClass('piece_l');
		});
		this.inner = new Piece(blocks, states);
	}
	// J piece
	function J() {
		var b1 = new block(4, 0);
		var b2 = new block(5, 0);
		var b3 = new block(6, 0);
		var b4 = new block(6, 1);
		var blocks = [ b1, b2, b3, b4 ];
		// relative positions to previous state
		var states = [ [ [ -1, -1 ], [ 0, 0 ], [ 1, 1 ], [ 0, 2 ] ],
				[ [ 1, -1 ], [ 0, 0 ], [ -1, 1 ], [ -2, 0 ] ],
				[ [ 1, 1 ], [ 0, 0 ], [ -1, -1 ], [ 0, -2 ] ],
				[ [ -1, 1 ], [ 0, 0 ], [ 1, -1 ], [ 2, 0 ] ] ];
		$.each(blocks, function(i, b) {
			b.div.addClass('piece_j');
		});
		this.inner = new Piece(blocks, states);
	}
	// T piece
	function T() {
		var b1 = new block(4, 0);
		var b2 = new block(5, 0);
		var b3 = new block(6, 0);
		var b4 = new block(5, 1);
		var blocks = [ b1, b2, b3, b4 ];
		// relative positions to previous state
		var states = [ [ [ -1, -1 ], [ 0, 0 ], [ 1, 1 ], [ -1, 1 ] ],
				[ [ 1, -1 ], [ 0, 0 ], [ -1, 1 ], [ -1, -1 ] ],
				[ [ 1, 1 ], [ 0, 0 ], [ -1, -1 ], [ 1, -1 ] ],
				[ [ -1, 1 ], [ 0, 0 ], [ 1, -1 ], [ 1, 1 ] ] ];
		$.each(blocks, function(i, b) {
			b.div.addClass('piece_t');
		});
		this.inner = new Piece(blocks, states);
	}

	function randomPiece() {
		return pieces[Math.floor(Math.random() * pieces.length)];
	}

	function startNewPiece() {
		piece = new (randomPiece())();
		$.each(piece.inner.getBlocks(), function(i, b) {
			if(b.moves([0,0])) {
				return false;
			}
		});
		piece.inner.display(main);
		return true;
	}

	function clearLines() {
		// check the rows that the current piece is sitting on
		var pos = [];
		$.each(piece.inner.getBlocks(), function(i, b) {
			if ($.inArray(b.y, pos) == -1)
				pos.push(b.y);
		});
		pos.sort(function(a, b) {
			return a - b;
		});
		var numlines = 0;
		for ( var rows = 0; rows < pos.length; rows++) {
			var row = pos[rows];
			var complete = true;
			for ( var x = 0; x < maxX; x++) {
				if (m[x][row] != 1) {
					complete = false;
					break;
				}
			}
			if (complete) {
				numlines++;
				// shift all rows above down one
				for ( var x = 0; x < maxX; x++) {
					for ( var y = row; y > 0; y--) {
						m[x][y] = m[x][y - 1];
						if (y == row)
							$(divs[x][y]).remove();
						divs[x][y] = divs[x][y - 1];
						$(divs[x][y]).css('top', (y * 30) + 'px');
					}
					m[x][0] = 0;
					divs[x][0] = null;
				}
			}
		}
		totalLines += numlines;
		levelLines += numlines;
		points += (level * (pointsForLines[numlines]));
		$('#points').html(points);
		$('#level').html(level);
		if(levelLines >= 10) {
			levelLines -= 10;
			increaseLevel();
		}
	}
	
	var delay = 750;
	var levelLines = 0;
	
	function increaseLevel() {
		level++;
		if(level < 10) {
			delay -= 75;
			$('#level').html(level);
		}
	}
	
	function startTimer() {
		timer = setInterval(function() {
			moveDown();
		}, delay);
	}
	function stopTimer() {
		clearInterval(timer);
	}

	function moveDown () {
		var moves = piece.inner.move('down');
		if (!moves) {
			piece.inner.freeze();
			clearLines();
			startNewPiece();
		}
		stopTimer();
		startTimer();
		return moves;
	}

	function init() {
		startNewPiece();
		startTimer();
		
		// need to handle different keystroke behaviors between firefox and chrome
		var pressed = false;
		$(document).keydown(function(e) {
			if(e.keyCode) {
				handleKey(e.keyCode);
				pressed = true;
			}
		});
		$(document).keypress(function(e) {
			if(!pressed) {
				var k = e.keyCode ? e.keyCode : e.charCode;
				handleKey(k);
			}
			else pressed = false;
		});
		
		function handleKey(k) {
			// 38 = up, 37 = left, 39 = right, 40 = down, 32 = space
			if (k == 37)
				piece.inner.move('left');
			else if (k == 39)
				piece.inner.move('right');
			else if (k == 38)
				piece.inner.rotate();
			else if (k == 40)
				moveDown();
			else if (k == 32)
				while(moveDown());
		}
	}
}