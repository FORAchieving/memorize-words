import Tabs from 'antd/es/tabs/index';
import Collapse from 'antd/es/collapse/index';
import type { TabsProps, CollapseProps } from 'antd';
import { useStorage } from '../../hooks/useStorage';
import type { FavoriteWord, FavoriteSentence } from '../home/type';
import Explain from '../home/explain';
import type { Group } from '../../hooks/storage.type';
import {
  useParams,
} from "react-router-dom";

function AllWords() {
  const [ words ] = useStorage<FavoriteWord>(localStorage)('favorites', []);
  const items: CollapseProps['items'] = words.map((word) => ({key: word.id, label: word.query, children: <Explain web={word.web} info={word.basic}/>}))
  return (<Collapse ghost items={items}/>)
}
function Sentences() {
  const [ sentences ] = useStorage<FavoriteSentence>(localStorage)('favoriteSentence', []);
  const items: CollapseProps['items'] = sentences.map((sentence) => ({key: sentence.id, label: sentence.query, children: <p>{sentence.textareaValue}</p>}))
  return (items.length > 0 ? <Collapse ghost items={items}/> : <p>还没有收藏任何句子哦～</p>)

}

function WordBelongGroup (groupId:string) {
  const [ words ]  = useStorage<FavoriteWord>(localStorage)('favorites', []);
  const wordBelongGroup = words.filter(word => word.groupId === groupId);
  const items: CollapseProps['items'] = wordBelongGroup.map((word) => ({key: word.id, label: word.query, children: <Explain web={word.web} info={word.basic}/>}))
  if(items.length === 0) return (<p>该分组下没有单词</p>)
  return (<Collapse  ghost items={items}/>)
}

function GroupWord() {
  const [ groups ] = useStorage<Group>(localStorage)('dictionaryGroup', []);
  const items: CollapseProps['items'] = groups.map((group) => ({key: group.id, label: group.value, children: WordBelongGroup(group.id)}));

  return (<Collapse ghost items={items}/>)
}

export default function VocabularyBook() {
    const params = useParams();
    const group: TabsProps['items'] = [
      {
        key: '1',
        label: '所有单词',
        children: <AllWords/>,
      },
      {
        key: '2',
        label: '单词分组',
        children: <GroupWord/>,
      },
      {
        key: '3',
        label: '所有句子',
        children: <Sentences/>,
      }
    ];
    return (
        <div className="words-home">
            <Tabs className='words-home--tabs' defaultActiveKey={params.type} items={group} />
        </div>
    );
}