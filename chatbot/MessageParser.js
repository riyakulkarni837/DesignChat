import React from "react";

const MessageParser = ({ children, actions }) => {
  //can use a prop to get hold of the current state and all the messages
  //just need to filter by the user

  const parse = (message) => {
    if (message.includes("DELETE")) {
      actions.handleDelete();
    } else if (message.includes("START AGAIN")) {
      actions.handleStartAgain(children?.props?.state?.messages);
    } else {
      actions.handleAIChat(message, children?.props?.state?.messages);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;
