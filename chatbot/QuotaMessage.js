const QuotaMessage = (message) => {
  let response =
    "This chat is getting too long. Please start again by entering START AGAIN or DELETE.";

  return (
    <div className="">
      <b>{response}</b>
    </div>
  );
};

export default QuotaMessage;
