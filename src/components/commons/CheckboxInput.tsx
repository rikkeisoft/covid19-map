import React  from 'react'
import '../../styles/modules/Checkbox.css'

interface Props {
    classes?: string,
    label?: string,
    value?: any,
    checked?: any,
    onChange(event): any
}

const CheckboxInput = (props: Props) => {
    const {
        classes,
        label,
        value,
        checked,
        onChange = (event) => {},
    } = props
    
    return (
        <>
            <label className={`${classes} box-input-custom`}>
                {label}
                <input type='checkbox'
                       value={value}
                       checked={checked}
                       onChange={event => { onChange(event) }}
                />
                <span className='checkmark'></span>
            </label>
        </>
    )
}

export default CheckboxInput
