import React from 'react';
import Button from './Button';
import ListItem from './ListItem';
import Player from './Player';

const SearchBar = () => {
    let inputText = React.createRef();
    let [spotifyResults, setSpotifyResults] = React.useState(null);
    let [value, setValue] = React.useState(null);

    let [res, setRes] = React.useState(null);
    let [readable, setReadable] = React.useState(null);
    let [name, setName] = React.useState(null);
    let [image, setImage] = React.useState(null);
    let chunks = [];

    const getYoutubeAudio = async(songName, providers, display) => {
        let artistStr = providers.map(providers => providers.name).join(', ');
        let query = encodeURIComponent((`${songName} ${artistStr}`));

        if(name !== `${songName}- ${artistStr}`){
            chunks = [];
            fetch(`/youtube?search=${query}`)
            .then(r => r.body.getReader())
            .then(r => setReadable(r));
    
            setName(`${songName}- ${artistStr}`);
            setImage(display);
        }
    }

    React.useEffect(() => {
        if(readable){
            reader();
            function reader() {
                readable.read().then(({ done, value }) => {
                    if(done){
                        document.querySelector('.notif').style.opacity = 1;
                        setTimeout(() => document.querySelector('.notif').style.opacity = 0, 2000);
                        var blob = new Blob(chunks, { type: 'video/mp4' });
                        setRes(URL.createObjectURL(blob));
                        return;
                    }
                    chunks.push(value);
                    return reader();
                });
            }
        }
    }, [readable]);

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
                spotifyResults.map((spotifyResults) => <ListItem key={spotifyResults.id} name={spotifyResults.name} secondaryInfo={spotifyResults.artists} thumbnail={spotifyResults.album.images[1].url} click={() => getYoutubeAudio(spotifyResults.name, spotifyResults.artists, spotifyResults.album.images[1].url)}/>)}</ul>
            </div>
            <Player audioBlobUri={res} title={name} thumbnail={image}/>
        </div>
    );
}

export default SearchBar;