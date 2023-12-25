import mongoose from "mongoose";
import { Comment } from "@/app/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req){
  mongoose.connect(process.env.MONGO_URL);
  const jsonBody = await req.json();
  const session = await getServerSession(authOptions);
  if(!session){
    return Response.json(false);
  }
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
    const result = await Comment
      .find({feedbackID: url.searchParams.get('feedbackID')})
      .populate('user')

    return Response.json(
      result.map(doc=> {
        const {userEmail, ...commentWithoutEmail} = doc.toJSON();
        const{email, ...userWithoutEmail} = commentWithoutEmail.user;
        commentWithoutEmail.user = userWithoutEmail;
        return commentWithoutEmail;
      })
      )
  }
  return Response.json(false);
}