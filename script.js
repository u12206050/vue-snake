var vue_snake = new Vue({
	el: "#app",
	data: {
		snake: {
			direction: {x: 0,y: 0},
			parts: [{x:0,y:0}]
		},
		crashed: false,
		loop: null,
		food: {x: 0,y: 0},
		width: 800,
		height: 400,
		pause: false,
		moved: false,
		size: 20
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
		start: function() {
			if (this.loop)
				clearInterval(this.loop);
			this.snake.parts = [{
				x: this.random(this.width),
				y: this.random(this.height)
			}];
			this.crashed = this.pause = this.moved = false;
			this.placeFood();
			this.snake.direction.x = this.size;
			this.snake.direction.y = 0;
			var ref = this;
			this.loop = setInterval(function() {
				if (!ref.moved)
					ref.forward();
				ref.moved = false;
			}, 100);
		},
		direction: function(i) {
			if (i) return 0;
			if (this.snake.direction.x > 0)
				return -45;
			if (this.snake.direction.x < 0)
				return 135;
			if (this.snake.direction.y > 0)
				return 45;
			if (this.snake.direction.y < 0)
				return -135;
		},
		forward: function() {
			if (this.pause) return;
			var head = prev = {
				x: this.head.x + this.snake.direction.x,
				y: this.head.y + this.snake.direction.y
			};
			if (prev.x == this.food.x && prev.y == this.food.y) {
				this.addPart();
			}
			var ref = this;
			this.snake.parts.forEach(function(p, i) {
				if (head.x == p.x && head.y == p.y && i > 0) {
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
			if (head.x < 0 ||
				head.x >= this.width ||
				head.y < 0 ||
				head.y >= this.height) {
				clearInterval(this.loop);
				this.crashed = true;
			}
			this.moved = true;
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
			return Math.round(Math.random() * (max-this.size)/this.size) * this.size;
		},
		move: function(_x, _y) {
			console.log('Move');
			if (_x && !this.snake.direction.x) {
				this.snake.direction.x = _x;
				this.snake.direction.y = 0;
				this.forward();
			}
			if (_y && !this.snake.direction.y) {
				this.snake.direction.x = 0;
				this.snake.direction.y = _y;
				this.forward();
			}
		}
	}
});
