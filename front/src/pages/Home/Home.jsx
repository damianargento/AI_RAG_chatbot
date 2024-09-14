import React, { useEffect, useState } from "react";
import Message from "../../components/Message";
import { FaRegStopCircle } from "react-icons/fa";
import axios from "axios";
import Loading from "../../components/Loading";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import PdfUploader from "../../components/PdfUploader";
import PdfList from "../../components/PdfList";

const Home = () => {
  const [question, setQuestion] = useState("");
  const [allMessageList, setAllMessageList] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [gptLoading, setGptLoading] = useState(false);
  const [newChatHovered, setNewChatHovered] = useState(false);
  const [apiCalling, setApiCalling] = useState(false);

  const location = useLocation();
  const chatContainerRef = useRef(null);
  const open = Boolean(anchorEl);

  const handleNewChat = () => {
    setAllMessageList([]);
  };

  const onMessageSend = () => {
    if (apiCalling) {
      setToast({
        open: true,
        type: "error",
        message: "Please wait for response",
      });
      return;
    }
    setApiCalling(true);
    const newMessage = {
      role: "user",
      content: question,
    };
    // Using functional update to ensure the latest state
    setAllMessageList((prevMessages) => {
      if (!prevMessages?.length) {
        // If prevMessages is blank, return a new array with only the newMessage
        return [newMessage];
      }
      // If prevMessages is not blank, concatenate it with the newMessage
      return [...prevMessages, newMessage];
    });
    setGptLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}query?query=${question}`, {
        query: question
      })
      .then((response) => {
        setGptLoading(false);
        const assistantMessage = {
          role: 'agent',
          content: JSON.stringify(response.data),
        }
        setAllMessageList((prevMessages) => [
          ...prevMessages,
          assistantMessage,
        ]);
        setApiCalling(false);
      })
      .catch((error) => {
        setGptLoading(false);
        setApiCalling(false);
      });
    setQuestion("");
  };

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [gptLoading]);

  return (
    <div className="flex font-inter">
      {location.pathname == "/" && (
        <div data-id="wrapper" className="flex-wrap content-between w-full m-lr-30">
              <div
                className="flex gap-2 group items-center cursor-pointer"
                onClick={() => handleNewChat()}
                onMouseEnter={() => setNewChatHovered(true)}
                onMouseLeave={() => setNewChatHovered(false)}
              >
                {newChatHovered ? (
                  <svg
                    width={30}
                    height={30}
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 3.99998C19.5926 3.62528 19.0532 3.42747 18.5002 3.44997C17.9471 3.47247 17.4256 3.71343 17.05 4.11998L10.17 11L9 15L13 13.83L19.88 6.99998C20.0888 6.81332 20.2579 6.5866 20.3774 6.33329C20.4968 6.07997 20.5642 5.80524 20.5754 5.5254C20.5866 5.24556 20.5414 4.96632 20.4426 4.70427C20.3437 4.44223 20.1932 4.20272 20 3.99998V3.99998Z"
                      stroke="black"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 3H4C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V20C3 20.2652 3.10536 20.5196 3.29289 20.7071C3.48043 20.8946 3.73478 21 4 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V12"
                      stroke="black"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width={30}
                    height={30}
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width={30} height={30} rx={5} fill="white" />
                    <path
                      d="M20 3.99998C19.5926 3.62528 19.0532 3.42747 18.5002 3.44997C17.9471 3.47247 17.4256 3.71343 17.05 4.11998L10.17 11L9 15L13 13.83L19.88 6.99998C20.0888 6.81332 20.2579 6.5866 20.3774 6.33329C20.4968 6.07997 20.5642 5.80524 20.5754 5.5254C20.5866 5.24556 20.5414 4.96632 20.4426 4.70427C20.3437 4.44223 20.1932 4.20272 20 3.99998V3.99998Z"
                      stroke="#A9ACB4"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 3H4C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V20C3 20.2652 3.10536 20.5196 3.29289 20.7071C3.48043 20.8946 3.73478 21 4 21H20C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20V12"
                      stroke="#A9ACB4"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                <div className="bg-bg_sidebar-black text-white py-1 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  New Chat
                </div>
              </div>
              <div className="flex font-inter">
              {location.pathname == "/" && (
                <div data-id="wrapper" className="flex w-full">
                  {/* Left Side: PdfList and PdfUploader */}
                  <div className="w-[25%]">
                    <PdfList />
                    <PdfUploader />
                  </div>

                  {/* Right Side: Input, Button, and Messages */}
                  <div className="w-[75%] ml-auto">
                    <div
                      data-id="messages-container"
                      ref={chatContainerRef}
                      className="flex-grow gap-4 flex flex-col custom-scrollbar"
                    >
                      {allMessageList?.map((item, index) => (
                        <Message data={item} key={index} />
                      ))}
                      {gptLoading && (
                        <div className="flex gap-4 bg-module-background-gray p-4 rounded-lg">
                          <div className="w-[32px] h-[32px] rounded-full bg-chat-icon-orange profile_img"></div>
                          <div className="flex flex-col">
                            <Loading />
                          </div>
                        </div>
                      )}

                      {(allMessageList?.length === 0 || allMessageList == null) && (
                        <span className="text-2xl w-full font-semibold justify-center items-center h-full">
                          To start ask any question related to the documents
                        </span>
                      )}
                    </div>

                    {/* Input and Send Button */}
                    <div className="flex items-center gap-2 mt-4">
                      <input
                        id="question"
                        name="question"
                        type="text"
                        autoComplete="question"
                        placeholder="Ask a question .."
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && onMessageSend()}
                        value={question}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                      <div className="cursor-pointer" onClick={onMessageSend}>
                        {gptLoading ? (
                          <FaRegStopCircle size={25} />
                        ) : (
                          <svg
                            width={35}
                            height={35}
                            viewBox="0 0 35 35"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M23.6105 2.91663H11.3897C6.08133 2.91663 2.91675 6.08121 2.91675 11.3895V23.5958C2.91675 28.9187 6.08133 32.0833 11.3897 32.0833H23.5959C28.9042 32.0833 32.0688 28.9187 32.0688 23.6104V11.3895C32.0834 6.08121 28.9188 2.91663 23.6105 2.91663ZM24.5292 15.7791C24.1063 16.202 23.4063 16.202 22.9834 15.7791L18.5938 11.3895V26.25C18.5938 26.8479 18.098 27.3437 17.5001 27.3437C16.9022 27.3437 16.4063 26.8479 16.4063 26.25V11.3895L12.0167 15.7791C11.5938 16.202 10.8938 16.202 10.4709 15.7791C10.2522 15.5604 10.1501 15.2833 10.1501 15.0062C10.1501 14.7291 10.2667 14.4375 10.4709 14.2333L16.7272 7.97704C16.9313 7.77288 17.2084 7.65621 17.5001 7.65621C17.7917 7.65621 18.0688 7.77288 18.273 7.97704L24.5292 14.2333C24.9522 14.6562 24.9522 15.3416 24.5292 15.7791Z"
                              fill={question.length > 0 ? "#111" : "#d9d9e3"}
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
        </div>
      )}
    </div>
  );
};

export default Home;
