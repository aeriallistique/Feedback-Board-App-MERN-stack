import { useState } from "react";
import Button from "./Button";
import Popup from "./Popup";
import {signIn, useSession} from "next-auth/react"
import axios from "axios";
import { MoonLoader } from "react-spinners";


export default function FeedbackItem({onOpen, _id, title, description, votes, onVotesChange, parentLoadingVotes=true}){
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isVoteLoading, setIsVoteLoading] = useState(false);
  const { data: session} = useSession();
  const isLoggedIn = !!session?.user?.email;

  function handleVoteButtonClick(ev){
    ev.stopPropagation();
    ev.preventDefault();
    
    if(!isLoggedIn){
      localStorage.setItem('vote_after_login', _id);
      setShowLoginPopup(true);
    }else{
      setIsVoteLoading(true);
      axios.post('/api/vote', {feedbackID:_id}).then(async ()=>{
        await onVotesChange();
        setIsVoteLoading(false);
      })
    }
  } 

  async function handleGoogleLoginButtonClick(ev){
    ev.stopPropagation();
    ev.preventDefault();
    await signIn('google')
  }

  const iVoted = !!votes.find(v=> v.userEmail === session?.user?.email)
  const shortDesc = description.substring(0,250);


  return(
    <a href=""
      onClick={e => {e.preventDefault(); onOpen()}} 
      className="my-8  flex gap-8 items-center">
          <div className="flex-grow">
            <h2 className="font-bold">{title}</h2>
            <p className="text-gray-600 text-sm "> 
            {shortDesc} 
            {shortDesc.length < description.length ? '...' : ''}
            </p>
          </div>
          <div>
            {showLoginPopup && (
              <Popup title={'Login to confirm your vote'} narrow setShow={setShowLoginPopup}>
                <div className="p-4">
                  <Button primary onClick={handleGoogleLoginButtonClick}>
                    login with google
                  </Button>
                </div>
                
              </Popup>
            )}
              <Button
                primary={iVoted}
                onClick={handleVoteButtonClick} 
                className={'shadow-sm border '}
              >
                  {!isVoteLoading && (
                    <>
                      <span className="triangle-vote-up "></span>
                      {votes?.length || '0'}
                    </>
                  )}
                {isVoteLoading && (
                  <MoonLoader size={20} />
                )}
              </Button>
            
          </div>
          
        </a>

  )
}