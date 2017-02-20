var GET_RELATED_SUCCESS = "GET_RELATED_SUCCESS";
var getRelatedSuccess = function(artist) {
    return {
        type: GET_RELATED_SUCCESS,
      	artist: artist
    }
}

var GET_RELATED_ERROR = "GET_RELATED_ERROR";
var getRelatedError = function() {
    return {
        type: GET_RELATED_ERROR
    }

}

var TOP_TRACKS_SUCCESS = "TOP_TRACKS_SUCCESS";
var topTracksSuccess = function(name, tracks, image){
	return{
		type: TOP_TRACKS_SUCCESS,
		name: name,
		tracks: tracks,
        image: image
	}
}

var GET_ARTIST_ERROR = "GET_ARTIST_ERROR";
var getArtistError = function(str){
    return{
        type: GET_ARTIST_ERROR,
        str: str
    }
}

var RESET_STATE = "RESET_STATE";
var resetState = function(){
    return{
        type: RESET_STATE
        }
}

var getArtistId = function(artistName) {
    return function(dispatch) {
        var url = 'https://api.spotify.com/v1/search?q=' + artistName + '&type=artist';
        return fetch(url).then(function(response) {

                if (response.status < 200 || response.status >= 300) {
                    var error = new Error(response.statusText)
                    error.response = response;
                    throw error;
                }
                return response;
            })
            .then(function(response) {
       
                return response.json();

            })
            .then(function(data) {
              
                var artistId = data.artists.items[0].id;
                var artistImg = data.artists.items[0].images[0].url;
                return dispatch(
                    getArtistSongs(artistName, artistId, artistImg)
                );
            })
            .catch(function(error) {

                return dispatch(getArtistError("Artist does not exist, try again"));
            })
    }

};

var getArtistSongs = function(artistName, artistId, artistImg) {
    return function(dispatch) {
        var url = 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?country=US';
        return fetch(url).then(function(response) {

                if (response.status < 200 || response.status >= 300) {
                    var error = new Error(response.statusText)
                    error.response = response;
                    throw error;
                }
                return response;
            })
            .then(function(response) {
		
                return response.json();

            })
            .then(function(data) {
            	
                var artistTracks = data.tracks;
                
               dispatch(topTracksSuccess(artistName, artistTracks, artistImg));
               return artistId;
                
                
            })
            .then(function(artistId){
            	return dispatch(getRelatedId(artistId));
            })
            .catch(function(error) {
                return dispatch(error);
            })
    }
};

var RelatedArtist = function(relatedArtist) {
    this.name = relatedArtist.name;
    this.id = relatedArtist.id;
    this.image = relatedArtist.images[0].url;
    this.tracks = [];
}


var getRelatedId = function(artistId) {
    
   
    return function(dispatch) {
        var url = 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists';
        return fetch(url).then(function(response) {

                if (response.status < 200 || response.status >= 300) {
                    var error = new Error(response.statusText)
                    error.response = response;
                    throw error;
                }

                return response;
            })
            .then(function(response) {
            
                return response.json();

            })
            .then(function(data) {
            	
            	var topFive = data.artists.slice(0,5);
           
            	var recArtists = []
            	for(var i=0; i<topFive.length;i++){
            		var relatedArtist = new RelatedArtist(topFive[i]);
            		recArtists.push(relatedArtist)

            	}

         
                return recArtists;
               
            })
            .then(function(recArtists){
            	
            	for(var i=0;i<recArtists.length;i++){
            		dispatch(getRelatedSongs(recArtists[i]));
            	}
            	return;
            })

            .catch(function(error) {
                return dispatch(error);
            })
    }
};

var getRelatedSongs = function(artist) {
    return function(dispatch) {
    	
    	    var url = 'https://api.spotify.com/v1/artists/' + artist.id + '/top-tracks?country=US'
    	    fetch(url).then(function(response) {

    	        if (response.status < 200 || response.status >= 300) {
    	            var error = new Error(response.statusText)
    	            error.response = response;
    	            throw error;
    	        }
    	        return response
    	    })

    	    .then(function(response) {
    	 
    	        return response.json();

    	    })

    	    .then(function(data) {
    	    	artist.tracks = data;
    	    
    	    	return artist;

    	    })
    	    .then(function(artist){
    	    	console.log(artist)
    	    	return dispatch(getRelatedSuccess(artist));
    	    })
    	    .catch(function(error) {
    	    
    	        return dispatch(error);
    	    })


    	}

    };

exports.getArtistId = getArtistId;
exports.getArtistSongs = getArtistSongs;

exports.GET_ARTIST_ERROR = GET_ARTIST_ERROR;
exports.getArtistError = getArtistError;

exports.TOP_TRACKS_SUCCESS = TOP_TRACKS_SUCCESS;
exports.topTracksSuccess = topTracksSuccess;

exports.GET_RELATED_SUCCESS = GET_RELATED_SUCCESS;
exports.getRelatedSuccess = getRelatedSuccess;



exports.getRelatedId = getRelatedId;
exports.getRelatedSongs = getRelatedSongs;

exports.resetState = resetState;
exports.RESET_STATE = RESET_STATE;