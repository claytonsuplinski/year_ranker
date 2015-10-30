var years = [];
var ranks = [];
$.ajax({
		url: "./assets/data/songs.csv",
		dataType: "text",
		async: true,
		success: function (data){
			var lines = data.split("\n");
			lines.forEach(function(line, index){
				var elements = line.replace(/(\r\n|\n|\r)/gm,"").split(",");
				if(index == 0){
					elements.forEach(function(year){
						years.push(new Year(year));
					});
				}
				else{
					var rank = new Rank(index);
					elements.forEach(function(song, year){
						var tmp_song = new Song(song, index);
						years[year].add_song(tmp_song);
						rank.add_song(tmp_song);
					});
					rank.songs = randomize_array(rank.songs);
					ranks.push(rank);
				}
			});
			select_rank(50);
			update_top_navbar();
		}
});

function update_top_navbar(){
	var tmp = "<table><tr>";
	years.sort(function (a, b){
		if (a.score > b.score){return -1;}
		if (a.score < b.score){return 1;}
		return 0;
	});
	years.forEach(function(year){
		tmp += '<td><span class="year-name">'+year.name+'</span> '+year.score+'</td>';
	});
	tmp += "</tr></table>";
	$("#year-list").html(tmp);
	select_rank(curr_rank.name);
	update_leaderboard();
}

function update_leaderboard(){
	$('#leaderboard-modal .modal-body .column-1, #leaderboard-modal .modal-body .column-2').html('');
	years.forEach(function(year, index){
		$('#leaderboard-modal .modal-body .column-'+(index <= years.length/2 ? '1' : '2')).append(
		'<div class="row">'+
			'<div class="col-xs-6 leaderboard-year">'+year.name+'</div>'+
			'<div class="col-xs-6 leaderboard-score">'+year.score+'</div>'+
		'</div>'
		);
	});
}

function update_bottom_navbar(){
	var tmp = "<table><tr>";
	for(var i=50; i>=1; i--){
		tmp += '<td onclick="select_rank('+i+');">'+i+'</td>';
	}
	tmp += "</tr></table>";
	$("#rank-list").html(tmp);
}
update_bottom_navbar();

var curr_rank = "";
function select_rank(rank){
	$("#title").html(rank);
	var curr_ranks = ranks.filter(function(r){return r.name == rank;});
	if(curr_ranks.length > 0){
		curr_rank = curr_ranks[0];
		$("#content").html("");
		curr_rank.songs.forEach(function(song){
			var tmp_split = song.name.split(" - ");
			var song_name = tmp_split[0];
			var singer_name = tmp_split[1];
			$("#content").append(
				'<div class="col-md-4 col-xs-12" onclick="curr_rank.increment('+song.year.name+');">'+
					(song.score > 0 ? 
						'<div class="song-score">+'+song.score+'</div>'+
						'<div class="btn btn-selected col-xs-12">'+song_name+'<br><span class="singer-name">'+singer_name+'</span></div>'
						:
						'<div class="btn btn-selector col-xs-12">'+song_name+'<br><span class="singer-name">'+singer_name+'</span></div>'
					)+
				'</div>'
			);
		});
	}
	$("#content").append(
		'<div class="col-xs-12">'+
			'<div class="btn btn-clear col-xs-12" onclick="curr_rank.clear_scores();">Clear Scores</div>'+
		'</div>'
	);
}

function randomize_array(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

function image_search(query){
	$.getJSON("https://ajax.googleapis.com/ajax/services/search/images?v=1.0&callback=?&tbs=itp:face,isz:m&q="+query, function(results){
		var img = new Image();
		img.src = results.responseData.results[0].url;
		$("#content-images").append(img);
	});
}

$(document).keypress(function(e){
	switch(e.keyCode){
		case 37: //Left Arrow
			if(curr_rank.name < 50){
				select_rank(curr_rank.name+1);
			}
			break;
		case 39: //Right Arrow
			if(curr_rank.name > 1){
				select_rank(curr_rank.name-1);
			}
			break;
		default:
			break;
	}
});