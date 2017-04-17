function renderShowSteps() {

	 context.beginPath();
	 context.fillStyle = '#222222';
	 context.strokeStyle = '#333333';
	 context.lineWidth = 3;
	 context.arc(canvas.width  * 0.5, canvas.height * 7.5 / 10, clockRadiusX * 0.22, 0, Math.PI * 2, false);
	 context.stroke();
	 context.fill();
	 context.closePath();
	 
	 context.beginPath();
	 context.fillStyle = '#222222';
	 context.strokeStyle = '#333333';
	 context.arc(canvas.width  * 0.35, canvas.height * 7.5 / 10, clockRadiusX * 0.15, 0, Math.PI * 2, false);
	 context.stroke();
	 context.fill();
	 context.closePath();

	// Steps Start
	// --------------------------------------------------------

	// var c = document.getElementById("imgWeatherIcon");

	// c.style.visibility = 'visible';

	context.beginPath();
	context.fillStyle = '#FFFFFF';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '15px monospace';

	if (steps != undefined) {
		// c.src = "icons\\" + temperatureId + ".png";

		// Steps

		context.fillText("Steps", canvas.width * 0.5,
				canvas.height * 7.1 / 10);
		context.font = '20px monospace';
		context.fillText(steps, canvas.width * 0.5,
				canvas.height * 7.7 / 10);

		// Calories
		context.font = '15px monospace';
		context.fillText("Cal", canvas.width * 0.35,
				canvas.height * 7.1 / 10);
		context.font = '15px monospace';
		context.fillText(calories, canvas.width * 0.35,
				canvas.height * 7.7 / 10);

	}
	context.fill();
	context.closePath();
	// Steps End

}
