import mongoose from "mongoose";
import { Comment } from "@/app/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req){
  mongoose.connect(process.env.MONGO_URL);
  const jsonBody = await req.json();
  const session = await getServerSession(authOptions);

  const commentDoc = await Comment.create({
    text: jsonBody.text,
    uploads: jsonBody.uploads,
    userEmail: session.user.email,
    feedbackID: jsonBody.feedbackID,
  })

  return Response.json(commentDoc);
}

export async function GET(req){
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  if(url.searchParams.get('feedbackID')){
    return Response.json(
      await Comment.find({feedbackID: url.searchParams.get('feedbackID')})
    )
  }
  return Response.json(false);
}