
import type {CardProps} from '../../components/card/type'
import type { FavoriteWord, FavoriteSentence } from './type';

import StarOutlined from '@ant-design/icons/StarOutlined'
import StarFilled from '@ant-design/icons/StarFilled'
import Modal from "antd/es/modal/Modal"
import Explain from "./explain"
import Input from "../../components/Input"
import { useRef, useState } from 'react'
import SelectComponent from "../../components/Select"
import { Link } from "react-router-dom";
import http from "../../utils/axios";
import CryptoJS from 'crypto-js';
import {v4} from 'uuid';
import { useStorage } from "../../hooks/useStorage";


export default function Home() {
    const [favoritesList, updator] = useStorage<FavoriteWord>(localStorage)('favorites', [])
    const [favoritesSentence, updatorSentence] = useStorage<FavoriteSentence>(localStorage)('favoriteSentence', [])
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [wordExplain, setWordExplain] = useState<CardProps>();
    const [textareaValue, setTextareaValue] = useState<string>();
    const [isFavoriteWord, setIsFavoriteWord] = useState<boolean>()
    const optionValue = useRef<string>()
    const input = useRef<string>()
    function handleInputChange(val:string) {
        if (!val) {
            setWordExplain(undefined)
        }
    }

    function truncate(q:string){
        var len = q.length;
        if(len<=20) return q;
        return q.substring(0, 10) + len + q.substring(len-10, len);
    }
    async function onSearch(query: string) {
        if (!query) return
        input.current = query.trim();
        setLoading(true)
        const salt = v4();
        const currentTime =  Math.round(new Date().getTime()/1000);
        const appKey = '647a3b5f400b233a';
        const q = truncate(input.current);
        const result: CardProps= await http.get('/api',{
            params:{
                q,
                from: 'en',
                to: 'zh-CHS',
                appKey,
                salt,
                signType: 'v3',
                sign: CryptoJS.SHA256(appKey + q + salt + currentTime +'N3sD32DV2Qm6kxbPXyxLlovQKPMJs3kq').toString(CryptoJS.enc.Hex),
                curtime: currentTime,
                vocabId: '',
                ext: 'mp3'
            }
        })
        setLoading(false);
        setWordExplain(result);
        const word= favoritesList.filter(item => {return item.query === q});
        if (word.length) {
            setIsFavoriteWord(true);
            setTextareaValue(word[0].textareaValue);
            optionValue.current = word[0].groupId;
        }
    }
    function handleOk(event: React.MouseEvent) {
        setIsModalOpen(false);
        event.stopPropagation();
        if (isFavoriteWord) {
            setIsFavoriteWord(false)
            const cancelIndex = favoritesList.findIndex(item => {return item.query === input.current});
            cancelIndex !== -1 && favoritesList.splice(cancelIndex, 1);
            updator(favoritesList)
        } else {
            setIsFavoriteWord(true)
            if (wordExplain!.isWord) {
                updator([{basic: wordExplain!.basic,isWord:wordExplain!.isWord, web: wordExplain!.web, query: truncate(input.current!), textareaValue: textareaValue!, groupId: optionValue.current!, id: v4()}, ...favoritesList])
            } else {
                updatorSentence([{isWord:wordExplain!.isWord, query: truncate(input.current!), textareaValue: textareaValue!, id: v4()}, ...favoritesSentence])
            }
        }
    }
    function handleCancel(event: React.MouseEvent) {
        setIsModalOpen(false)
    }
    function handleStarClick(event: React.MouseEvent) {
        setIsModalOpen(true)
    }

    return (
        <article className="words-home">
            <nav className="words-name--nav">
                <Link to="/vacabulary-book/1" className="words-name--button">单词本</Link>
                <Link to={{pathname: '/vacabulary-book/3' }} className="words-name--button">句子</Link>
                <Link to={{pathname: '/memorize-word' }} className="words-name--button">背单词</Link>
            </nav>
            {/* <Cards list={wordsList}/> */}
            <section className="words-home--icon">
                <Input onChange={handleInputChange} loading={loading} onSearch={onSearch} showIcon/>
                {
                    wordExplain && <p>
                        {
                            isFavoriteWord ? <StarFilled style={{color: '#FFFFF3'}}  className='icon' onClick={handleStarClick}/> : <StarOutlined className='icon' onClick={handleStarClick}/>
                        }
                        </p>
                }
            </section>
            {
                (wordExplain && (wordExplain.isWord ? <Explain info={wordExplain.basic} web={wordExplain.web}></Explain> : <p>没有这个单词～如果是短语，你可以收藏～</p>))
            }
            <Modal title="收藏" okText={isFavoriteWord ? '取消收藏':'确定'} centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="words-home--word">
                    <label>单词</label>
                    <input type="text" disabled value={input.current}/>
                </div>
                <div className="words-home--exercisebook">
                    <label>分组</label>
                    <SelectComponent optionValue={optionValue.current} onChange={(value:string) => optionValue.current = value}/>
                </div>
                <div className="words-home--remark">
                    <label>备注</label>
                    <textarea placeholder="comment text..." rows={1} cols={100} value={textareaValue} onChange={(e:React.ChangeEvent) => {setTextareaValue((e.target as HTMLInputElement).value)} }></textarea>
                </div>
            </Modal>
        </article>
    )
}