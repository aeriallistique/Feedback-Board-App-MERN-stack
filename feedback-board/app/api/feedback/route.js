import mongoose from "mongoose";
import { Feedback } from "@/app/models/Feedback";

 const mongoURL = process.env.MONGO_URL;


export async function POST(request){
  const jsonBody = await request.json();
  const {title, description, uploads} = jsonBody;
  await mongoose.connect(mongoURL);

  await Feedback.create({title, description, uploads})
  return Response.json(jsonBody)
}

export async function GET(){
  await mongoose.connect(mongoURL);
  return Response.json(await Feedback.find());
}