import React from 'react';
const Player = ({ title, thumbnail }) => {
    function Song(name, img){
        this.name = name;
        this.img = img;
    }

    let songQueueLength = React.useRef(0);
    let [songQueue, setSongQueue] = React.useState([]);
    let [currentSong, setCurrentSong] = React.useState(null);
    let [indexCurrent, setIndexCurrent] = React.useState(-1);
    let [toggle, setToggle] = React.useState(false);
    let audioPlayer = document.getElementById('audioPlayer');
    let musicSeeker = document.querySelector('.musicSeeker');
    
    //media buffering todo:add to another seperate file
    let chunks = [];
    let [controller, setController] = React.useState();
    let [med, setMed] = React.useState(null);
    let [sourceBuffer, setSourceBuffer] = React.useState(null);
    let [readable, setReadable] = React.useState(null);

    const appendToSourceBuffer = () => {
        if (med.readyState === "open" && sourceBuffer && sourceBuffer.updating === false){
            try {
                sourceBuffer.onupdateend = appendToSourceBuffer;
                sourceBuffer.appendBuffer(chunks.shift());
            } catch (e) {return}
            // console.log(chunks);
        }
    }

    React.useEffect(() => {
        if(med){
            audioPlayer.src = URL.createObjectURL(med);
            audioPlayer.load();
            audioPlayer.play().catch(e => {return});

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

                if(document.querySelector('.currentTime').innerText === document.querySelector('.totalTime').innerText) nextSong();
            });

            med.addEventListener("sourceopen", function() {
                setSourceBuffer(med.addSourceBuffer("audio/mp4; codecs=\"mp4a.40.2\""));
            });
        }
    }, [med]);

    React.useEffect(() => {
        if(readable){
            reader();
            function reader() {
                readable.read().then(({ done, value }) => {
                    if(done) return;
                    chunks.push(value);
                    appendToSourceBuffer();
                    return reader();
                });
            }
        }
    }, [readable]);


    document.addEventListener('keydown', (e) =>{
        if(e.keyCode === 32){
            if(e.target === document.body) e.preventDefault();
            if(e.target !== document.querySelector('input[type=text]')) toggleClick();
        }
    });

    React.useEffect(() => {
        if(title){
            const addedSong = new Song(title, thumbnail);
            setSongQueue(songQueue => [...songQueue, addedSong]);
        }
    }, [title]);

    React.useEffect(() => { 
        if(currentSong){
            //init search
            chunks = [];
            if(sourceBuffer && sourceBuffer.updating === true) sourceBuffer.abort();

            let mediaSource = new MediaSource();
            setMed(mediaSource);

            let contr = new AbortController(); 
            setController(contr);

            setToggle(false);
        }
    }, [currentSong]);

    React.useEffect(() => {
        if(controller){
            fetch(`/youtube?search=${encodeURIComponent(currentSong.name)}`, { signal: controller.signal})
                .then(r => r.body.getReader())
                .then(r => setReadable(r));
        }

    }, [controller])

    React.useEffect(() => {
        songQueueLength.current = songQueue.length;
        if(songQueueLength.current == 1) nextSong();
    }, [songQueue]);

    const nextSong = () => {
        if(indexCurrent !== songQueueLength.current - 1) setIndexCurrent(indexCurrent + 1);
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
        if(currentSong){
            if(toggle && audioPlayer.paused) audioPlayer.play();
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
            <audio autoPlay id='audioPlayer' preload='metadata'></audio>

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