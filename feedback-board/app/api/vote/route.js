import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import {Vote} from '@/app/models/Vote';

export async function POST(request){
  mongoose.connect(process.env.MONGO_URL);
  const jsonBody = await request.json();

  const {feedbackID} = jsonBody;
  const session = await getServerSession(authOptions);
  const {email: userEmail} = session.user; 

  const voteDocument = await Vote.create({feedbackID, userEmail});

  return Response.json(voteDocument)
}