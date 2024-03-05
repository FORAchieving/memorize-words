import Unit from './Unit';
import type {Basic} from './type'
import React, {useState} from 'react'


export default function WordCard({info, query, style, textareaValue}: {info: Basic, query: string,style?: React.CSSProperties, textareaValue:string}) {
    const [showExplain, setShowExplain] = useState(false);

    function clickExplain(event: React.MouseEvent) {
        event.stopPropagation();
        setShowExplain(true);
    }
    return (
            <section
                className="words-home--cards"
            >
                <div className="words-home--cards__title">{query}</div>
                <div className="words-home--cards__phonetic">
                    <Unit country="uk" speechSrc={info['uk-speech']} phonetic={info['uk-phonetic']}/>
                    <Unit country="us" speechSrc={info['us-speech']} phonetic={info['us-phonetic']}/>
                </div>
                {
                    showExplain ? (<div className="words-home--cards__content">
                                        {info.explains.map((explain:string) => <p className="words-home--cardexplain" key={explain} title={explain}>{explain}</p>)}
                                        <div className='words-home-note'>
                                            <label>Note: </label>
                                            <p>{textareaValue}</p>
                                        </div>
                                    </div>) : (<div className='words-home--cardshow' onClick={clickExplain}>Click to show explain.</div>)
                }
                
            </section>
    )
}