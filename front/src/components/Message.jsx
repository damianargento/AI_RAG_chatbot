import React from "react";

const Message = ({ data }) => {
  const message = data?.content;

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
            <div className="text-[10px] font-medium rounded-full bg-button-selected-blue w-[32px] h-[32px] flex justify-center items-center">
              HO
            </div>
          )}
          {data.role != "user" && (
            <div className="w-[32px] h-[32px] rounded-full bg-chat-icon-orange profile_img">
              H1
            </div>
          )}
        </div>
        <div className="flex flex-col font-DM_Sans text-lg">
            <span className="font-bold">
              {data?.role == "user" ? "User" : 'assistant'}
            </span>
            {data.role != "user" && (
            <span className="text-justify text-chat-font leading-6 max-w-full" style={{wordBreak:"break-word"}}>
              {message}
            </span>
            )}
            {data.role == "user" && (
            <span className="text-justify text-chat-font leading-6 max-w-full" style={{wordBreak:"break-word"}}>
              {message}
            </span>
            )}
          </div>
      </div>)
      }
    </>
  );
};

export default Message;
