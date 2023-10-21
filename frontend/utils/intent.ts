export const callGenerateEndpoint = async (userInput: string) => {
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
    const { output } = await data;
    console.log(output);
    const amount = await output.amount;
    const nftName = await output.nftname;
    const address = await output.address;
    return { output };
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

export const ResolveIntentAddress = async (output: any) => {
  if (output.address.slice(0, 2) != `0x`) {
    // get the address using the mail id
  } else {
    return output.address;
  }
};

