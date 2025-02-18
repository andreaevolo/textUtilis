import React, { useState, useRef } from 'react';
import useHighlightText from '../hooks/useHighlightText';
import { useSpeechSynthesis } from 'react-speech-kit';

export default function TextForm(props) {
    const [text, setText] = useState('This is a default text.');
    const [isFormatUponHighlighted, setIsFormatUponHighlighted] = useState(false);
    const textAreaRef = useRef(null);
    const { highlightedText, onClearHighlightedText } = useHighlightText(textAreaRef);
    const { speak } = useSpeechSynthesis();
    // useState is a hook in React which is used to initialize a state variable. text is the default value 
    // text = "n"; this would have worked if we would have used "var" or "let" instead of "const"
    //text ="random";  wrong way to update the state of a variable. We need a function like setText() which will be upgrading the value of the variable "text".
    //setText("Correct way to change the state of any variable in React");

    const separateText = (oriText, selectedText) => {
        const selectedTextIndex = oriText.indexOf(selectedText);
        const selectedTextLength = highlightedText.length;
        const selectedTextEndIndex = selectedTextIndex + selectedTextLength

        const nonSelectedFrontText = oriText.slice(0, selectedTextIndex);
        const nonSelectedBackText = oriText.slice(selectedTextEndIndex);

        return {
            nonSelectedFrontText,
            selectedText,
            nonSelectedBackText,
        }
    };

    const capitalize = (oriText) => {
        return oriText.charAt(0).toUpperCase() + oriText.slice(1);
    }

    const removePunctuation = (oriText) => {
        return oriText.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    }

    // This function handleUPClick is responsible to make the text in textArea in UpperCase and hence as any activity is seeing using the button this function is activated and then this function changes the value of state variable to new variable which has the upper case variable being stored inside it using the given function below. To update the state of the text variable we make use of setText(newText), function.
    const handleUPClick = () => {
        console.log("Upper Case was clicked " + text);

        let result = text.toUpperCase();
        const { nonSelectedFrontText, selectedText, nonSelectedBackText } = separateText(text, highlightedText);

        if (isFormatUponHighlighted) {
            result = nonSelectedFrontText + selectedText.toUpperCase() + nonSelectedBackText;
        }
        setText(result);
    }
    const handleLoClick = () => {
        console.log("Upper Case was clicked " + text);

        let result = text.toLowerCase();
        const { nonSelectedFrontText, selectedText, nonSelectedBackText } = separateText(text, highlightedText);

        if (isFormatUponHighlighted) {
            result = nonSelectedFrontText + selectedText.toLowerCase() + nonSelectedBackText;
        }
        setText(result);
    }
    const handleCaClick = () => {

        let result = capitalize(text);

        const { nonSelectedFrontText, selectedText, nonSelectedBackText } = separateText(text, highlightedText);

        if (isFormatUponHighlighted) {
            result = nonSelectedFrontText + capitalize(selectedText) + nonSelectedBackText;
        }
        setText(result);
    }
    const handleRpClick = () => {
        let result = removePunctuation(text);

        const { nonSelectedFrontText,  selectedText, nonSelectedBackText} = separateText(text, highlightedText);

        if (isFormatUponHighlighted) {
            result = nonSelectedFrontText + removePunctuation(selectedText) + nonSelectedBackText;
        }
        setText(result);
    }

    const handleClearClick = () => {
        console.log("Upper Case was clicked " + text);
        setText('');
        onClearHighlightedText();
    }
    const handleOnChange = (event) => {
        console.log("Some change has been made in the text box ");
        setText(event.target.value);
        // This is basiclly used to update the value of text area in the textBox as the variable const text is a state and by default the value of this state variable text is default which is "This is a default text", and if we want to enable this value, which is only possible using onChange function in the textbox, so we need to tell react if the user types something in the textArea, which bascially means triggerr ing onChange function in textArea (onChange={handleOnChange}), so by mentioning "setText(event.target.value)", we will tell react to record this event and hence record the changes from the user and hence records the event and change the value of original state variable text using the above setText function.
    }
    const handleTextToAudio = () => {
        speak({ text });
    }

    console.log(isFormatUponHighlighted);
    return (
        <>
            <div className='container'>
                <h4>{props.heading}</h4>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        value={text}
                        onChange={handleOnChange}
                        id="exampleFormControlTextarea1"
                        rows="16"
                        ref={textAreaRef}
                    />
                </div>
                {/* Here we define onChange in this textArea as our value of the textArea is a state Variable and its state has to be upgraded everytime we make changes in the textBox, the upgadation in textArea value can be done by listening to this event onChange using a function having event and who's setTexT(event.target.value), updates the value of our state variable text which eventually changes the value in textArea of textBox.*/}
                <button className="btn btn-primary mx-1 mb-1" onClick={handleUPClick} >Convert to Upper Case</button>
                <button className="btn btn-primary mx-1 mb-1" onClick={handleLoClick} >Convert to Lower Case</button>
                <button className="btn btn-primary mx-1 mb-1" onClick={handleCaClick} >Capitalize</button>
                <button className="btn btn-primary mx-1 mb-1" onClick={handleRpClick} >Remove Punctuations</button>
                <button className="btn btn-primary mx-1 mb-1" onClick={handleClearClick} >Clear Text</button>
                <button className="btn btn-primary mx-1 mb-1" onClick={handleTextToAudio}>Listen Now</button>
                <div>
                    <input type="checkbox" onChange={(e) => setIsFormatUponHighlighted(e.target.checked)} checked={isFormatUponHighlighted} />
                    <label className="mx-1 mt-2">Format highlighted only</label>
                </div>
            </div>
            {/* Number of words and characters feature.*/}

            <div className="container my-3">
                <h4>Your Text Summary:</h4>
                <p><em>{text.split(" ").length} words and {text.length} characters.</em></p>
                <p><em>{text.split(" ").length * 0.008} minute read.</em></p>
                <h5>Preview</h5>
                <p>{text}</p>
            </div>
        </>
    )
}
