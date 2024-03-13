import { useEffect, useState } from 'react';
import WordCard from '../../components/card/index';
import { useParams } from 'react-router-dom';
import { useStorage } from '../../hooks/useStorage';
import type { FavoriteWord } from '../home/type';


export default function Card() {
    const [allWords, setAllWords] = useState<FavoriteWord[]>([]);
    const params = useParams();
    const id = params.id;
    const allType = '1';
    const type = id === allType ? 'favorites': 'dictionaryGroup';
    let [list] = useStorage<FavoriteWord>(localStorage)(type, []);

    if (type == 'dictionaryGroup') {
        const [words] = useStorage<FavoriteWord>(localStorage)("favorites", []);

        list = words.filter(word => word.groupId === id);
    }

    useEffect(() => {
        setAllWords(list.filter(word => word.isWord))
    }, [])

    return (<div className="words-home">{
        allWords.length > 0 ? <WordCard list={allWords}/>:<div>这个分组没有单词哦， 快去添加吧～</div>
    }</div>)
}