import mongoose from "mongoose";
import { Feedback } from "@/app/models/Feedback";

export async function POST(request){
  const jsonBody = await request.json();
  const mongoURL = process.env.MONGO_URL;
  const {title, description, uploads} = jsonBody;
  await mongoose.connect(mongoURL);

  await Feedback.create({title, description, uploads})
  return Response.json(jsonBody)
}

export async function GET(){
  return Response.json(await Feedback.find());
}