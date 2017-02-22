var vue_snake = new Vue({
	el: "#app",
	data: {
		snake: {
			direction: {x: +10,y: 0},
			parts: [{x:0,y:0}]	
		},
		crashed: false,
		loop: null,
		food: {x: 0,y: 0},
		width: 800,
		height: 400,
		pause: false
	},
	mounted: function() {
	},
	computed: {
		display: function() {
			if (this.crashed) return 'Crashed!';
			return this.score;
		},
		score: function() {
			return this.snake.parts.length-1;
		},
		head: function() {
			return this.snake.parts[0];
		},
		started: function() {
			return this.loop ? 'Restart' : 'Start';
		},
		paused: function() {
			return this.pause ? 'Continue' : 'Pause';
		}
	},
	methods: {
		add: function() {
			for (var i = 20; i >= 0; i--) {
				this.addPart();
			}
		},
		start: function() {
			if (this.loop)
				clearInterval(this.loop);
			this.snake.parts = [{
				x: this.random(this.width),
				y: this.random(this.height)
			}];
			this.crashed = false;
			this.pause = false;
			this.placeFood();
			var ref = this;
			this.loop = setInterval(function() {
				if (ref.pause) return;
				var head = prev = {
					x: ref.head.x + ref.snake.direction.x,
					y: ref.head.y + ref.snake.direction.y
				};
				if (prev.x < 0 ||
					prev.x >= ref.width ||
					prev.y < 0 ||
					prev.y >= ref.height) {
					clearInterval(ref.loop);
					ref.crashed = true;
					return;
				}
				if (prev.x == ref.food.x && prev.y == ref.food.y) {
					ref.addPart();
				}
				ref.snake.parts.forEach(function(p) {
					if (head.x == p.x && head.y == p.y) {
						clearInterval(ref.loop);
						ref.crashed = true;
					}
					var tmp = {
						x: p.x,
						y: p.y
					}
					p.x = prev.x;
					p.y = prev.y;
					prev = tmp;
				});
			}, 100);
		},
		togglePause: function() {
			this.pause = !this.pause;
		},
		addPart: function() {
			var tail = this.snake.parts[this.score];
			this.snake.parts.push({
				x: tail.x,
				y: tail.y
			});
			this.placeFood();
		},
		placeFood: function() {
			this.food.x = this.random(this.width);
			this.food.y = this.random(this.height);
		},
		random: function(max) {
			return Math.round(Math.random() * (max-10)/10) * 10;
		},
		move: function(_x, _y) {
			if (_x && !this.snake.direction.x) {
				this.snake.direction.x = _x;
				this.snake.direction.y = 0;
			}
			if (_y && !this.snake.direction.y) {
				this.snake.direction.x = 0;
				this.snake.direction.y = _y;
			}
		}
	}
});
