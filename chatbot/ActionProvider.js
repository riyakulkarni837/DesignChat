// import React, { useState } from "react";
// import fetchJson from "../lib/fetchJson";
// import { createCustomMessage, createChatBotMessage } from "react-chatbot-kit";

// const ActionProvider = ({ createChatBotMessage, setState, children }) => {
//   const [startActiveChat, setStartActiveChat] = useState(1);

//   // Handles interaction with AI, requesting and handling three distinct responses
//   const handleAIChat = async (newPrompt, prevMessages, selectedResponseIndex = null) => {
//     try {
//       const body = {
//         newPrompt: newPrompt,
//         promptHistory: prepareData(prevMessages), // Prepare chat history for the API
//       };

//       const holdingMessage = createCustomMessage("...", "loader", {
//         payload: "LOADER",
//       });

//       // Add loader message while waiting for a response
//       setState((prev) => ({
//         ...prev,
//         messages: [...prev.messages, holdingMessage],
//       }));

//       console.log("Request body:", body);

//       // Call the API to fetch responses
//       const result = await fetchJson("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       console.log("API result:", result);

//       let newMessages = [];

//       // Iterate over each response and display it as a chat message
//       if (result.contents && Array.isArray(result.contents)) {
//         result.contents.forEach((content, index) => {
//           console.log(`Response ${index + 1}:`, content);
//           const botMessage = createChatBotMessage(content, {
//             widget: "markdownToHtml",
//             payload: content,
//           });
//           newMessages.push(botMessage);
//         });
//       } else {
//         console.error("Unexpected API result format:", result);
//       }

//       // If close to token limit, show a warning message
//       if (result.closeToTokenLimit) {
//         const quotaMessage = createCustomMessage(
//           "Close to the API token limit.",
//           "quota"
//         );
//         newMessages.push(quotaMessage);
//       }

//       // Remove the loader message and add the new bot messages
//       setState((prev) => ({
//         ...prev,
//         messages: [
//           ...prev.messages.filter((message) => message.type !== "loader"),
//           ...newMessages,
//         ],
//       }));
//     } catch (e) {
//       showErrorMessage(e);
//     }
//   };

//   // Handles user input and identifies if a response selection is being made
//   const handleUserInput = async (input) => {
//     const prevMessages = [...state.messages];
//     const selectionCommandMatch = input.match(/select response (\d+)/i);

//     if (selectionCommandMatch) {
//       const selectedResponseIndex = parseInt(selectionCommandMatch[1], 10) - 1;
//       handleAIChat(input, prevMessages, selectedResponseIndex);
//     } else {
//       handleAIChat(input, prevMessages);
//     }
//   };

//   // Error message display in case of API or network failure
//   const showErrorMessage = (e) => {
//     console.error("An error has occurred", e); // Log full error details for debugging
//     const errorMessage = createCustomMessage(
//       "An error occurred while processing your request. Please try again.",
//       "error",
//       {
//         payload: "ERROR",
//       }
//     );

//     setState((prev) => ({
//       ...prev,
//       messages: [
//         ...prev.messages.filter((message) => message.type !== "loader"),
//         errorMessage,
//       ],
//     }));
//   };

//   // Prepare chat history for API request by filtering out non-chat messages
//   const prepareData = (messages) => {
//     return messages
//       .slice(startActiveChat)
//       .filter((chat) => !["quota", "loader", "error"].includes(chat.type))
//       .map((message) => ({
//         message: message.message.length ? message.message : message.payload.content,
//         type: message.type,
//       }));
//   };

//   // Clears the chat history
//   const handleDelete = () => {
//     setState((prev) => ({
//       messages: [],
//     }));
//     setStartActiveChat(0);
//   };

//   // Reset the chat state and start a new conversation
//   const handleStartAgain = (prevMessages) => {
//     setStartActiveChat(prevMessages.length + 1);
//   };

//   return (
//     <div>
//       {React.Children.map(children, (child) => {
//         return React.cloneElement(child, {
//           actions: {
//             handleUserInput,
//             handleAIChat,
//             handleDelete,
//             handleStartAgain,
//           },
//         });
//       })}
//     </div>
//   );
// };

// export default ActionProvider;


import React, { useState } from "react";
import fetchJson from "../lib/fetchJson";
import { createCustomMessage, createChatBotMessage } from "react-chatbot-kit";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const [startActiveChat, setStartActiveChat] = useState(1);

  // Handles interaction with AI, requesting and handling responses
  const handleAIChat = async (newPrompt, prevMessages) => {
    try {
      const body = {
        newPrompt: newPrompt,
        promptHistory: prepareData(prevMessages),
      };
  
      const holdingMessage = createCustomMessage("...", "loader", {
        payload: "LOADER",
      });
  
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, holdingMessage],
      }));
  
      const result = await fetchJson("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      let newMessages = [];
  
      if (result.contents && Array.isArray(result.contents)) {
        // Display all the generated responses as separate messages
        result.contents.forEach((content, index) => {
          const botMessage = createChatBotMessage(`Response ${index + 1}: ${content}`);
          newMessages.push(botMessage);
        });
  
        // Prompt the user to select an option only if multiple responses are generated
        if (result.contents.length > 1) {
          const selectionPrompt = createChatBotMessage(
            "Which option would you like to explore further? Please select response 1, 2, or 3."
          );
          newMessages.push(selectionPrompt);
        }
      } else {
        // Error handling for an unexpected result format
        console.error("Unexpected API result format:", result);
      }
  
      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages.filter((message) => message.type !== "loader"),
          ...newMessages,
        ],
      }));
    } catch (e) {
      showErrorMessage(e);
    }
  };
  
  

  // Handle user input to select a response or send a new prompt
  const handleUserInput = async (input) => {
    const prevMessages = [...state.messages];
    const selectionCommandMatch = input.match(/select response (\d+)/i);

    if (selectionCommandMatch) {
      const selectedResponseIndex = parseInt(selectionCommandMatch[1], 10) - 1;

      // Send the selected response back to the server for logging
      await fetchJson("/api/log-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id, // Assuming you have user info
          selectedResponseIndex: selectedResponseIndex,
          promptHistory: prevMessages,
          isReselection: prevMessages.some(msg => msg.type === 'user' && msg.message.includes("select response")), // Detect if this is a reselection
        }),
      });

      handleAIChat(input, prevMessages, selectedResponseIndex);
    } else {
      handleAIChat(input, prevMessages);
    }
  };

  // Error handling
  const showErrorMessage = (e) => {
    const errorMessage = createCustomMessage(
      "An error occurred while processing your request. Please try again.",
      "error",
      {
        payload: "ERROR",
      }
    );

    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages.filter((message) => message.type !== "loader"),
        errorMessage,
      ],
    }));
  };

  const prepareData = (messages) => {
    return messages
      .slice(startActiveChat)
      .filter((chat) => !["quota", "loader", "error"].includes(chat.type))
      .map((message) => ({
        message: message.message.length ? message.message : message.payload.content,
        type: message.type,
      }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleUserInput,
            handleAIChat,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
