import React, { useEffect } from "react"
import * as places from 'places.js'
import '../../styles/modules/AutoCompletePlace.css'

interface Props {
    className?: string,
    timeBounce?: number,
    placeholder?: string,
    handleSelected(value): any,
}

const fixedOptions: any = {
    appId: process.env.REACT_APP_ALGOLIA_PLACE_APP_KEY,
    apiKey: process.env.REACT_APP_ALGOLIA_PLACE_API_KEY,
};

const configOptions: any = {
    language: 'vi',
    countries: ['vn']
};

const DEFAULT_PLACEHOLDER = 'Tìm kiếm...'

const AutoCompletePlace = (props: Props) => {
    const {
        className,
        placeholder,
        handleSelected = (value) => { },
    } = props
    
    useEffect(() => {
        
        fixedOptions.container = document.querySelector('#address-input')
        // @ts-ignore
        const placesAutocomplete = places(fixedOptions).configure(configOptions);
        
        placesAutocomplete.on('change', (e) => {
            handleSelected(e.suggestion.latlng)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        <div className={`${className} box-auto-complete-place`}>
            <input type='search'
                   id='address-input'
                   placeholder={placeholder ? placeholder : DEFAULT_PLACEHOLDER}
            />
        </div>
    )
}

export default AutoCompletePlace
