import { useState } from "react";
import Attachment from "./Attachments";
import Button from "./Button";
import AttachFilesButton from "./AttachFilesButton";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";


export default function CommentForm({feedbackID, onPost}){
  const [commentText, setCommentText]= useState('');
  const [uploads, setUploads]= useState([]);
  const {data: session} = useSession();

  function addUploads(newLinks){
    setUploads(prevLinks => [...prevLinks, ...newLinks]);
  }

  function removeUpload(ev,linkToRemove ){
    ev.preventDefault();
    ev.stopPropagation();
    setUploads(prevLinks=> prevLinks.filter(link=> link !== linkToRemove));
  }

  async function handleCommentButtonClick(ev){
    ev.preventDefault();
    const commentData = {
      text: commentText,
      uploads:uploads,
      feedbackID,}

    if(session){
      await axios.post('/api/comment', commentData);
       setCommentText('')
       setUploads([]);
       onPost()
    }else{
      localStorage.setItem('comment_after_login', JSON.stringify(commentData))
      await signIn('google');
    } 
  }

  return(
    <form action="">
      <textarea
      onChange={(ev)=> setCommentText(ev.target.value)} 
      value={commentText}
      className="border rounded-md w-full p-2"
      placeholder="let us know what you think" 
    />
      {uploads?.length > 0 && (
        <div className="">
          <div className="text-sm text-gray-600 mb-6">Files</div>
          <div className="flex gap-3">
            {uploads.map(link =>(
              <div>
               <Attachment 
                link={link} 
                showRemoveButton={true} 
                handleReomveFileButtonClick={(ev, link)=> removeUpload(ev,link)}
              /> 
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 mt-2">
        <AttachFilesButton onNewFiles={addUploads}/>
        <Button 
          primary 
          disabled={commentText===''}
          onClick={(ev)=> handleCommentButtonClick(ev)}
          >
            {session ? 'Comment' : 'Login and Comment'}
            Comment
        </Button>
      </div>
    </form>
  )
} 