import Popup from "./Popup"
import Button from "./Button"
import { useState } from "react";
import axios from 'axios';

export default function FeedbackFormPopup({setShow}){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleCreatePostButtonClick(ev){
    ev.preventDefault();
    
    axios.post('/api/feedback', {title, description})
    .then((res)=> {console.log(res)})
  }

  return(
    <Popup setShow={setShow} title="Make a suggestion" >
      <form action="" className="p-8">
          <label 
            className="block mt-4 mb-1 text-slate-700"
            htmlFor="">Title</label>
          <input
            value={title}
            className="w-full border p-2 rounded-md" 
            type="text"
            onChange={(ev)=> setTitle(ev.target.value)} 
            placeholder="A short descriptive title" />
            <label
              className="block mt-4 mb-1 text-slate-700"
              htmlFor="">Details</label>
          <textarea
            value={description}
            onChange={(ev)=> setDescription(ev.target.value)}
            className="w-full border p-2 rounded-md" 
            placeholder="please include any details" />
            <div className="flex gap-2 mt-2 justify-end">
              <Button>Attach files</Button>
              <Button primary
                onClick={handleCreatePostButtonClick}
              >
                Create Post
              </Button>
            </div>
          
        </form>
    </Popup>
  )
}