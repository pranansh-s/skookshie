import React from 'react';
const Player = ({ title, thumbnail, audioBlobUri }) => {
    function Song(name, img, uri){
        this.name = name;
        this.img = img;
        this.uri = uri;
    }

    let [songQueue, setSongQueue] = React.useState([]);
    let [currentSong, setCurrentSong] = React.useState(null);
    let [indexCurrent, setIndexCurrent] = React.useState(-1);
    let [toggle, setToggle] = React.useState(false);
    let audioPlayer = document.getElementById('audioPlayer');
    let musicSeeker = document.querySelector('.musicSeeker');
    
    document.addEventListener('keydown', (e) =>{
        if(e.keyCode === 32){
            if(e.target === document.body) e.preventDefault();
            if(e.target !== document.querySelector('input[type=text]')) toggleClick();
        }
    });

    React.useEffect(() => {
        if(audioBlobUri){
            const addedSong = new Song(title, thumbnail, audioBlobUri);
            setSongQueue(songQueue => [...songQueue, addedSong]);
        }
    }, [audioBlobUri]);

    React.useEffect(() => { 
        if(currentSong){
            audioPlayer.src = currentSong.uri;
            audioPlayer.load();
            audioPlayer.play();
            document.querySelector('.songTitle').innerHTML = currentSong.name;
            document.querySelector('.Player img').src = currentSong.img;
            musicSeeker.style.display = 'block';
            document.querySelector('.currentTime').style.display = 'block';
            document.querySelector('.totalTime').style.display = 'block';
            musicSeeker.addEventListener('change', () => {
                audioPlayer.currentTime = musicSeeker.value;
                document.querySelector('.currentTime').innerHTML = msTos(musicSeeker.value);
            });
            audioPlayer.addEventListener('loadedmetadata', () => {
                musicSeeker.max = Math.floor(audioPlayer.duration);
                document.querySelector('.totalTime').innerHTML = msTos(audioPlayer.duration);
            });
            audioPlayer.addEventListener('timeupdate', () => {
                musicSeeker.value = Math.floor(audioPlayer.currentTime);
                document.querySelector('.currentTime').innerHTML = msTos(audioPlayer.currentTime);
            });
            setToggle(false);
        }
    }, [currentSong]);

    React.useEffect(() => {
        if(songQueue.length == 1) nextSong();
    }, [songQueue]);

    const nextSong = () => {
        if(indexCurrent !== songQueue.length - 1) setIndexCurrent(indexCurrent + 1);
        else musicSeeker.value = 0;
    }

    const prevSong = () => {
        if(indexCurrent !== 0) setIndexCurrent(indexCurrent - 1);
        else musicSeeker.value = 0;
    }

    const msTos = (durationSong) => {
        const minutes = Math.floor(durationSong / 60);
        const seconds = Math.floor(durationSong % 60);
        const secStr = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${secStr}`;
    }

    const toggleClick = () => {
        if(audioBlobUri){
            if(toggle) audioPlayer.play();
            else audioPlayer.pause();
            setToggle(!toggle);
        }
    }
    
    React.useEffect(() => {
        setCurrentSong(songQueue[indexCurrent]);
        for(var i = 0; i < songQueue.length; i++){
            if(i == indexCurrent) document.getElementById(i).style.background = 'hsl(160, 80%, 40%)';
            else document.getElementById(i).style.background = 'none';
        }
    }, [indexCurrent]);

    return(
        <div className='Player'>
            <img/>
            <span className='songTitle'></span>

            <i className='previousIcon fas fa-2x fa-angle-double-left' onClick={prevSong}></i>
            <i className={`playIcon fas fa-2x fa-${toggle ? 'play' : 'pause'}`} onClick={() => toggleClick()}></i>
            <i className='nextIcon fas fa-2x fa-angle-double-right' onClick={nextSong}></i>

            <span className='currentTime' style={{display: "none"}}>0:00</span>
            <input type="range" className='musicSeeker' style={{display: "none"}}/>
            <span className='totalTime' style={{display: "none"}}>0:00</span>
            <audio autoPlay id='audioPlayer' preload='metadata' onEnded={nextSong}></audio>

            <i className='queue fas fa-2x fa-clipboard-list'>
                <i className="fas fa-times"></i>
                <div className='hip'>
                    <div className='songQueue'>
                        {songQueue.map((song, i) => <div id={i} key={i}>{song.name}</div>)}
                    </div>
                    <span className='bottomArrow'></span>
                </div>
            </i>
        </div>
    );
}

export default Player;