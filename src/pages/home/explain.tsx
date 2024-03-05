import Unit from "../../components/card/Unit";
import type {Web, Basic} from "../../components/card/type";

export default function Explain({web, info}: {web: Web[], info: Basic}) {
    return (<article className="words-explain">
        <div className="words-explain--unit">
            <Unit country="uk" speechSrc={info['uk-speech']} phonetic={info['uk-phonetic']}/>
            <Unit country="us" speechSrc={info['us-speech']} phonetic={info['us-phonetic']}/>
        </div>

        <h4>基本释义</h4>
        <div>{info.explains.map(explain => <p  className="words-explain--webphrase" key={explain}>{explain}</p>)}</div>

        <h4>网络释义</h4>
        <ul>
            {web[0].value.map(explain =><li className="words-explain--webphrase" key={explain}> {explain} </li>)}
        </ul>

        <h4>短语</h4>
        <ul>
            {web.slice(1).map(phrase =><li key={phrase.key}> 
                <strong>{phrase.key}</strong>
                <p className="words-explain--webphrase">{phrase.value.join(' | ')}</p>
            </li>)}
        </ul>


    </article>)
}