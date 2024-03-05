import type { Unit } from './type'

export default function CardUnit(props:Unit) {
    return (<div className="words-home--card" title={props.name}>{ props.name }</div>)
}