import { createChatBotMessage } from "react-chatbot-kit";
import QuotaMessage from "./QuotaMessage";
import LoaderMessage from "./LoaderMessage";
import MarkdownToHtml from "./MarkdownWidget";
import ErrorMessage from "./ErrorMessage";

const botName = "The Design Challenge Bot";

const config = {
  initialMessages: [
    createChatBotMessage(`Hi! I'm ready to help you design software.`),
  ],
  botName: botName,
  customMessages: {
    quota: (props) => <QuotaMessage {...props} />,
    loader: (props) => <LoaderMessage {...props} />,
    error: (props) => <ErrorMessage {...props} />,
  },
  widgets: [
    {
      widgetName: "markdownToHtml",
      widgetFunc: (props) => <MarkdownToHtml {...props} />,
      props: ["message"],
    },
  ],
};

export default config;
