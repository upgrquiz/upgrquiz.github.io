const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores
  .map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");

  var setTheme = localStorage.getItem('theme')
		console.log('theme:', setTheme)

		if (setTheme == null){
			swapStyle('app.css')
		}else{
			swapStyle(setTheme)
		}

		function swapStyle(sheet){
			document.getElementById('mystylesheet').href = sheet
			localStorage.setItem('theme', sheet)
		}
