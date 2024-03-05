import SearchOutlined from '@ant-design/icons/SearchOutlined'
import LoadingOutlined from '@ant-design/icons/LoadingOutlined'
import React, {Key, useEffect, useRef, useState} from 'react'

export default function Input({onChange, loading, onSearch, showIcon=false, placeholder, onKeydown, clear=false}:
    {
        onChange?: (value: string) => void,
        loading?: boolean,
        onSearch?: (query:string) => void,
        onKeydown?: (e: React.KeyboardEvent) => void,
        showIcon?: boolean,
        placeholder?: string,
        clear?: boolean
    } ) {
    const debounceId = useRef<ReturnType<typeof setTimeout>>();
    const [value, setValue] = useState<string>('')
    const valueRef = useRef<string>('')
    const pld = useRef<string>(placeholder || 'input word...')
    const isComposing = useRef<boolean>(false);
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        valueRef.current = (e.target! as HTMLInputElement).value;
        setValue(valueRef.current);
        clearTimeout(debounceId.current);
        debounceId.current = setTimeout(() => {
            onChange && onChange(valueRef.current);
        }, 500)
    }
    function handleSearchClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent> | KeyboardEvent) {

        if (e.type === 'keyup' && (e as KeyboardEvent).key !== 'Enter') return;
        onSearch && onSearch(valueRef.current)
    }


    function handleKeydown(e:React.KeyboardEvent) {
        e.stopPropagation();

        if((e.target as HTMLInputElement).value.trim() === '' || isComposing.current) return;
        if (e.key === 'Enter') {
            onKeydown && onKeydown(e);
            clear && setValue('')
        }
    }
    useEffect(() => {
        document.addEventListener('keyup', handleSearchClick)

        return () => {
            document.removeEventListener('keyup', handleSearchClick)
        }
    }, [])
    return (<div className='search-words'>
        <input type="text"
               className='search-words--input'
               maxLength={100}
                value={value}
               placeholder={pld.current}
               onChange={handleChange}
               onKeyDown={handleKeydown}
               onCompositionStart={ () => isComposing.current = true}
               onCompositionEnd={() => { isComposing.current = false;  }}
        />
        {
           showIcon && <div  className='search-words--icon' >
                {
                    loading ? <LoadingOutlined style={{"fontSize": "20px", color: "var(--background-color-dark)"}}/> 
                    : <SearchOutlined style={{"fontSize": "20px", color: "var(--background-color-dark)"}} onClick={handleSearchClick}/>
                }
            </div>
        }
    </div>)
}