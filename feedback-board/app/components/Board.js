import { useState, useEffect } from "react";
import FeedbackFormPopup from "./FeedbackFormPopup";
import FeedbackItem from "./FeedbackItem";
import Button from "./Button";
import FeedbackItemPopup from "./FeedbackItemPopup";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Board(){
  const [showFeebackPopupForm, setShowFeedbackPopupForm] = useState(false)
  const [showFeebackPopupItem, setShowFeedbackPopupItem] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [votes, setVotes] = useState([])
  const [votesLoadin, setVotesLoading] = useState(false);
  const {data:session} = useSession();

  useEffect(()=>{
    fetchFeedbacks()
  },[])


  useEffect(()=>{
    fetchVotes();
  },[feedbacks])

  useEffect(()=>{
    if(session?.user?.email){
      const feedbackToVote = localStorage.getItem('vote_after_login');
      if(feedbackToVote){
        // axio to api to save the vote
        axios.post('/api/vote', {feedbackID: feedbackToVote}).then(()=>{
          // remove id from local storage
          localStorage.removeItem('vote_after_login');
          fetchVotes();
        }) 
      }
      const feedbackToPost = localStorage.getItem('post_after_login');
      if(feedbackToPost){
        const feedbackData = JSON.parse(feedbackToPost);
        axios.post('/api/feedback', feedbackData).then( async(res)=>{
          await fetchFeedbacks();
          setShowFeedbackPopupItem(res.data);
          localStorage.removeItem('post_after_login');
        })
      }
      const commentToPost = localStorage.getItem('comment_after_login')
      if(commentToPost){
        const commentData = JSON.parse(commentToPost)
        axios.post('api/comment', commentData).then(()=>{
          axios.get('api/feedback?id='+commentData.feedbackID).then(res =>{
            setShowFeedbackPopupItem(res.data);
            localStorage.removeItem('comment_after_login');
          })
        })
      }
    }
  },[session?.user?.email])

  async function fetchFeedbacks(){
    axios.get('/api/feedback').then(res => {
      setFeedbacks(res.data)
    })
  }

  async function fetchVotes(){
    setVotesLoading(true);
    const ids = feedbacks.map(f=> f._id);
    const res = await axios.get('/api/vote?feedbackIds='+ids.join(','));
    setVotes(res.data);
    setVotesLoading(false);
  }

  function openFeedbackPopUpForm(){
    setShowFeedbackPopupForm(true)
  }

  function openFeedbackPopupItem(feedback){
    setShowFeedbackPopupItem(feedback)
  }

  async function handleFeedbackUpdate(newData){
    setShowFeedbackPopupItem(prevData => {
      return {...prevData, ...newData};
    });
    await fetchFeedbacks();
  }


  return(
    <main className="bg-white max-w-2xl md:mx-auto 
          md:shadow-lg md:rounded-lg md:mt-8 overflow-hidden">

        <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
          <h1 className="font-bold text-xl">
            Coding with Andrei
          </h1>
          <p className="text-opacity-90 text-slate-700">
            Help me decide what should I build net or how can I improve.
          </p>
        </div>
        <div className="bg-gray-100 px-8 py-4 flex border-b">
          <div className="grow"></div>
          <div>
            <Button
              primary
              onClick={openFeedbackPopUpForm} >
              Make a suggestion
            </Button>
          </div>
        </div>
        <div className="px-8 ">
          {feedbacks.map(feedback => (
            <FeedbackItem {...feedback}
                          onVotesChange={fetchVotes}
                          votes={votes.filter(v=> v.feedbackID.toString() === feedback._id.toString())}
                          parentLoadingVotes={votesLoadin} 
                          onOpen={()=> openFeedbackPopupItem(feedback)}/> 
          ))}
          
          
        </div> 
        {showFeebackPopupForm && (
          <FeedbackFormPopup 
            onCreate={fetchFeedbacks}  
            setShow={setShowFeedbackPopupForm}/>
        )}
        {showFeebackPopupItem && (
          <FeedbackItemPopup 
            {...showFeebackPopupItem}
            votes={votes.filter(v=> v.feedbackID.toString()=== showFeebackPopupItem._id)} 
            onVotesChange={fetchVotes}
            setShow={setShowFeedbackPopupItem} 
            onUpdate={handleFeedbackUpdate}
            />
        )}

      </main>
  )
}
