import axios from "axios";
import { Request, Response } from "express";

const thirdPartyVcomissionController = async (req: Request, res: Response) => {
  try {
    const response = await axios.get("https://api.trackier.com/v2/publisher/campaigns", {
      headers: {
        "X-Api-Key": "67a6030da07e8cc83b014061b2567a6030da0816", // Your API key
      },
    });

    res.status(200).json(response.data); // Send the API response correctly
  } catch (err:unknown) {
    res.status(400).json({ message: "Something went wrong!", error: err });
  }
};

export default thirdPartyVcomissionController;
