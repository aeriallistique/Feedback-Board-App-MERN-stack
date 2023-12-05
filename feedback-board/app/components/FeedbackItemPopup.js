import Button from "./Button";
import Popup from "./Popup";

export default function FeedbackItemPopup({title,description, setShow, children, votesCount }){
  return(
    <Popup title={''} setShow={setShow}> 
      
      <div className="p-8">
        <h2 className="text-lg font-bold mb-2"> {title} </h2>
        <p>{description}</p>
        
      </div>
      <div className="flex justify-end bg-gray-200 px-8 py-2">
        <Button primary>
          <span className="triangle-vote-up"></span>
          Upvote {votesCount}
        </Button>
      </div>
      <div>
        comments
      </div>
    </Popup>
  )
}