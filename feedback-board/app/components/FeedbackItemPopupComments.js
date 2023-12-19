import { useState } from "react";
import Button from "./Button";
import Avatar from "./Avatar";
import CommentForm from "./CommentForm";

export default function FeedbackItemPopupComments({feedbackID}){


  return(
    <div className="p-8">
    <div className="flex gap-4 mb-8">
      <Avatar />
      <div>
      <p className="text-gray-600">Lorem ipsum dolor, sit amet consectetur adipisicing elit.
         Perferendis eligendi reiciendis, impedit velit facere omnis!
         Quasi possimus reprehenderit neque, sint obcaecati ipsum magni
         modi impedit quae odio corrupti accusantium veniam? 
      </p>
      <div className="text-gray-400 mt-2 text-sm">
        Anonymous &middot; a few seconds ago
      </div>
      </div>
    </div>
      <CommentForm  feedbackID={feedbackID}/>
    </div>
  )
}