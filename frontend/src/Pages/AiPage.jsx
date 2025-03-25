import { useState, useRef, useEffect } from "react";
import { axiosInstance } from '../lib/axios.lib';

const AiPage = () => {
  
  const [messageSending , setMessageSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const getResult = async (message) => {
    try {
      const res = await axiosInstance.post('/ai-route/get-result', { message }); // POST request sends data in body
      return res.data.result;

    } catch (error) {
      console.error("Error fetching result:", error);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      setSelectedImage(file);
    }
    return null;
  };


  const handleSend = async(e) => {
    if (e) e.preventDefault();
    try {
      setMessageSending(true);
      if (!inputMessage.trim()) return;
      setInputMessage("");
      const aiResponse = await getResult(inputMessage)
      const userMessage = {
        text: inputMessage.trim() || null, 
        image: selectedImage ? URL.createObjectURL(selectedImage) : null, // Create URL if an image is selected
        sender: "user",
      };
      const aiMessage = {
        text : aiResponse,
        sender: "ai",
      }
      setMessages([...messages, userMessage , aiMessage]);
      setSelectedImage(null);
    } catch (error) {
      console.log(error);
    } finally{
      setMessageSending(false);
    }    
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); 
        handleSend(e);
      }
    };
  
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [inputMessage]);
  

  return (
    <div className="bg-gradient-to-b from-[#121212] to-[#1A1A1A] h-screen w-full flex justify-center items-center">
      {/* Main Container */}
      <div className="w-[80%] max-w-[1200px] h-[90vh] p-[20px] bg-[#121212] rounded-[15px] shadow-[0px_5px_15px_rgba(0,0,0,0.3)] flex flex-col">
        {/* Chat Section */}
        <div className="w-full flex-1 p-[20px] bg-[#181A1B] rounded-[10px] overflow-y-auto flex flex-col space-y-[15px] scrollbar-hide" ref={chatContainerRef}>
          {
            messages.length === 0 ? (
              <div className="flex justify-center items-center h-screen text-white text-[32px] font-mono font-semibold  transition-colors duration-1000 ease-in-out hover:text-blue-400">
                Ask me anything, I'm here to help!
              </div>
            ) : ""
          }
          {messages.map((message) => {
            {
              /* User Message */
            }
            if (message.sender === "user") {
              if (message.image) {
                return (
                  <>
                    <div className="flex justify-end">
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="w-[200px] h-[200px] object-cover rounded-lg border border-gray-600 shadow-lg"
                      />
                    </div>
                    <div className="flex justify-end">
                      <div
                        className="w-[max(40%,250px)] max-w-[600px] p-[15px] 
                                                    rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] 
                                                    bg-[#2A2A2A] text-white text-[16px] leading-[1.4] fade-in"
                      >
                        {message.text}
                      </div>
                    </div>
                  </>
                );
              }
              return (
                <div className="flex justify-end">
                  <div
                    className="w-[max(40%,250px)] max-w-[600px] p-[15px] 
                                                rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] 
                                                bg-[#2A2A2A] text-white text-[16px] leading-[1.4] fade-in"
                  >
                    {message.text}
                  </div>
                </div>
              );
            }

            if (message.sender === "user" && message.image) {
              return (
                <div className="flex justify-end">
                  <img src={message.image} alt="image" />
                  <div
                    className="w-[max(40%,250px)] max-w-[600px] p-[15px] 
                                                rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[4px] 
                                                bg-[#2A2A2A] text-white text-[16px] leading-[1.4] fade-in"
                  >
                    {message.text}
                  </div>
                </div>
              );
            }

            {
              /* AI Response */
            }
            if (message.sender === "ai") {
              return (
                <div className="flex justify-start">
                  <div
                    className="w-[max(40%,250px)] max-w-[600px] p-[15px] 
                                                rounded-tl-[12px] rounded-tr-[12px] rounded-br-[4px] rounded-bl-[12px] 
                                                bg-gradient-to-r from-[#007AFF] to-[#00C6FF] 
                                                text-white text-[16px] leading-[1.4] fade-in"
                  >
                    {message.text}
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* Message Input Section */}
        <div className="h-[12vh] w-full bg-[#1E1E1E] rounded-[12px] flex items-center p-[10px] shadow-[0px_0px_10px_rgba(0,122,255,0.2)] gap-4 mt-4">
          {/* Input Field */}
          <input
            type="text"
            placeholder="Ask Anything..."
            className="w-[90%] h-[50px] bg-[#121212] border-[1px] border-[#2A2A2A] 
                        text-[16px] px-[12px] rounded-[8px] placeholder-[#888888] text-white 
                        focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition"
            value={inputMessage}
            disabled={messageSending}
            onChange={(e) => setInputMessage(e.target.value) }
          />

          {/* Image Upload if imageUpload enables we will set w-[70%] */}
          {/* <label
            className="w-[15%] h-[50px] flex items-center justify-center bg-[#252525] 
                              border-[2px] border-dashed border-[#007AFF] rounded-[10px] 
                              cursor-pointer hover:shadow-[0px_0px_10px_rgba(0,122,255,0.5)] transition"
          >
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={messageSending}
            />
            <span className="text-[#007AFF] text-[14px]">Upload Image</span>
          </label> */}

          {/* Send Button */}
          <button
            className="w-[12%] h-[50px] bg-[#007AFF] text-white rounded-[10px] 
                               hover:bg-[#005FCC] flex items-center justify-center text-[16px] 
                               font-semibold transition"
            onClick={handleSend}
          >
            {
              messageSending ? "Stop" : "Send"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPage;
