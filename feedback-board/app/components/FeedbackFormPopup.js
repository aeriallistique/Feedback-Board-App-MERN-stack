import Popup from "./Popup"
import Button from "./Button"
import { useState } from "react";
import axios from 'axios';

import Attachment from "./Attachments";
import AttachFilesButton from "./AttachFilesButton";

export default function FeedbackFormPopup({setShow, onCreate}){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploads, setUploads] = useState([])
  const [isUploading, setIsUploading] = useState(false);

  function handleCreatePostButtonClick(ev){
    ev.preventDefault();

    axios.post('/api/feedback', {title, description, uploads})
    .then(()=> {
      setShow(false);
      onCreate();
    })
  }


  function handleReomveFileButtonClick(ev,link){
    ev.preventDefault();
    setUploads(currentUpload =>{
      const newArr = currentUpload.filter(val=> val !== link);
      return newArr;
    })
    
  }

  function addNewUploads(newLinks){
    setUploads(prevLinks => [...prevLinks, ...newLinks])
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
            {uploads?.length > 0 && (
              <div>
                <label
                  className="block mt-2 mb-1 text-slate-700"
                  htmlFor="">
                    Files
                </label>
                <div className="flex gap-3 ">

                 { uploads.map(link => (
                   <Attachment 
                    uploads={uploads}
                    link={link}
                    showRemoveButton={true}
                    handleReomveFileButtonClick={
                      (ev, link)=> handleReomveFileButtonClick(ev, link)} 
                   />
                 ))}
               </div>
              </div>
               
            )}
          
            <div className="flex gap-2 mt-2 justify-end">
              <AttachFilesButton onNewFiles={addNewUploads}  />
              
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