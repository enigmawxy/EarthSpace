window.onload = function() {
	var canvas = document.getElementById("show"),
		context = canvas.getContext("2d"),
		width = canvas.width,
		height = canvas.height,
		// 随机产生起始点，技术点和控制点
		p0 = {
			x: utils.randomRange(0, width),
			y: utils.randomRange(0, height)
		},
		p1 = {
			x: utils.randomRange(0, width),
			y: utils.randomRange(0, height)
		},
		p2 = {
			x: utils.randomRange(0, width),
			y: utils.randomRange(0, height)
		},
		p3 = {
			x: utils.randomRange(0, width),
			y: utils.randomRange(0, height)
		},
		t=0, dir = 0.005,
		pFinal = {};
	context.font = "11px Arial";

	draw();

	function draw() {
		context.clearRect(0, 0, width, height);

		// 绘制起点、结束点
		utils.drawPoint(context, p0, 'green', 'start', 5);
		utils.drawPoint(context, p3, 'green', 'end', 5);
		utils.drawPoint(context, p1, 'red', 'c1', 5);
		utils.drawPoint(context, p2, 'red', 'c2', 5);

		context.beginPath();
		context.lineCap='round';
		context.lineWidth=3;
		context.moveTo(p0.x, p0.y);
		context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
		context.stroke();

		utils.cubicBezier(p0, p1, p2, p3, t, pFinal);
		utils.drawPoint(context, pFinal, 'blue', '', 10);

		context.fillStyle='black';

		t += dir;
		if( t >1 || t < 0) {
			dir = -dir;
		}

		requestAnimationFrame(draw);
	}
};