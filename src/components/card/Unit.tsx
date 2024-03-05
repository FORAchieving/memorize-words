import {useRef, useState} from "react";

export default function Unit({country, speechSrc, phonetic}: {country: string, speechSrc: string, phonetic: string}) {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [playStatus, setPlayStatus] = useState<string>('');

    const handleAudioPlay = () => {
            setPlayStatus(country)
            audioRef.current?.play();
    }
    const handleEnded = () => setPlayStatus('')
    return (<div className="audio">
                <div>
                    <audio src={speechSrc} controls ref={audioRef} onEnded={handleEnded} ></audio>
                    <b>{country === 'us' ? '美' : '英'}</b> {phonetic && <span><i>/</i> {phonetic} <i>/</i></span>}
                </div>
                <div className={`word-home--cards__image ${playStatus === country ? 'speaker-play' : ''}`} onClick={handleAudioPlay}></div>
            </div>)
}