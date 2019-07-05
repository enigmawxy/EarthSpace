window.onload = function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width ,
		height = canvas.height,
		p0 = {
			x: Math.random() * width,
			y: Math.random() * height
		},
		p1 = {
			x: Math.random() * width,
			y: Math.random() * height
		},
		p2 = {
			x: Math.random() * width,
			y: Math.random() * height
		},
		p3 = {
			x: Math.random() * width,
			y: Math.random() * height
		};

	utils.drawPoint(context, p0,'green', 'start', 3);
	utils.drawPoint(context, p1,'red', 'cp1', 3);
	utils.drawPoint(context, p2,'red', 'cp2', 3);
	utils.drawPoint(context, p3,'green', 'end', 3);

	// 绘制三阶贝塞尔曲线
	context.beginPath();
	context.moveTo(p0.x, p0.y);
	context.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
	context.stroke();

	// 绘制二阶贝塞尔曲线：由多个二阶曲线拼接起来
	context.strokeStyle = "red";
	context.beginPath();
	utils.multicurve([p0, p1, p2, p3], context);
	context.stroke();
	
};