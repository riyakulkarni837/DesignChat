import Chatbot from "react-chatbot-kit";
import config from "../chatbot/config.js";
import MessageParser from "../chatbot/MessageParser.js";
import ActionProvider from "../chatbot/ActionProvider.js";

const validator = (input) => {
  if (!input.replace(/\s/g, "").length)
    //check if only composed of spaces
    return false;
  if (input.length > 1)
    //check if the message is empty
    return true;
  return false;
};

export const MyChatBotComponent = () => {
  return (
    <div>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        placeholderText="Please enter your prompt. Enter DELETE to delete all history and start again. Enter START AGAIN to start again but keep the chat history."
        validator={validator}
      />
    </div>
  );
};
