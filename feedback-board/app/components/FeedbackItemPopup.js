import Button from "./Button";
import Popup from "./Popup";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import axios from "axios";
import { MoonLoader } from "react-spinners";
import { useState } from "react";
import {useSession} from 'next-auth/react';
import Tick from "./icons/Tick";
import Attachment from "./Attachments";
import Edit from "./icons/Edit";
import AttachFilesButton from "./AttachFilesButton";
import Trash from "./icons/Trash";

export default function FeedbackItemPopup({_id, title,
  description, setShow, children, votes,  onVotesChange, uploads,user, onUpdate }){
    const [isVotesLoading, setIsVotesLoading] = useState(false);
    const {data: session} = useSession();
    const [isEditMode, setIsEditMode] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [newDescription, setNewDescription] = useState(description);
    const [newUploads, setNewUploads] = useState(uploads);

  async function handleVoteButtonClick(){
    setIsVotesLoading(true);
    await axios.post('/api/vote', {feedbackID: _id}).then(()=>{
      onVotesChange();
      setIsVotesLoading(false);
    })
  }
  const iVoted = !!votes.find(v=> v.userEmail === session?.user?.email)

  function handleEditButtonClick(ev){
    setIsEditMode(true);
  }

  function handleReomveFileButtonClick(ev, linkToRemove){
    ev.preventDefault();
    setNewUploads(prevNewUploads => prevNewUploads.filter(l => l !== linkToRemove))
  }

  function handleCancelButtonClick(){
    setIsEditMode(false);
    setNewTitle(title)
    setNewDescription(description)
    setNewUploads(uploads)
  }

  function handleNewUploads(newLinks){
    setNewUploads(prevUploads => [...prevUploads, ...newLinks])
  }

  async function handleSaveButtonClick(){
    await axios.put('/api/feedback', 
    { id:_id,
      title: newTitle,
      description: newDescription,
      uploads: newUploads,
    }).then(()=> {
      isEditMode(false);
      onUpdate({
        title: newTitle,
        description: newDescription,
        uploads: newUploads,
      })
    })

  }
  
  return(
    <Popup title={''} setShow={setShow}> 
      <div className="p-8 pb-2">
        {isEditMode && (
          <input
            value={newTitle}
            onChange={(ev)=> setNewTitle(ev.target.value)} 
            className="block p-2 mb-2 w-full border rounded-md" />
        )}

        {!isEditMode && (
          <h2 className="text-lg font-bold mb-2"> {title} </h2>
        )}
        
        {isEditMode && (
          <textarea className="block p-2 mb-2 w-full border rounded-md" />
        )}

        {!isEditMode && (
          <p
            value={newDescription}
            onChange={(ev)=> setNewDescription(ev.target.value)} 
            className="text-gray-600">{description}</p>
        )}
        {uploads?.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-600">Attachments:</span>
            <div className="flex gap-2">
              {(isEditMode ? newUploads : uploads).map(link=>(
                <Attachment 
                  uploads={uploads}
                  link={link}
                  showRemoveButton={isEditMode}
                  handleReomveFileButtonClick={handleReomveFileButtonClick}
                  />
              ))}
            </div>
          </div>
          
        )}
      </div>
      <div className="flex gap-2 justify-end  px-8 py-2 border-b">
        {isEditMode && (
          <>
            <AttachFilesButton onNewFiles={handleNewUploads} />
            <Button onClick={handleCancelButtonClick}>
              <Trash  className="w-4 h-4"/>
              Cancel
            </Button>
            <Button
              onClick={handleSaveButtonClick} 
              primary >
              Save changes
            </Button>
          </>
        )}

        {!isEditMode && user?.email &&  session?.user?.email === user?.email && (
          <Button onClick={handleEditButtonClick}>
            <Edit classname="w-4 h-4"/>
            Edit
          </Button>
        )}
        {!isEditMode && (
          <Button
          onClick={handleVoteButtonClick} 
          primary>
          {isVotesLoading && (
            <MoonLoader size={18}/>
          )}

          {!isVotesLoading && (
            <>
            {iVoted && (
              <>
               <Tick className="w-4 h-4" />
               Upvote {votes?.length || '0'}
              </>
            )}
            {!iVoted && (
              <>
              <span className="triangle-vote-up">
              </span>
               Upvote {votes?.length || '0'}
              </>
             )}
              
            </>
          )}
          
        </Button>
        )}
        
      </div>
      <div>
        <FeedbackItemPopupComments  feedbackID={_id}/>
      </div>
    </Popup>
  )
}