// import dotenv from 'dotenv';
// dotenv.config();

// import OpenAI from "openai";
// import Log from "../db.js"; // Import the Log model

// // Function to check if a query is related to software engineering
// const isSoftwareEngineeringRelated = (query) => {
//   const softwareKeywords = [
//     "architecture", "design patterns", "scalability", "software development", 
//     "microservices", "object-oriented", "system design", "code review",
//     "agile", "DevOps", "software engineering", "backend", "frontend", "design", "system"
//   ];

//   return softwareKeywords.some(keyword => query.toLowerCase().includes(keyword));
// };

// // Function to modify the prompt for software engineering context with the unique response requirement
// const amendPromptForSoftwareEngineering = (userPrompt) => {
//   return `As an expert software architect, provide distinct and unique response to the following query: ${userPrompt}. 
// Each response should focus on different approaches, architectural patterns, technologies, or solutions. 
// For each response, please include:
// 1. A high-level overview of the approach or solution.
// 2. Key technologies or tools used (e.g., microservices, cloud-native architecture, monolithic architecture, etc.).
// 3. Real-world applications or use cases where this approach excels.
// 4. Pros and cons of the approach, including trade-offs related to scalability, performance, maintainability, and cost.
// Ensure that the responses are appropriate for an expert software architect with extensive experience in designing complex systems and making informed technology choices.
// Please provide only one complete and distinct solution.`;
// };

// export async function answerPrompt(messages, selectedResponseIndex = null) {
//   console.log(process.env.TOGGLE_API_ON);
//   console.log(process.env.TOGGLE_API_ON === "true");

//   if (process.env.TOGGLE_API_ON === "true") {
//     try {
//       console.log("Calling OpenAI");
//       const openai = new OpenAI({
//         apiKey: process.env["OPENAI_API_KEY"],
//       });

//       // Check if the user's query is related to software engineering
//       const userMessage = messages[messages.length - 1].content;
//       const isSoftwareRelated = isSoftwareEngineeringRelated(userMessage);

//       // If software-related, amend the prompt and request 3 unique responses
//       const amendedMessages = isSoftwareRelated
//         ? [
//             { role: 'system', content: 'You are an expert software architect providing professional advice.' },
//             ...messages.map((msg) => ({
//               role: msg.role,
//               content: msg.role === 'user' ? amendPromptForSoftwareEngineering(msg.content) : msg.content
//             }))
//           ]
//         : messages;

//       // Decide how many responses to request (3 for software-related, 1 for non-software-related)
//       const numberOfResponses = isSoftwareRelated ? 3 : 1;

//       const completion = await openai.chat.completions.create({
//         messages: amendedMessages, // Use amended messages if necessary
//         model: process.env.OPENAI_API_MODEL ? process.env.OPENAI_API_MODEL : "gpt-3.5-turbo-16k",
//         n: numberOfResponses,  // Request 3 unique responses for software-related, 1 for others
//       });

//       console.log("OpenAI API response:", completion);

//       // Format each response with clear separation (using '---' as a separator)
//       const answers = completion.choices.map(choice => `---\n${choice.message.content}\n---`);

//       // Log each response separately
//       for (const choice of completion.choices) {
//         const responseLogEntry = new Log({
//           role: 'assistant',
//           content: choice.message.content,
//         });
//         console.log("Logged response: ", responseLogEntry);
//         await responseLogEntry.save();
//       }

//       // Return the formatted responses
//       if (selectedResponseIndex !== null) {
//         return {
//           answers: [answers[selectedResponseIndex]],
//           tokens: completion.usage.total_tokens,
//         };
//       }

//       return {
//         answers: answers, // Return the formatted responses with separators
//         tokens: completion.usage.total_tokens,
//       };
//     } catch (e) {
//       console.log("error: ", e);
//       return {
//         errorMsg: "An error in the OpenAI API has occurred.",
//       };
//     }
//   } else {
//     const defaultResponse = {
//       answers: [
//         "Certainly! Here's a high-level technical solution for designing a review system for a bicycle park:\n1. Front-end Development:\n - Create a user-friendly web application or mobile app interface to gather reviews from users.\n   - Implement user authentication and authorization to ensure only registered users can write reviews.\n  ",
//         "Certainly! Here's another high-level technical solution for designing a review system for a bicycle park:\n1. Front-end Development:\n - Develop a responsive web application or mobile app interface to gather reviews from users.\n   - Implement user authentication to ensure only registered users can write reviews.\n  ",
//         "Certainly! Here's yet another high-level technical solution for designing a review system for a bicycle park:\n1. Front-end Development:\n - Design an intuitive web application or mobile app interface to gather reviews from users.\n   - Implement user authentication and authorization to ensure only registered users can write reviews.\n  ",
//       ],
//       tokens: 1500,
//     };

//     if (selectedResponseIndex !== null) {
//       return {
//         answers: [defaultResponse.answers[selectedResponseIndex]],
//         tokens: defaultResponse.tokens,
//       };
//     }

//     const logEntry = new Log({
//       role: 'assistant',
//       content: defaultResponse.answers.join("\n\n"),
//     });
//     await logEntry.save();

//     return defaultResponse;
//   }
// }

import dotenv from 'dotenv';
dotenv.config();

import OpenAI from "openai";
import Log from "../db.js"; // Import the Log model

