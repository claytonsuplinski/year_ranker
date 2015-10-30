function Rank(name){
	this.name = name;
	this.songs = "";
	this.increment_amount = 5;
};

Rank.prototype.add_song = function(song){
	if(this.songs == ""){
		this.songs = [];
	}
	song.rank = this;
	this.songs.push(song);
};

Rank.prototype.increment = function(year){
	var self = this;
	var tmp_songs = this.songs.filter(function(s){return s.year.name == year;});
	tmp_songs.forEach(function(s, i){
		if(s.score == 0 && i == 0){
			s.score =       self.increment_amount;
			s.year.score += self.increment_amount;
			self.increment_amount--;			
		}
	});
	update_top_navbar();
};

Rank.prototype.clear_scores = function(){
	var self = this;
	this.songs.forEach(function(song){
		song.year.score -= song.score;
		song.score = 0;
		self.increment_amount = 5;
	});
	update_top_navbar();
};

/*
Rank.prototype.set_background_color = function(){
	switch(this.increment_amount){
		case 5:
			$("body").css("background", "white");
			break;
		case 4:
			$("body").css("background", "gold");
			break;
		case 3:
			$("body").css("background", "silver");
			break;			
		case 2:
			$("body").css("background", "rgb(205, 127, 50)");
			break;			
		case 1:
			$("body").css("background", "steelblue");
			break;
		case 0:
			$("body").css("background", "skyblue");
			break;
		default:
			$("body").css("background", "red");
			break;
	}
};
*/