import  Select from "antd/es/select/index";
import  Space  from "antd/es/space/index";
import  Divider  from "antd/es/divider/index";
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import Input  from './Input';
import React, { useState,useRef } from "react";
import {v4} from 'uuid';
import { useStorage } from '../hooks/useStorage';
import type { Group } from '../hooks/storage.type';

export default function SelectComponent({optionValue, onChange}:{optionValue?: string, onChange?: (value: string) => void}){
    const [value, setValue] = useState<string|undefined>(optionValue?optionValue:undefined);
    const [curOption, setCurOption] = useState<string>('');
    const [items, updater] = useStorage<Group>(localStorage)('dictionaryGroup',[]);

    function handleKeydown(e:React.KeyboardEvent) {
        const groupValue = (e.target as HTMLInputElement).value;
        const uuid = v4();

        groupValue && updater([{id: uuid, value: groupValue}, ...items]);

    }

    function handleOptionChange(id: string){
        setValue(id);
        onChange && onChange(id);
    }

    function handleDelete(id: string) {
        updater(items.filter(item => item.id !== id));
        if(value === id) {
            setValue(undefined);
            onChange && onChange(id);
        };
    }
    return (
            <Select
            style={{ width: 300 }}
            placeholder="choose group"
            className="words-home--select"
            value={value}
            onChange={handleOptionChange}
            popupClassName="words-home--select-popup"
            allowClear
            dropdownRender={(menu) => (
                <>
                    {menu}
                    
                    <Divider style={{ margin: '8px 0' }} />
                    <Input onKeydown={handleKeydown} clear placeholder="press Enter key to add group"/>
                </>
            )}
            options={items.map(item => ({
                label:  (<div className="words-home-option"
                              onMouseEnter={() => setCurOption(item.id)}
                            >
                            <span>{item.value}</span>
                            {curOption === item.id && <CloseOutlined onClick={(e:React.MouseEvent) => {e.stopPropagation();handleDelete(item.id)}}/>}
                        </div>),
                value: item.id }))}
            />
    )
}