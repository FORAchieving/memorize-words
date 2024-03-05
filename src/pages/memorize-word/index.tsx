
import Unit from './unit';
import type { Group } from '../../hooks/storage.type';
import { useStorage } from '../../hooks/useStorage';
import { Link } from 'react-router-dom';


export default function MemorizeWords() {
    const [groups] = useStorage<Group>(localStorage)('dictionaryGroup', []);
    const allGroups = [{id: '1', value: '所有单词'}, ...groups];
    return (<div className='words-home--memorize words-home'> {
        allGroups.map((group) => <Link key={group.id} to={{pathname: `/listen-word/${group.value}/${group.id}`}}><Unit  name={group.value} /></Link>)
    } </div>)
}