import React, { useState } from "react";

const Intent = () => {
  const [userInput, setUserInput] = useState("");

  const callGenerateEndpoint = async () => {
    console.log("Calling OpenAI...");
    console.log(userInput);

    try {
      const response = await fetch("/api/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data from the API");
      }
      const data = await response.json();
      const { output } = data;
      console.log(output);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setUserInput(e.target.value)}
        className="text-black w-96"
        value={userInput}
      ></input>
      <button onClick={() => callGenerateEndpoint()}>get</button>
    </div>
  );
};

export default Intent;
