import mongoose from "mongoose";
import { Feedback } from "@/app/models/Feedback";

export async function POST(request){
  const jsonBody = await request.json();
  const mongoURL = process.env.MONGO_URL;
  const {title, description} = jsonBody;
  await mongoose.connect(mongoURL);

  await Feedback.create({title, description})
  return Response.json(jsonBody)
}