// Function to check if a query is related to software engineering
const isSoftwareEngineeringRelated = (query) => {
  const softwareKeywords = [
    "architecture", "design patterns", "scalability", "software development", 
    "microservices", "object-oriented", "system design", "code review",
    "agile", "DevOps", "software engineering", "backend", "frontend", "design", "system"
  ];

  return softwareKeywords.some(keyword => query.toLowerCase().includes(keyword));
};

// Function to modify the prompt for software engineering context with the unique response requirement
const amendPromptForSoftwareEngineering = (userPrompt) => {
  return `As an expert software architect, provide distinct and unique response to the following query: ${userPrompt}. 
Each response should focus on different approaches, architectural patterns, technologies, or solutions. 
For each response, please include:
1. A high-level overview of the approach or solution.
2. Key technologies or tools used (e.g., microservices, cloud-native architecture, monolithic architecture, etc.).
3. Real-world applications or use cases where this approach excels.
4. Pros and cons of the approach, including trade-offs related to scalability, performance, maintainability, and cost.
Ensure that the responses are appropriate for an expert software architect with extensive experience in designing complex systems and making informed technology choices.
Please provide only one complete and distinct solution.`;
};

// Function to log all generated responses
const logAllResponses = async (userId, answers) => {
  for (const [index, answer] of answers.entries()) {
    const logEntry = new Log({
      role: 'assistant',
      userId: userId,
      content: `Response #${index + 1}: ${answer}`,
      responseIndex: index + 1, // Log response index
    });
    console.log("Logged response: ", logEntry);
    await logEntry.save();
  }
};

// Function to log the user's selected response
const logSelectedResponse = async (userId, selectedResponseIndex, latestResponses) => {
  const selectedResponse = latestResponses[selectedResponseIndex];
  const logContent = `User selected response #${selectedResponseIndex + 1}: ${selectedResponse}`;
  
  const logEntry = new Log({
    role: 'user',
    userId: userId,
    content: logContent,
    selectedResponseIndex: selectedResponseIndex + 1,
  });
  console.log(logContent);
  await logEntry.save();
};

export async function answerPrompt(messages, selectedResponseIndex = null, userId = null) {
  console.log(process.env.TOGGLE_API_ON);
  console.log(process.env.TOGGLE_API_ON === "true");

  if (process.env.TOGGLE_API_ON === "true") {
    try {
      console.log("Calling OpenAI");
      const openai = new OpenAI({
        apiKey: process.env["OPENAI_API_KEY"],
      });

      // Check if the user's query is related to software engineering
      const userMessage = messages[messages.length - 1].content;
      const isSoftwareRelated = isSoftwareEngineeringRelated(userMessage);

      // If software-related, amend the prompt and request 3 unique responses
      const amendedMessages = isSoftwareRelated
        ? [
            { role: 'system', content: 'You are an expert software architect providing professional advice.' },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.role === 'user' ? amendPromptForSoftwareEngineering(msg.content) : msg.content
            }))
          ]
        : messages;

      // Decide how many responses to request (3 for software-related, 1 for non-software-related)
      const numberOfResponses = isSoftwareRelated ? 3 : 1;

      const completion = await openai.chat.completions.create({
        messages: amendedMessages, // Use amended messages if necessary
        model: process.env.OPENAI_API_MODEL ? process.env.OPENAI_API_MODEL : "gpt-3.5-turbo-16k",
        n: numberOfResponses,  // Request 3 unique responses for software-related, 1 for others
      });

      console.log("OpenAI API response:", completion);

      // Format each response with clear separation (using '---' as a separator)
      const answers = completion.choices.map(choice => `---\n${choice.message.content}\n---`);

      // Log all generated responses
      await logAllResponses(userId, answers);

      // Return the formatted responses for the user to choose from
      return {
        answers: answers, // Return the formatted responses with separators
        tokens: completion.usage.total_tokens,
      };

    } catch (e) {
      console.log("error: ", e);
      return {
        errorMsg: "An error in the OpenAI API has occurred.",
      };
    }
  } else {
    const defaultResponse = {
      answers: [
        "Certainly! Here's a high-level technical solution for designing a review system for a bicycle park:\n1. Front-end Development:\n - Create a user-friendly web application or mobile app interface to gather reviews from users.\n   - Implement user authentication and authorization to ensure only registered users can write reviews.\n  ",
        "Certainly! Here's another high-level technical solution for designing a review system for a bicycle park:\n1. Front-end Development:\n - Develop a responsive web application or mobile app interface to gather reviews from users.\n   - Implement user authentication to ensure only registered users can write reviews.\n  ",
        "Certainly! Here's yet another high-level technical solution for designing a review system for a bicycle park:\n1. Front-end Development:\n - Design an intuitive web application or mobile app interface to gather reviews from users.\n   - Implement user authentication and authorization to ensure only registered users can write reviews.\n  ",
      ],
      tokens: 1500,
    };

    if (selectedResponseIndex !== null) {
      return {
        answers: [defaultResponse.answers[selectedResponseIndex]],
        tokens: defaultResponse.tokens,
      };
    }

    const logEntry = new Log({
      role: 'assistant',
      content: defaultResponse.answers.join("\n\n"),
    });
    await logEntry.save();

    return defaultResponse;
  }
}
export { logSelectedResponse };