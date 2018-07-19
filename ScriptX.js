	var
			canvas = document.getElementById('canvas'),
			ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight-100;

	alert("Сейчас Вам будут показаны круги с цифрами, у Вас будет 5 секунд, чтобы запомнить их порядок, после чего необходимо будет верно выбрать все цифры по порядку. Удачи!");


	var record = JSON.parse(localStorage.getItem('record'));
	if (!record){
		record = 0;
	}

		function status(stat){
			document.getElementById('status').innerHTML = stat;
		}
		

		
		function progress(time){
			var time = Math.round(time/100);
			var start = 0;
			var progressElem = document.getElementById('progress-bar');
			var intervalId = setInterval(function(){
				if (start > 100){
					clearInterval(intervalId);
				}
				else{
					progressElem.value = start;
				}
				
				start++;
			}, time);
		}

		progress(5000);


		//генерация случайных координат

		function getRandomInt(min, max) {
		  return Math.floor(Math.random() * (max - min)) + min;}

		function arcX() {
			return getRandomInt(0 + 2 * RADIUS,canvas.width - 2 * RADIUS);
		}

		function arcY() {
			return getRandomInt(70 + 2 * RADIUS,canvas.height - 2 * RADIUS);
		}

		var RADIUS = 50;
		ctx.fillStyle = '#008CBA';
		ctx.strokeStyle = 'white';
		var lvl = 1;
		var score = 0;

		function scoreshow(score){
			document.getElementById('score').innerHTML = score;
		}

		function lvlshow(lvl){
			document.getElementById('lvl').innerHTML = lvl;
		}

		function recordshow(record){
			document.getElementById('rec').innerHTML = record;
		}

		lvlshow("Уровень: "+lvl);	
		scoreshow("Очки: "+score);
		recordshow("Рекорд: "+record);
		

		//вычисление расстояния
		function d(x1,y1,x2,y2) {
			return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
		}
		
		//генерация уровня
		function createLvl () {
			var coords = [];
			for(var arcs = 1; arcs <= lvl + 3; arcs++){
				ctx.beginPath();
				var x = arcX();
				var y = arcY();
				//исключение пересечений кругов
				if (arcs > 1) {
					var i = 0;
					//for (i = 0; i < coords.length; i++){
					while (i < coords.length){
						var x1 = coords[i][0];
						var y1 = coords[i][1];
						//console.log('[',arcs,']',x,y, ' - ', x1,y1,'[',i,']');
						if (d(x1,y1,x,y) < RADIUS*3){
							//console.log('!');
							x = arcX();
							y = arcY();
							i = 0;
						}
						else i++;	
					}
				}


				coords.push([x,y]);

				//circles spawn
				ctx.fillStyle = '#008CBA';
				var realY = y-100; // учет блока таймера

				ctx.arc(x,realY, RADIUS, 0, Math.PI * 2);
				ctx.fill();

				//numbers spawn
				ctx.font = '50px Arial';
				ctx.fillStyle = 'white';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(arcs, x, realY);
				ctx.fillStyle = 'black';
			}
			localStorage.setItem('coords', JSON.stringify(coords));
		}

		function clear() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		function rightClick(x,y){
			//при клике цифра появляется:
			ctx.font = '50px Arial';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(clicknum, coords[clicknum-1][0], coords[clicknum-1][1]-100);
				ctx.fillStyle = 'black';
			//обводка зеленым:
			ctx.globalCompositeOperation = "destination-over";
			ctx.globalAlpha = .7;
			ctx.fillStyle = "green";
			ctx.beginPath();
			ctx.arc(x,y,RADIUS+10,0,Math.PI * 2);
			ctx.fill();
			ctx.globalCompositeOperation = "source-over";
			ctx.fillStyle = "black";
			ctx.globalAlpha = 1;
		}

		function loseClick(mouseX,mouseY){
			var arcNum = isOnCircle(mouseX,mouseY);
			var x = coords[arcNum-1][0];
			var y = coords[arcNum-1][1];

			//при клике цифра появляется:
			ctx.font = '50px Arial';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(arcNum, x, y-100);
			ctx.fillStyle = 'black';
			//обводка красным:
			ctx.globalCompositeOperation = "destination-over";
			ctx.globalAlpha = .7;
			ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.arc(x,y-100,RADIUS+10,0,Math.PI * 2);
			ctx.fill();
			ctx.globalCompositeOperation = "source-over";
			ctx.fillStyle = "black";	
			ctx.globalAlpha = 1;	
		}

		function hideNumbers() {
			coords = JSON.parse(localStorage.getItem('coords'));
			ctx.fillStyle = '#008CBA';
			for(var i = 0; i < coords.length; i++){
				ctx.beginPath();
				ctx.arc(coords[i][0],coords[i][1]-100, RADIUS-1, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		function newrecord(){
			alert("Новый рекорд: "+record+'!');
		}


		function timer(){
			document.getElementById('out').innerHTML = time;
			console.log(time);
			time--;

			if(time < 0){
				hideNumbers();
				status("Где круг номер 1?");
				document.getElementById('out').innerHTML = ' ';
		



			}
			else {
				tr = setTimeout(timer,1000);
			}
		}


		createLvl();

		var time = 5;
		var tr;

		timer();


		function isOnCircle(mouseX, mouseY){
			coords = JSON.parse(localStorage.getItem('coords'));
			for(var i = 0; i < coords.length; i++){
				var x1 = coords[i][0];
				var y1 = coords[i][1];
				if (d(x1,y1,mouseX,mouseY) <= RADIUS){
					return i+1;
				}
			}
			return false;			
		}

		var clicknum = 1;

		function nextLvl() {
						flag = 0;
						status(' ');
						console.log("You win!");
						clear();
						lvl++;
						createLvl();
						time = 5;
						progress(5000);
						timer();
						clicknum = 1;
						lvlshow("Уровень: "+lvl);			
		}

		function reload(){
			window.location.reload();
		}

		//отработка кликов
			canvas.addEventListener('click', function(e){
			if (time < 0){
			console.log("waiting for click...");
			var mouseX = e.pageX;
				mouseY = e.pageY;

			console.log('x:'+mouseX+' y:'+mouseY);

			if(isOnCircle(mouseX, mouseY) != false) {

				console.log("Click on circle "+isOnCircle(mouseX, mouseY));

				if(isOnCircle(mouseX,mouseY) == clicknum){
					//обводка зеленым:
					rightClick(coords[clicknum-1][0], coords[clicknum-1][1]-100);
					score+=100;
					scoreshow("Очки: "+score);

					if(clicknum < lvl+3){
						var next = clicknum+1;
						
						setTimeout(status("Где круг номер "+next+"?"),3000);
						console.log("Great! Next point is ",clicknum+1);
						clicknum++;

					}
					else {
						var tr1;
						tr1 = setTimeout(nextLvl,500);
					}
				}
				else{
						loseClick(mouseX,mouseY);
						status("Неверно!");
						if (score > record){
							record = score;
							window.setTimeout(newrecord, 1000);
							localStorage.setItem('record', JSON.stringify(record));
						}
						clicknum = 1;
						setTimeout(reload, 3000);
					}
			}

			}
		})



		/*//'Z' - переход на следующий уровень(для отладки)
		document.addEventListener('keydown',function(e){
			if (e.keyCode == 90)
			{
				clear();
				lvl++;
				createLvl();
			}
		})

		//'X' - скрыть цифры
		document.addEventListener('keydown',function(e){
			if (e.keyCode == 88)
			{
				hideNumbers();
			}
		})

		//'С' - cброс рекорда
		document.addEventListener('keydown',function(e){
			if (e.keyCode == 67)
			{
				record = 0;
				localStorage.setItem('record', JSON.stringify(record));
			}
		})*/
