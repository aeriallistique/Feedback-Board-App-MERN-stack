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

  const feedbackDoc = await Feedback.create({title, description, uploads, userEmail})
  return Response.json(feedbackDoc)
}

export async function GET(req){
  await mongoose.connect(mongoURL);
  const url = new URL(req.url);

  if(url.searchParams.get('id')){
    return Response.json(
      await Feedback.findById(url.searchParams.get('id'))
      )
    }else{
      const sortParam = url.searchParams.get('sort');
    let sortDef;
    if(sortParam === 'latest'){
      sortDef = {createdAt: -1}
    }
    if(sortParam === 'oldest'){
      sortDef = {createdAt:1}
    }
    if(sortParam === 'votes'){
      sortDef= {votesCountCashed: -1}
    }

    return Response.json(await Feedback.find(null, null, {sort:sortDef}).populate('user'));
  }
  
}

export async function PUT(){
  const jsonBody = await request.json();
  const {title, description, uploads, id} = jsonBody;
  await mongoose.connect(mongoURL);
  const session = await getServerSession(authOptions); 
  if(!session){
    return Response.json(false);
  }
  const newFeedbackDoc = await Feedback.updateOne({_id: id, userEmail: session.user.email}, 
    {title, description, uploads})

  return Response.json(newFeedbackDoc);
}