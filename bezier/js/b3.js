window.onload = function() {
	var canvas = document.getElementById("show"),
		context = canvas.getContext("2d"),
		width = canvas.width,
		height = canvas.height,

		// 随机产生起始点，技术点和控制点
		p0 = {
			x: utils.randomRange(0, width),
			y: utils.randomRange(0, height),
			radius: 5,
			color: 'gray',
			tag: 'start'
		},
		p1 = {
			x: utils.randomRange(0, width),
			y: utils.randomRange(0, height),
			radius: 5,
			color: 'red',
			tag: 'c1'
		},
		p2 = {
			x: utils.randomRange(0, width),
			y: utils.randomRange(0, height),
			radius: 5,
			color: 'red',
			tag: 'c2'
		},
		p3 = {
			x: utils.randomRange(0, width),
			y: utils.randomRange(0, height),
			radius: 5,
			color: 'gray',
			tag: 'end'
		},
		points = [p0, p1, p2, p3],
		offset = {},
		isDragging = false,
		dragHandle,
		t=0, dir = 0.005,
		pFinal = {};

	context.font = "11px Arial";

	draw();

	canvas.addEventListener("mousedown", function (event) {
		console.log(event);
		for(var i= 0; i < 4; i +=1 ) {
			var point = points[i];
			if(utils.circlePointCollision(event.clientX, event.clientY, point)) {
				isDragging = true;
				canvas.addEventListener("mousemove", onMouseMove);
				canvas.addEventListener("mouseup", onMouseUp);
				dragHandle = point;
				offset.x = event.clientX - point.x;
				offset.y = event.clientY - point.y;
			}
		}
	});

	function onMouseMove(event) {
		dragHandle.x = event.clientX - offset.x;
		dragHandle.y = event.clientY - offset.y;
	}

	function onMouseUp(event) {
		canvas.removeEventListener("mousemove", onMouseMove);
		canvas.removeEventListener("mouseup", onMouseUp);
		isDragging = false;
	}

	function draw() {
		context.clearRect(0, 0, width, height);

		for(var i = 0; i < 4; i += 1) {
			var handle = points[i];

			if(isDragging && handle === dragHandle) {
				context.shadowColor = "black";
				context.shadowOffsetX = 4;
				context.shadowOffsetY = 4;
				context.shadowBlur = 8;
			}

			utils.drawPoint(context, handle);

			context.shadowColor = null;
			context.shadowOffsetX = null;
			context.shadowOffsetY = null;
			context.shadowBlur = null;
		}

		context.beginPath();
		context.strokeStyle='gray';
		context.lineCap='round';
		context.lineWidth = 2;
		context.moveTo(p0.x, p0.y);
		context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		context.stroke();

		utils.cubicBezier(p0, p1, p2, p3, t, pFinal);
		pFinal.radius = 10;
		pFinal.color = 'blue';
		pFinal.tag = '';
		utils.drawPoint(context, pFinal);

		context.fillStyle='black';

		t += dir;
		if( t >1 || t < 0) {
			dir = -dir;
		}

		requestAnimationFrame(draw);
	}
};