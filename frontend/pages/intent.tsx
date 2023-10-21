import React, { useState } from "react";
import Axios from "axios";

const Intent = () => {
  const [userInput, setUserInput] = useState("");
  const [inetentOutput, setIntentOutput] = useState<any>({
    amount: "",
    address: "",
    nftName: "",
  });

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
      setIntentOutput({
        amount: output.amount,
        address: output.address,
        nftName: output.nftname,
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const ResolveIntentAddress = async (output: any) => {
    if (output.address.slice(0, 2) != `0x`) {
      // get the address using the mail id
    } else {
      return output.address;
    }
  };

  //   const callGenerateEndpoint = async () => {
  //     console.log("calling api");
  //     try {
  //       const res = await Axios.get("http://localhost:3000/solve", {
  //         params: {
  //           intent: userInput,
  //           userAddress: address && address,
  //           chain: "Goerli",
  //         },
  //       });
  //       const transactions = JSON.parse(res.data.transactions);
  //       const data = JSON.parse(res.data)
  //       console.log(transactions)
  //       console.log(data)
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

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