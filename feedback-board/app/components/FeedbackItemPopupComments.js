import { useEffect, useState } from "react";
import Button from "./Button";
import Avatar from "./Avatar";
import CommentForm from "./CommentForm";
import axios from "axios";
import Attachment from "./Attachments";
import TimeAgo from 'timeago-react';
import { useSession } from "next-auth/react";
import AttachFilesButton from "./AttachFilesButton";

export default function FeedbackItemPopupComments({feedbackID}){
  const [comments, setComments]  = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentUploads, setNewCommentUploads] = useState([])
  const {data:session} =useSession();
  useEffect(()=>{
    fetchComments();
  },[])

  function fetchComments(){
    axios.get('/api/comment?feedbackID='+feedbackID).then(res =>{
      setComments(res.data);
    })
  }

  function handleEditButtonClick(comment){
    setEditingComment(comment);
    setNewCommentText(comment.text)
    setNewCommentUploads(comment.uploads)
  }

  function handleCancelButtonClick(){
    setNewCommentText('')
    setNewCommentUploads([])
    setEditingComment(null)
  }

  function handleReomveFileButtonClick(ev, linkToRemove){
    ev.preventDefault();
    setNewCommentUploads(prev => prev.filter(l => l !== linkToRemove))
  }

  function handleNewLinks(newLinks){
    setNewCommentUploads(currentLinks=> [...currentLinks, ...newLinks]);
  }

  async function handleSaveChangesButtonClick(){
    const newData = {text: newCommentText, uploads: newCommentUploads}
    await axios.put('/api/comment', {id:editingComment._id, ...newData})
    setComments(existingComments => {
      return existingComments.map(comment => {
        if(comment._id === editingComment._id){
          return {...comment, ...newData};
        }
        return comment;
      }) 
    })

    setEditingComment(null);

  }

  return(
    <div className="p-8">
     {comments?.length > 0 && comments.map((comment) =>(
       <div className=" mb-8">
         <div className="flex gap-4">
          <Avatar url={comment.user.image}/>
        <div>
          {editingComment?._id === comment?._id && (
            <textarea 
              className="border p-2 block w-full" 
              value={newCommentText}
              onChange={(e)=> setNewCommentText(e.target.value)}
              />
          )}
          {editingComment?._id  !== comment?._id && (
              <p className="text-gray-600">
                {comment.text}
              </p>
          )}
      
        <div className="text-gray-400 mt-3 text-sm">
          {comment.user.name} &nbsp; &middot; &nbsp; 
          <TimeAgo
              datetime={comment.createdAt}
              locale='en_US'
          />
          {editingComment?._id !== comment._id && !!comment.user.email && comment.user.email === session?.user?.email && (
            <>
              &nbsp; &middot; &nbsp;
              <span 
                onClick={()=> handleEditButtonClick(comment)}
                className="cursor-pointer hover:underline">
                  Edit
              </span>
            </>
          )}
          {editingComment?._id === comment._id && (
            <>
                &nbsp; &middot; &nbsp; 
              <span
                onClick={handleCancelButtonClick} 
                className="cursor-pointer hover:underline">
                Cancel
              </span>
                &nbsp; &middot; &nbsp; 
              <span
                onClick={handleSaveChangesButtonClick} 
                className="cursor-pointer hover:underline">
                Save Changes
              </span>
            </>
          )}
        </div>

        {(editingComment?._id === comment._id ? newCommentUploads : comment.uploads).length >0 && (
         <div className="flex gap-2 mt-3">
           {(editingComment?._id === comment._id  ? newCommentUploads : comment.uploads).map((link)=>(
             <Attachment 
              handleReomveFileButtonClick={handleReomveFileButtonClick}
              showRemoveButton={editingComment?._id === comment._id} 
              link={link}
             />
           ))}
         </div>
       )}
       {editingComment?._id === comment._id && (
         <div className="mt-2">
           <AttachFilesButton 
              onNewFiles={handleNewLinks} />
         </div>
         
       )}
         </div>       
       </div>
     </div>
     ))}
     {!editingComment && (
        <CommentForm  feedbackID={feedbackID} onPost={fetchComments}/>
     )}
    </div>
  )
}