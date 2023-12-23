import mongoose from "mongoose";
import { Feedback } from "@/app/models/Feedback";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

 const mongoURL = process.env.MONGO_URL;


export async function POST(request){
  const jsonBody = await request.json();
  const {title, description, uploads} = jsonBody;
  await mongoose.connect(mongoURL);
  const session = await getServerSession(authOptions); 
  const userEmail = session.user.email;

  await Feedback.create({title, description, uploads, userEmail})
  return Response.json(jsonBody)
}

export async function GET(){
  await mongoose.connect(mongoURL);
  return Response.json(await Feedback.find());
}