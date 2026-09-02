function TextAreaInput({labelTitle, labelStyle, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType}){

    const updateInputValue = (val) => {
        updateFormValue({updateType, value : val})
    }

    return(
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
            </label>
            <textarea value={defaultValue} className="textarea textarea-bordered w-full" placeholder={placeholder || ""} onChange={(e) => updateInputValue(e.target.value)}></textarea>
        </div>
    )
}


export default TextAreaInput
