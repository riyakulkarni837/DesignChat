// import { withIronSessionApiRoute } from "iron-session/next";
// import { sessionOptions } from "../../lib/session";
// import { getLogger } from "../../lib/logUtil";
// import { answerPrompt } from "./openai";
// import Log from "../db.js"; // Import the Log model

// async function chatRoute(req, res) {
//   const user = req.session.user;
//   const logger = getLogger("chatAPI");
//   const TOKEN_LIMIT = process.env.TOKEN_LIMIT ? process.env.TOKEN_LIMIT : 15700;

//   if (!user || user.isLoggedIn === false) {
//     res.status(401).end();
//     return;
//   }

//   const body = req.body;
//   logger.info({ user: user.chatHandle, prompts: body });

//   let messages = [{ role: "user", content: body.newPrompt }];
//   if (body.promptHistory) {
//     const history = body.promptHistory.map(({ type, message }) => ({
//       role: type === "user" ? "user" : "assistant",
//       content: message,
//     }));
//     messages = [...history, ...messages];
//   }

//   // Log the user message
//   const userLogEntry = new Log({
//     role: 'user',
//     content: body.newPrompt,
//   });
//   await userLogEntry.save();

//   let result;

//   // Check if the prompt is a selection command
//   const selectionCommandMatch = body.newPrompt.match(/select response (\d+)/i);
//   if (selectionCommandMatch) {
//     const selectedIndex = parseInt(selectionCommandMatch[1], 10) - 1;
//     if (body.promptHistory && body.promptHistory.length > 0 && selectedIndex >= 0) {
//       const selectedResponse = body.promptHistory[selectedIndex];
//       result = {
//         answers: [selectedResponse.message],
//         tokens: 0,
//       };
//     } else {
//       result = {
//         errorMsg: "Invalid selection. Please select a valid response number.",
//       };
//     }
//   } else {
//     // Call OpenAI API to get new responses
//     result = await answerPrompt(messages);
//   }

//   logger.info({
//     user: user.chatHandle,
//     responses: result.answers,
//     tokens: result.tokens,
//   });

//   if (result.answers?.length > 0) {
//     res.status(200).json({
//       role: "bot",
//       contents: result.answers,
//       tokens: result.tokens,
//       token_limit: TOKEN_LIMIT,
//       closeToTokenLimit: result.tokens > TOKEN_LIMIT,
//       isError: false,
//     });
//   } else {
//     logger.error({
//       user: user.chatHandle,
//       response: result.errorMsg,
//     });

//     res.status(200).json({
//       role: "bot",
//       content: result.errorMsg,
//       isError: true,
//     });
//   }
// }

// export default withIronSessionApiRoute(chatRoute, sessionOptions);

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { getLogger } from "../../lib/logUtil";
import { answerPrompt } from "./openai";
import { logSelectedResponse } from "./openai"; // Ensure this is correctly imported
import Log from "../db.js"; // Import the Log model

// In-memory storage for the latest responses
let latestResponses = [];

// This function handles incoming chat messages and calls the OpenAI API
async function chatRoute(req, res) {
  const user = req.session.user;
  const logger = getLogger("chatAPI");
  const TOKEN_LIMIT = process.env.TOKEN_LIMIT ? process.env.TOKEN_LIMIT : 15700;

  // User needs to be logged in to use the chat API
  if (!user || user.isLoggedIn === false) {
    res.status(401).end();
    return;
  }

  const body = req.body;
  logger.info({ user: user.chatHandle, prompts: body });

  let messages = [{ role: "user", content: body.newPrompt }];
  if (body.promptHistory) {
    const history = body.promptHistory.map(({ type, message }) => ({
      role: type === "user" ? "user" : "assistant",
      content: message,
    }));
    messages = [...history, ...messages];
  }

  // Log the user message
  const userLogEntry = new Log({
    role: 'user',
    content: body.newPrompt,
  });
  await userLogEntry.save();

  let result;

  // Check if the prompt is a selection command (for selecting a response)
  const selectionCommandMatch = body.newPrompt.match(/select response (\d+)/i);
  if (selectionCommandMatch) {
    const selectedIndex = parseInt(selectionCommandMatch[1], 10) - 1;
    if (selectedIndex >= 0 && selectedIndex < latestResponses.length) {
      const selectedResponse = latestResponses[selectedIndex];
      
      // Log the user's selected response
      await logSelectedResponse(user.id, selectedIndex, latestResponses);

      result = {
        answers: [selectedResponse], // Return the selected response
        tokens: 0,
      };
    } else {
      result = {
        errorMsg: "Invalid selection. Please select a valid response number.",
      };
    }
  } else {
    // Call OpenAI API to get new responses
    result = await answerPrompt(messages, null, user.id); // Pass the user ID to log responses
    latestResponses = result.answers; // Store the latest responses in memory for selection
  }

  logger.info({
    user: user.chatHandle,
    responses: result.answers,
    tokens: result.tokens,
  });

  if (result.answers?.length > 0) {
    res.status(200).json({
      role: "bot",
      contents: result.answers,
      tokens: result.tokens,
      token_limit: TOKEN_LIMIT,
      closeToTokenLimit: result.tokens > TOKEN_LIMIT,
      isError: false,
    });
  } else {
    logger.error({
      user: user.chatHandle,
      response: result.errorMsg,
    });

    res.status(200).json({
      role: "bot",
      content: result.errorMsg,
      isError: true,
    });
  }
}

export default withIronSessionApiRoute(chatRoute, sessionOptions);
