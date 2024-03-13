
import type {CardProps} from '../../components/card/type'
import type { FavoriteWord, FavoriteSentence } from './type';
import ManualModal from "antd/lib/modal/index"
import { useEffect, useRef, useState } from 'react'
import http from "../../utils/axios";
import CryptoJS from 'crypto-js';
import {v4} from 'uuid';
import { useStorage } from "../../hooks/useStorage";
import React from 'react';


export default function useHomeBusinessLogic() {
    const [favoritesList, updator] = useStorage<FavoriteWord>(localStorage)('favorites', [])
    const [favoritesSentence, updatorSentence] = useStorage<FavoriteSentence>(localStorage)('favoriteSentence', [])
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [wordExplain, setWordExplain] = useState<CardProps>();
    const [textareaValue, setTextareaValue] = useState<string>();
    const [isFavoriteWord, setIsFavoriteWord] = useState<boolean>()
    const [optionValue, setOptionValue] = useState<string>()
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
        setIsFavoriteWord(false);
        // setFavoriteStatus()

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
        setFavoriteStatus();
    }
    function setFavoriteStatus(reset=false) {
        if (reset) {
            setTextareaValue('');
            setOptionValue('');
            return;
        }
        if (!input.current) return;
        const word= favoritesList.filter(item => {return item.query === truncate(input.current!)});
        if (word.length) {
            setIsFavoriteWord(true);
            setTextareaValue(word[0].textareaValue);
            setOptionValue(word[0].groupId)
        } else {
            setTextareaValue('');
            setOptionValue('')
        }
    }

    useEffect(() => {
        isModalOpen ? setFavoriteStatus() : setFavoriteStatus(true)
    }, [isModalOpen])
    function handleOk(event: React.MouseEvent) {
        setIsModalOpen(false);
        event.stopPropagation();
        // if (isFavoriteWord) {
        //     setIsFavoriteWord(false)
        //     const cancelIndex = favoritesList.findIndex(item => {return item.query === input.current});
        //     cancelIndex !== -1 && favoritesList.splice(cancelIndex, 1);
        //     updator(favoritesList)
        // } else {
            setIsFavoriteWord(true)
            if (wordExplain!.isWord) {
                updator([{basic: wordExplain!.basic,isWord:wordExplain!.isWord, web: wordExplain!.web, query: truncate(input.current!), textareaValue: textareaValue!, groupId: optionValue!, id: v4()}, ...favoritesList])
            } else {
                updatorSentence([{isWord:wordExplain!.isWord, query: truncate(input.current!), textareaValue: textareaValue!, id: v4()}, ...favoritesSentence])
            }
        // }
    }
    function handleCancel(event: React.MouseEvent) {
        setIsModalOpen(false)
    }
    function handleStarClick(event: React.MouseEvent) {
        setIsModalOpen(true)
    }

    function handleCancelFav() {
        const cancelFav = () => {
            setIsFavoriteWord(false)
            const cancelIndex = favoritesList.findIndex(item => {return item.query === truncate(input.current!)});
            console.log('cancelIndex: ', cancelIndex);
            cancelIndex !== -1 && favoritesList.splice(cancelIndex, 1);
            updator(favoritesList)
        }
        ManualModal.confirm({
            title: '收藏',
            content: "取消收藏？",
            centered: true,
            onOk: cancelFav
        })
    }

    return {
        favoritesList,
        updator,
        favoritesSentence,
        updatorSentence,
        loading,
        setLoading,
        isModalOpen,
        setIsModalOpen,
        wordExplain,
        setWordExplain,
        textareaValue,
        setTextareaValue,
        isFavoriteWord,
        setIsFavoriteWord,
        optionValue,
        setOptionValue,
        input,
        handleInputChange,
        truncate,
        onSearch,
        setFavoriteStatus,
        handleOk,
        handleCancel,
        handleStarClick,
        handleCancelFav
    };
}