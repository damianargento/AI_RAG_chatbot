import React from "react";
import he from 'he'
import {marked} from 'marked';
import HTMLReactParser from 'html-react-parser';

const Message = ({ data }) => {
  let message = data?.content;
   if (data.role !== "user"){
        message = message.slice(1,-1)
      }
  // Decodifica el mensaje
  const decodedMessage = marked(he.decode(message));
  
  let JsonContent
      if (data.role != "user"){
        JsonContent = JSON.parse(data.content)
      }
  return (
    <>
      {(<div
        key={data?.id}
        className={
          data.role == "user"
            ? "flex gap-4 p-4"
            : "flex gap-4 bg-module-background-gray p-4 rounded-lg"
        }
      >
        <div>
          {data.role == "user" && (
            <div className="rounded-full bg-button-selected-blue w-[32px] h-[32px] flex justify-center items-center">
            </div>
          )}
          {data.role != "user" && (
            <div className="rounded-full w-[32px] h-[32px] flex justify-center items-center bg-chat-icon-orange">
            </div>
          )}
        </div>
        <div className="flex flex-col font-DM_Sans text-lg">
            <span className="font-bold">
              {data?.role == "user" ? "User" : 'Assistant'}
            </span>
            {data.role != "user" && (
            <span className="text-justify text-chat-font leading-6 max-w-full" style={{wordBreak:"break-word"}}>
             {HTMLReactParser(decodedMessage)}
            </span>
            )}
            {data.role == "user" && (
            <span className="text-justify text-chat-font leading-6 max-w-full" style={{wordBreak:"break-word"}}>
             {HTMLReactParser(decodedMessage)}
            </span>
            )}
          </div>
      </div>)
      }
    </>
  );
};

export default Message;
