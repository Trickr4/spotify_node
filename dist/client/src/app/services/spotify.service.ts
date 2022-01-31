import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    let promise = new Promise((resolve,reject) => {
      let url = this.expressBaseUrl+endpoint;
      this.http.get(url)
        .toPromise()
        .then(
          res => { 
            resolve(res);
          }
        )
    } );
    
    return promise;
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }
  
  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
    if (category == 'album')
    return this.sendRequestToExpress('/search/'+category+'/'+resource).then((data) => {
      let URI = encodeURIComponent(data);
      let resources = new Array();
      data['albums']['items'].forEach((item) => {
      let Album = new AlbumData(item);
      Album.url = Album.url.replace("https://open.spotify.com", "")
      resources.push(Album);
      });
      return resources;
    });
    if (category == 'artist')
    return this.sendRequestToExpress('/search/'+category+'/'+resource).then((data) => {
      let URI = encodeURIComponent(data);
      let resources = new Array();
      data['artists']['items'].forEach((item) => {
      let Artist = new ArtistData(item);
      Artist.url = Artist.url.replace("https://open.spotify.com", "")
      resources.push(Artist);
      });
      return resources;
    });
    if (category == 'track')
    return this.sendRequestToExpress('/search/'+category+'/'+resource).then((data) => {
      let URI = encodeURIComponent(data);
      let resources = new Array();
      data['tracks']['items'].forEach((item) => {
      let Track = new TrackData(item);
      Track.url = Track.url.replace("https://open.spotify.com", "");
      Track.album.url = Track.album.url.replace("https://open.spotify.com", "");
      Track.artists[0].url = Track.artists[0].url.replace("https://open.spotify.com", "");
      resources.push(Track);
      });
      return resources;
    });
  }
  
  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    return this.sendRequestToExpress('/artist/'+artistId).then((data) => {
      let art = new ArtistData(data);
      return art;
    });
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    return this.sendRequestToExpress('/artist-related-artists/'+artistId).then((data) => {
      let resources = new Array();
      data['artists'].forEach((item) => {
      let Artist = new ArtistData(item);
      Artist.url = Artist.url.replace("https://open.spotify.com", "");
      resources.push(Artist);
      });
      return resources;
    });
    
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    return this.sendRequestToExpress('/artist-top-tracks/'+artistId).then((data) => {
      let resources = new Array();
      data['tracks'].forEach((item) => {
      let Track = new TrackData(item);
      Track.album.url = Track.album.url.replace("https://open.spotify.com", "");
      Track.artists[0].url = Track.artists[0].url.replace("https://open.spotify.com", "");
      Track.url = Track.url.replace("https://open.spotify.com", "");
      resources.push(Track);
      });
      return resources;
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    return this.sendRequestToExpress('/artist-albums/'+artistId).then((data) => {
      let resources = new Array();
      data['items'].forEach((item) => {
      let Album = new AlbumData(item);
      Album.url = Album.url.replace("https://open.spotify.com", "");
      resources.push(Album);
      });
      return resources;
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    return this.sendRequestToExpress('/album/'+albumId).then((data) => {
      let Album = new AlbumData(data);
      Album.artists[0].url = Album.artists[0].url.replace("https://open.spotify.com", "");
      Album.url = Album.url.replace("https://open.spotify.com", "");
      return Album;
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    return this.sendRequestToExpress('/album-tracks/'+albumId).then((data) => {
      let resources = new Array();
      data['items'].forEach((item) => {
      let Track = new TrackData(item);
      Track.artists[0].url = Track.artists[0].url.replace("https://open.spotify.com", "");
      Track.url = Track.url.replace("https://open.spotify.com", "");
      resources.push(Track);
      });
      return resources;
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return this.sendRequestToExpress('/track/'+trackId).then((data) => {
      let Track = new TrackData(data);
      return Track;
    });
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    return this.sendRequestToExpress('/track-audio-features/'+trackId).then((data) => {
      let resources = new Array();
      let danceability = new TrackFeature('danceability',data.danceability);
      danceability.id = data.id;
      resources.push(danceability);

      let energy = new TrackFeature('energy',data.energy);
      energy.id = data.id;
      resources.push(energy);
      
      let speechiness = new TrackFeature('speechiness',data.speechiness);
      speechiness.id = data.id;
      resources.push(speechiness);

      let acousticness = new TrackFeature('acousticness',data.acousticness);
      acousticness.id = data.id;
      resources.push(acousticness);

      let instrumentalness = new TrackFeature('instrumentalness',data.instrumentalness);
      instrumentalness.id = data.id;
      resources.push(instrumentalness);

      let liveness = new TrackFeature('liveness',data.liveness);
      liveness.id = data.id;
      resources.push(liveness);

      let valence = new TrackFeature('valence',data.valence);
      valence.id = data.id;
      resources.push(valence);
      return resources;
    });
  }
}
