import type {Web, Basic} from '../../components/card/type.ts'

export interface FavoriteWord{
    basic: Basic;
    web: Web[];
    query: string;
    textareaValue: string,
    groupId: string,
    id: string,
    isWord: boolean,
    speakUrl?: string
}

export type FavoriteSentence = Omit<FavoriteWord, 'basic' | 'web'| 'groupId'>
