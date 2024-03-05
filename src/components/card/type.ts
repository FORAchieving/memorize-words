
type Wf = {
    name: string;
    value: string;
}
type Wfs = {
    wf: Wf
}
export type Web = {
    key: string;
    value: string[];
}
export type Basic = {
    "exam_type"?: string[],
    "us-phonetic": string,
    "phonetic": string,
    "uk-phonetic": string,
    "wfs": Wfs[],
    "uk-speech": string,
    "explains": string[],
    "us-speech": string
}
export interface CardProps {
    basic: Basic;
    web: Web[];
    query: string;
    textareaValue: string,
    groupId: string,
    id: string,
    isWord: boolean,
    speakUrl?: string
}