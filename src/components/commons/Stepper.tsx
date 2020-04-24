import React, { useState } from 'react'
import '../../styles/modules/Stepper.css'

interface Props {
    min: number,
    max: number
    onChangeLevel(value): void
    initialLevel?: number
    width?: number
    classes?: string
    unit?: string
}

const initialWidth: number = 340
let backgroundStyle: string = '#ccc'
let positionLeftLabel: number = 0
const Stepper = (props: Props) => {
    const {
        min,
        max,
        classes,
        initialLevel,
        unit,
        onChangeLevel = (value) => {},
    } = props
    const width = props.width ? props.width : initialWidth
    const [level, setLevel] = useState(initialLevel ? initialLevel : min)
  
    const onChange = (value) => {
        if (onChangeLevel) {
            onChangeLevel(value)
        }
        setLevel(value)
    }
    
    backgroundStyle = 'linear-gradient(to right, #007d74 0px, #007d74 ' + (level * width/max) + 'px, #ccc ' + (level * width/max) + 'px, #ccc 100%)'
    positionLeftLabel = level === min ? -5 : level === max ? width - 15 : (level * width/max) - 8
    return (
        <>
            <div className={`${classes ? classes : ''} box-stepper`}>
                <div className='range-slider'>
                    <span style={{ left:  positionLeftLabel + 'px' }}
                               className='rs-label'
                    >
                        {level} {unit ? unit : ''}
                    </span>
                    <input
                        style={{'background': backgroundStyle, width: width }}
                        id='range'
                        type="range"
                        className='range'
                        min={min}
                        max={max}
                        value={level}
                        onChange={(event) => {
                            onChange(+event.target.value)
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default Stepper
