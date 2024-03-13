
import StarOutlined from '@ant-design/icons/StarOutlined'
import StarFilled from '@ant-design/icons/StarFilled'
import EditOutlined from '@ant-design/icons/EditOutlined'
import Modal from "antd/es/modal/Modal"
import ManualModal from "antd/lib/modal/index"
import Explain from "./explain"
import Input from "../../components/Input"
import SelectComponent from "../../components/Select"
import { Link } from "react-router-dom";
import React from 'react';

import useHomeBusinessLogic from './businessLogic';


export default function Home() {
    const {
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
    } = useHomeBusinessLogic();

    return (
        <article className="words-home">
            <nav className="words-name--nav">
                <Link to="/vacabulary-book/1" className="words-name--button">单词本</Link>
                <Link to={{pathname: '/vacabulary-book/3' }} className="words-name--button">句子</Link>
                <Link to={{pathname: '/memorize-word' }} className="words-name--button">背单词</Link>
            </nav>
            <section className="words-home--icon">
                <Input onChange={handleInputChange} loading={loading} onSearch={onSearch} showIcon/>
                {
                    wordExplain && <p>
                        {
                            isFavoriteWord ? (
                                <>
                                    <StarFilled style={{color: '#FFFFF3'}}  className='icon' onClick={handleCancelFav}/> 
                                    <EditOutlined className='icon' onClick={() => setIsModalOpen(true)}/>
                                </>
                            ): <StarOutlined className='icon' onClick={handleStarClick}/>
                        }
                        </p>
                }
            </section>
            {
                (wordExplain && (wordExplain.isWord ? <Explain info={wordExplain.basic} web={wordExplain.web}></Explain> : <p>没有这个单词～如果是短语，你可以收藏～</p>))
            }
            <Modal title="收藏" okText={'确定'} centered open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="words-home--word">
                    <label>单词</label>
                    <input type="text" disabled value={input.current}/>
                </div>
                <div className="words-home--exercisebook">
                    <label>分组</label>
                    <SelectComponent optionValue={optionValue} onChange={(value:string) => setOptionValue(value)}/>
                </div>
                <div className="words-home--remark">
                    <label>备注</label>
                    <textarea placeholder="comment text..." rows={1} cols={100} value={textareaValue} onChange={(e:React.ChangeEvent) => {setTextareaValue((e.target as HTMLInputElement).value)} }></textarea>
                </div>
            </Modal>
        </article>
    )
}