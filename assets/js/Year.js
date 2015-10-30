function Year(name){
	this.name = name;
	this.songs = "";
	this.score = 0;
};

Year.prototype.add_song = function(song){
	if(this.songs == ""){
		this.songs = [];
	}
	song.year = this;
	this.songs.push(song);
};

Year.prototype.get_song_from_rank = function(rank){
	var songs = this.songs.filter(function(song){
		return song.rank == rank;
	});
	return (songs.length > 0 ? songs[0] : -1);
};