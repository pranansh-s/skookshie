import React from 'react';
import Button from './Button';
import ListItem from './ListItem';
import Player from './Player';

const SearchBar = () => {
    let inputText = React.createRef();
    let [spotifyResults, setSpotifyResults] = React.useState(null);
    let [value, setValue] = React.useState(null);

    let [name, setName] = React.useState(null);
    let [image, setImage] = React.useState(null);

    const addSong = async(songName, providers, display) => {
        let artistStr = providers.map(providers => providers.name).join(', ');
        
        document.querySelector('.notif').style.opacity = 1;
        setTimeout(() => document.querySelector('.notif').style.opacity = 0, 2000);
        
        if(name !== `${songName} ${artistStr}`){
            setName(`${songName} ${artistStr}`);
            setImage(display);
        }
    }

    React.useEffect(() => {
        if(value){
            let query = value.trim().replace(/\s/g, '+');
            fetch(`/song?search=${query}`)
            .then(res => res.json())
            .then((jso) => setSpotifyResults(jso.spotify.body.tracks.items));
        }
    }, [value]);

    return (
        <div className='mainBody'>
            <div className='notif'>Song has been added to queue.</div>
            <div className='SearchBar'>
                <input ref={inputText} type='text' placeholder='Search..' spellCheck='false' onKeyPress={(event) => event.key === 'Enter' ? setValue(inputText.current.value) : null}/>
                <Button text='Go' click={() => setValue(inputText.current.value)} classCSS='searchButton'></Button>
                <ul>{(!spotifyResults) ? "Search for your tracks using the above search-bar" :
                spotifyResults.map((spotifyResults) => <ListItem key={spotifyResults.id} name={spotifyResults.name} secondaryInfo={spotifyResults.artists} thumbnail={spotifyResults.album.images[1].url} click={() => addSong(spotifyResults.name, spotifyResults.artists, spotifyResults.album.images[1].url)}/>)}</ul>
            </div>
            <Player title={name} thumbnail={image}/>
        </div>
    );
}

export default SearchBar;