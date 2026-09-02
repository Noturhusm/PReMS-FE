import { useState } from "react"

function InputText({labelTitle, labelStyle, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType}){

    // 1. Remove the local 'value' state. Use 'defaultValue' directly from props.
    
    const updateInputValue = (val) => {
        // 2. Call the parent function immediately
        updateFormValue({updateType, value : val})
    }

    return(
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
            </label>
            <input 
                type={type || "text"} 
                value={defaultValue} // 3. Use the value from the Login component state
                placeholder={placeholder || ""} 
                onChange={(e) => updateInputValue(e.target.value)} 
                className="input input-bordered w-full " 
            />
        </div>
    )
}

export default InputText