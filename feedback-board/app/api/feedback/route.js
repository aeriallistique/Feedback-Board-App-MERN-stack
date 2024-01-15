import mongoose from "mongoose";
import { Feedback } from "@/app/models/Feedback";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Comment } from "@/app/models/Comment";

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
      const loadedRows = url.searchParams.get('loadedRows');
      const searchPhrase = url.searchParams.get('search');

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

    let filter  = null;
    if(searchPhrase){
      const comments = await Comment.find({
        text:{$regex:'.*'+searchPhrase+'.*'}},
         '_id, feedbackID',
        {limit: 10})
        
      filter = {
        $or:[
          {title: {$regex:'.*'+searchPhrase+'.*'}}, 
          {description: {$regex: '.*'+searchPhrase+'.*'}},
          {_id: comments.map(c => c.feedbackID)},
        ]
        }
    }
    return Response.json(await Feedback.find(filter, null, {
      sort:sortDef,
      skip:loadedRows,
      limit: 5,
    }).populate('user'));
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