import { createContext } from "react";
import runChat from "../config/gemini";
import { useState } from "react";

export const Context = createContext();

const ContextProvider = (props) => {
    // Building a state variable 
    // The second element is a function used to update the state value
    const [input, setInput] = useState("");//input given by user
    const [recentPrompt, setRecentPrompt] = useState("");// input will be saved in recentprompt by clicking send button
    const [prevPrompts, setPrevPrompts] = useState([]);//display all history of recent tab
    const [showResult, setShowResult] = useState(false);//if true it will hide the greet message and card section and display the result 
    const [loading, setLoading] = useState(false);// if true it will show loading animation
    const [resultData, setResultData] = useState("");//display the result on webpage
    
    // any variable or function we can use anywhere in the project
  const delayPara = (index, nextword) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextword);
    }, 75 * index);//75 millisecond with 0 index then 75 millisecond for 1 index and so on
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };
//  onSent function will send its data to  Main.Jsx
  const onSent = async (prompt) => {
    setResultData("");//remove previous data
    setLoading(true);//display loading animation
    setShowResult(true);//remove greet and card massage
    let response;
    // contextprovider will provide context_value in runchat()
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);// ... is a spread syntax in which used to create a copy of the previous prevPrompts array .This ensures that the original state remains unmodified.
      setRecentPrompt(input);
      response = await runChat(input);
    }
    // logic for response to be used as useful response
    let responseArray = response.split("**");// if ** ocuur in even number then it will make it bold
    let newResponse = "";//it will remove undefined from starting of a line
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");//if * occur it will print blank new line
    let newResponseArray = newResponse2.split(" ");
    // it will call delayPara 
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };
//   all the state variables are grouped in contextValue because it acts like a central storage for frequently used data in your React application
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };
  //  Context Provider-:  providing context data to descendant components in the React component tree
  // ContextValue -: his variable likely holds the context data that you want to make accessible to child components.
//   The props.children prop refers to any child components passed to this component.0
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
