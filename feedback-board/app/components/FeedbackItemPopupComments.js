import { useEffect, useState } from "react";
import Button from "./Button";
import Avatar from "./Avatar";
import CommentForm from "./CommentForm";
import axios from "axios";
import Attachment from "./Attachments";
import TimeAgo from 'timeago-react';

export default function FeedbackItemPopupComments({feedbackID}){
  const [comments, setComments]  = useState([]);
  useEffect(()=>{
    fetchComments();
  },[])

  function fetchComments(){
    axios.get('/api/comment?feedbackID='+feedbackID).then(res =>{
      setComments(res.data);
    })
  }

  return(
    <div className="p-8">
     {comments?.length > 0 && comments.map((comment) =>(
       <div className=" mb-8">
         <div className="flex gap-4">
          <Avatar />
        <div>
        <p className="text-gray-600">
          {comment.text}
        </p>
        <div className="text-gray-400 mt-3 text-sm">
          {comment.user.name} &middot; <TimeAgo
              datetime={comment.createdAt}
              locale='en_US'
/>
        </div>
        {comment.uploads?.length >0 && (
         <div className="flex gap-2 mt-3">
           {comment.uploads.map((link)=>(
             <Attachment link={link}/>
           ))}
         </div>
       )}
         </div>
       
       
       </div>
     </div>
     ))}
      <CommentForm  feedbackID={feedbackID} onPost={fetchComments}/>
    </div>
  )
}