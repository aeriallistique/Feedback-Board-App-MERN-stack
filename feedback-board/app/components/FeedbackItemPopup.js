import Button from "./Button";
import Popup from "./Popup";
import FeedbackItemPopupComments from "./FeedbackItemPopupComments";
import axios from "axios";
import { MoonLoader } from "react-spinners";
import { useState } from "react";
import {useSession} from 'next-auth/react';
import Tick from "./icons/Tick";
import Attachment from "./Attachments";

export default function FeedbackItemPopup({_id, title,
  description, setShow, children, votes,  onVotesChange, uploads}){
    const [isVotesLoading, setIsVotesLoading] = useState(false);
    const {data: session} = useSession();

  async function handleVoteButtonClick(){
    setIsVotesLoading(true);
    await axios.post('/api/vote', {feedbackID: _id}).then(()=>{
      onVotesChange();
      setIsVotesLoading(false);
    })
  }
  const iVoted = !!votes.find(v=> v.userEmail === session?.user?.email)
  
  return(
    <Popup title={''} setShow={setShow}> 
      
      <div className="p-8 pb-2">
        <h2 className="text-lg font-bold mb-2"> {title} </h2>
        <p className="text-gray-600">{description}</p>
        {uploads?.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-600">Attachments:</span>
            <div className="flex gap-2">
              {uploads.map(link=>(
                <Attachment 
                  uploads={uploads}
                  link={link}/>
              ))}
            </div>
          </div>
          
        )}
      </div>
      <div className="flex justify-end  px-8 py-2 border-b">
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
      </div>
      <div>
        <FeedbackItemPopupComments />
      </div>
    </Popup>
  )
}