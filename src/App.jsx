import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator} from '@chatscope/chat-ui-kit-react'
import './App.css'
import { useState } from 'react'


const API_KEY ="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"
function App() {
  const [typing,setTyping] =useState()
  const [messages,setMessages]=useState([{
     message:"Hello,I am ChatGPT!",
     sender:'ChatGPT'
  }])

  const handleSend =async (message)=>{
     const newMessage ={
      message:message,
      sender:'user',
      direction:"outgoing"
     }

     const newMessages=[...messages,newMessage] 
     setMessages(newMessages);
     setTyping(true);
     await processMessageToChatGPT(newMessages)
     }

     async function processMessageToChatGPT(chatMessages) {
      let apiMessages = chatMessages.map((messageObject) => {
        let role = "";
        if (messageObject.sender === "chatGPT") {
          role = "assistant";
        } else {
          role = "user";
        }
        return { role: role, content: messageObject.message };
      });
    
      const systemMessage = {
        role: "system",
        content: "Explain Health or medical related questions only.",
      };
    
      const apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...apiMessages],
      };
    
      await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY, // Fixed the typo in "Authorization"
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          console.log(data);
          console.log(data.choices[0].message.content);
          setMessages([...chatMessages,{
            message:data.choices[0].message.content,
            sender:"chatGPT"
          }])
        });
        setTyping(false);
    }
    

  return (
    <>
      <div className="App">
        <div style={{position:'relative',height:'550px',width:"600px"}}>
                <MainContainer>
                  <ChatContainer>
                    <MessageList typingIndicator={typing ? <TypingIndicator content="DocBOT is typing.." />:null}>
                           {
                            messages.map((message,i)=>{
                              return <Message key={i} model={message}/>
                            })
                           }
                    </MessageList>
                    <MessageInput placeholder='Type Message Here' onSend={handleSend}/>
                  </ChatContainer>
                </MainContainer>
        </div>
      </div>
       
    </>
  )
}

export default App
