const AI_API_KEY = "AIzaSyB1U2RjT3T9H1chDvnsabk1Feq61nEt5Lk";

export async function getAIResponse(message, conversationHistory = []) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${AI_API_KEY}`;

  // Combining previous conversation history with current message
  const fullMessage = `
    This is a conversation between a user and AI. Here is the previous conversation:
    ${conversationHistory.join("\n")}
    
    User: ${message}
    AI:`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: fullMessage }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API response error:", response.status, errorBody);
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody}`
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts
    ) {
      console.error("Unexpected API response structure:", data);
      throw new Error("Unexpected API response structure");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error in getAIResponse:", error);
    throw error;
  }
}

// export async function getAIResponse(message) {
//   console.log(AI_API_KEY);

//   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${AI_API_KEY}`;

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [{ text: message }],
//           },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       const errorBody = await response.text();
//       console.error("API response error:", response.status, errorBody);
//       throw new Error(`API request failed with status ${response.status}`);
//     }

//     const data = await response.json();

//     if (
//       !data.candidates ||
//       !data.candidates[0] ||
//       !data.candidates[0].content ||
//       !data.candidates[0].content.parts
//     ) {
//       console.error("Unexpected API response structure:", data);
//       throw new Error("Unexpected API response structure");
//     }

//     return data.candidates[0].content.parts[0].text;
//   } catch (error) {
//     console.error("Error in getAIResponse:", error);
//     throw error;
//   }
// }
