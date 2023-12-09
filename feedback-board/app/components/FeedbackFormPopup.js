import Popup from "./Popup"
import Button from "./Button"
import { useState } from "react";
import axios from 'axios';

export default function FeedbackFormPopup({setShow}){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploads, setUploads] = useState([])
  function handleCreatePostButtonClick(ev){
    ev.preventDefault();

    axios.post('/api/feedback', {title, description})
    .then(()=> {
      setShow(false);

    })
  }

  async function handleAttachFilesInputChange(ev){
    const files = [...ev.target.files];
    const data = new FormData();
    
    

    for(const file of files){
      data.append('file', file)
    }
    const res = await axios.post('/api/upload', data);
    setUploads((existingUploads)=> {
      return [...existingUploads, res.data];
    });
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
                  htmlFor="">Files</label>
                <div className="flex gap-2">
                 {uploads.map(link => (
                   <div className="h-16">
                     {link?.endsWith('jpg') ? (
                       <img className="h-16 w-auto rounded-md" src={link} alt=""  />
                     ) : (
                       <div>{link}</div>
                     )}
                   </div>
                 ))}
               </div>
              </div>
               
            )}
           

            <div className="flex gap-2 mt-2 justify-end">
              <label className="py-2 px-4 text-gray-600 cursor-pointer">
                <span>Attach Files</span>
                <input
                  onChange={handleAttachFilesInputChange} 
                  type="file" 
                  className="hidden"
                  multiple
                />
              </label>
              
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