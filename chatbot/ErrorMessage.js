// shows an error message to the user
const ErrorMessage = (message) => {
  let response = "An error has occured. Please try entering your message again";

  return <div className="font-bold">{response}</div>;
};

export default ErrorMessage;
