		function loadJSON(path, success, error)
		{
		    var xhr = new XMLHttpRequest();
		    xhr.onreadystatechange = function()
		    {
		        if (xhr.readyState === 4) {
		            if (xhr.status === 200) {
		                if (success)
		                    success(JSON.parse(xhr.responseText));
		            } else {
		                if (error)
		                    error(xhr);
		            }
		        }
		    };
		    xhr.open("GET", path, true);
		    xhr.send();
		}

		function alpha(a,b){ if (a.highscore == b.highscore) return a.user > b.user; else return a.highscore < b.highscore;}

		function fillHighScores(hscores) {
			var json = hscores;
			var tr;
			var len;

			json.sort(alpha);
			
			if( json.length < 20 )
				len = json.length;
			else if(json.length >= 20 )
				len = 20;
			
			for (var i = 0; i < len; i++) {
					tr = $('<tr/>');
					j = i + 1;
					tr.append("<td id='table' class='tabler'>" + j + "</td>");
	 	        		tr.append("<td id='table' class='table' >" + json[i].user + "</td>");
		        		tr.append("<td id='table' class='table' >" + json[i].highscore + "</td>");		        
		        		$('table').append(tr);
		       		}
			}

		function json_loaded(json_array) {
			document.getElementById("highScoreTable").style.display = "block";
			hscores = json_array
			fillHighScores(hscores)
		}

		function json_error(xhr) {
			document.getElementById("highscore-header").innerHTML = "<b>Unable to load Highscores!</b>"
		}

		function sendScore(_username, score) {
			
			var xhr = new XMLHttpRequest();

			var param = "user="+_username+"&highscore="+score;
			xhr.open("POST","http://web.iiit.ac.in/~hitesh.sharma/process.php",true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send(param);
		
		}
		
		bd = [];
		img = document.getElementById("bg1");
		bd[1] = document.getElementById("b1");
		bd[2] = document.getElementById("b2");
	        bd[3] = document.getElementById("b3");
		bd[4] = document.getElementById("bd4");	
		up = document.getElementById("pillup");
		down = document.getElementById("pilldown");
		over = document.getElementById("over");
		document.getElementById("userimg").onclick = function(){ localStorage.clear();refreshPage(); };
		main = document.getElementById("main");		

		var bd;
                var ctx;
                var c;
		var hscores = [];
                var bwidth;
                var bheight;
                var tfactor;
                var startpos;
                var startx;
                var gap;
                var _username;
                var score;
                var bird;
                var h_down;
                var h_up;
                var i;
                var y;
                var state;
                var incu;
                var pillars;
                var count;
                var incd;
                var pos;
                var next;
                var posx;
                var posy;

		function refreshPage()
		{
			location.reload();
		}
		function initialize()
		{
//		alert("Initializing");
		ctx = document.getElementById("draw");
                c = ctx.getContext("2d");

                bwidth = 60;
                bheight = 60;
                tfactor = 10;
                startpos = 100;
                startx = 500;
                gap = 145;
                window.innerWidth = 1291;
                window.innerHeight = 647;
                b_icon = bd[1];
                score = 0;
                bird = 0;
                h_down = 0;
                h_up = 0;
                i = 0;
                y = 600;
                state = 21;
                incu = 10;
                pillars = [];
                count = 0;
                incd = 15;
                pos = 0;
                next = 0;
      	 	posx = 100;
 	        posy = 200;
		}
		

		function clear()
		{
			alert("Clearing");
			localStorage.clear();
		}
		function pressed()
		{
			state = 0;
			incu = 20;
		}
		function draw()
		{	
			for( k = 0; k < 5 ; k++ )
			{
				h_down = geth();
 	                        h_up = 609 - ( h_down + gap );
				pillars[count++] = [ startx,0,80,h_down ];
				pillars[count++] = [ startx,(h_down+gap),80,h_up ];
				startx+=300;
			}
			var len = pillars.length ;
			for( k = 0 ; k < len ; k+=2)
			{
				c.drawImage(down,pillars[k][0],pillars[k][1],pillars[k][2],pillars[k][3]);
				c.drawImage(up,pillars[k+1][0],pillars[k+1][1],pillars[k+1][2],pillars[k+1][3]);
			}
				
			if( posx > pillars[next][0] + 80 )
			{
					score++;
					document.getElementById("score").innerHTML = score;
					next+=2;
			}
			
			if( posx + bwidth >= pillars[next][0]+5 && (( posy <= pillars[next][3] ) || ( posy + bheight >= 609 - pillars[next+1][3] )))
			{	
				clearInterval(game);
				gameover();
			}
			
				
		}
		function geth()
		{
			var x = Math.floor(Math.random() * 300 + 1);	
			if ( x < 100 )
				x = 200 + x%100;
			return x;
		}
		function run()
		{
			c.clearRect(0,0,1000000,1000);
			i++;
			state++;
			c.translate(-(tfactor),0);
			draw();
			c.beginPath();
			if(state > 8)
				posy+=(incd+=1);
			else	
			{
				incu-=3;	
				incd = 10;
				posy-=(incu);
			}
			posx = startpos + tfactor*i;
			c.drawImage(b_icon,posx,posy,bwidth,bheight);
			c.fill();
		}
		function choosebird()
		{
			c.font = "30px Arial";
			c.fillText("Choose Your Bird",100,100);
		}
		function begin()
		{
		//	document.getElementById("highScoreTable").style.display = "none"
			if(localStorage.name === undefined) {
                                _username = prompt("Enter your name");
                                while(_username.trim() == "") {
                                	_username =prompt("Please Enter a Valid Name")
                                } 
				localStorage.name = _username;
				document.getElementById("usr").innerHTML = "User : "+localStorage.name;
                        }
			else
			{
				document.getElementById("usr").innerHTML = "User : "+localStorage.name;
				_username = localStorage.name;
			}
			
			loadJSON("http://web.iiit.ac.in/~hitesh.sharma/process.php",json_loaded, json_error);
			initialize();
			startgame();
		}
		function check(event)
		{
			if(event.keyCode == 83)
			{
				refreshPage();
			}
		}
		function startgame()
		{
			main.style.backgroundImage = "url('./images/backoil.jpeg')";
			game = setInterval(run,40);
		}
		function dropbird()
		{
			c.clearRect(0,0,100000,1000);
			c.drawImage(b1,posx,posy,bwidth,bheight);
			posy+=1;
			setTimeout(dropbird,1);
		}
		function gameover()
		{
			c.drawImage(over,100+10*i+50,200,250,150);
			main.style.backgroundImage = "url('./images/backoil2.jpeg')";
			sendScore(_username, score);
		}
	
		function animate(e)
		{	
  			document.getElementById("insbody").style.animationName = "";
            		document.getElementById("insbody").style.animationDuration = "";
			document.getElementById("insbody").style.animationName = "move";
			document.getElementById("insbody").style.animationDuration = "1.2s";
			document.getElementById("insbody").style.left = "15px";
		}
		function remove()
		{
			document.getElementById("insbody").style.animationName = "";
			document.getElementById("insbody").style.animationDuration = "";
			document.getElementById("insbody").style.animationName = "remove";
			document.getElementById("insbody").style.animationDuration = "1.2s";
			document.getElementById("insbody").style.left = "-400px";		
		}
		function callme()
		{
			remove();
		}
