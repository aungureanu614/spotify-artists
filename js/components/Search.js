var React = require('react');
var connect = require('react-redux').connect;


var actions = require('../actions/index');
var RelatedArtists= require('./RelatedArtists');

var Search = React.createClass({
	//submit artist and dispatch actions
	submitForm: function(event){
		event.preventDefault();
		var artistName = this.refs.artist.value;
		this.props.dispatch(actions.resetState());
		this.props.dispatch(actions.getArtistId(artistName));
		
	},

    searchedArtist: function(artist){
    	
    	if(artist.name != null && artist.name != "Artist does not exist, try again"){
    		var tracks = [];
    		//iterate through returned tracks for artist and compose playlist of 10 tracks
    		for(var i=0;i<artist.tracks.length;i++){
    			tracks.push(artist.tracks[i].id)
    		}
    		return(
    			<div className="search-artist">
    				<p>{artist.name}</p>
    				<img src={artist.image}></img>
    				<iframe src={'https://embed.spotify.com/?uri=spotify:trackset:Top 10 Playlist:' + tracks.join(',')} 
				 	frameBorder="0" allowTransparency="true"></iframe>
    			</div>
    			)
    	}else{
    		return(
    			<div className="search-artist">
    				<p>{artist.name}</p>
    				
    			</div>
    			)
    	}
    },


	render: function(){

		//create form and call function to search for an artists
		//reference related artists component
			
		return (
			<div>
				

				<form className="submitForm" onSubmit={this.submitForm}>
					<input className="artist-input" type="text" ref="artist" placeholder="Artist Name"/>
					<button type="submit" className="submit">Submit</button>

				</form>

				<div>

				    {this.searchedArtist(this.props.artistInfo)}
								
					<RelatedArtists relatedArtists={this.props.artistInfo.relatedArtists}/>
					

				</div>
				
			</div>
			);

	}

});
//map props to state
var mapStateToProps = function(state, props){
	return{
		artistInfo: state
	}
}

var Container = connect(mapStateToProps)(Search);

module.exports = Container;