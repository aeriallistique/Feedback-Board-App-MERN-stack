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

  // find existing vote
  const existingVote = await Vote.findOne({feedbackID, userEmail})
  if(existingVote){
    // if there's a vote, then remove it
    await Vote.findByIdAndDelete(existingVote._id);
    return Response.json(existingVote);
  }else{
    const voteDocument = await Vote.create({feedbackID, userEmail});
    return Response.json(voteDocument)
  }
}


export async function GET(request){
  const url = new URL(request.url);
  if(url.searchParams.get('feedbackIds')){
    const feedbackIds = url.searchParams.get('feedbackIds').split(',');
    const votesDocs = await Vote.find({feedbackID: feedbackIds});
    return Response.json(votesDocs);
  }
  
  return Response.json([])
}