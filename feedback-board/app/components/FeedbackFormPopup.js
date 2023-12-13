import Popup from "./Popup"
import Button from "./Button"
import { useState } from "react";
import axios from 'axios';
import PaperClip from "./icons/PaperClip";
import Trash from "./icons/Trash";

export default function FeedbackFormPopup({setShow}){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploads, setUploads] = useState([])
  const [isUploading, setIsUploading] = useState(false);
  function handleCreatePostButtonClick(ev){
    ev.preventDefault();

    axios.post('/api/feedback', {title, description})
    .then(()=> {
      setShow(false);

    })
  }

  async function handleAttachFilesInputChange(ev){
    const files = [...ev.target.files];
    setIsUploading(true)
    const data = new FormData();
    
    for(const file of files){
      data.append('file', file)
    }
    const res = await axios.post('/api/upload', data);

    setUploads((existingUploads)=> {
      const responseArray = res.data[0];
      return existingUploads.concat(responseArray);
    });
    setIsUploading(false)
  }

  function handleReomveFileButtonClick(ev,link){
    ev.preventDefault();
    setUploads(currentUpload =>{
      const newArr = currentUpload.filter(val=> val !== link);
      return newArr;
    })
    
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
                <div className="flex gap-3">

                 { uploads.map(link => (
                   <a href={link} target="_blank" className="h-16 relative">
                     <button
                       onClick={(ev)=> handleReomveFileButtonClick(ev,link) } 
                       className="-right-2 -top-2 absolute bg-red-300 
                        p-1 rounded-md text-white">
                       <Trash />
                     </button>
                     {uploads.length > 0 && /.(jpg|png|jpeg)$/.test(link) && (
                       <img className="h-16 w-auto rounded-md" src={link} alt={link}  />
                     ) }
                     {!(/.(jpg|png|jpeg)$/.test(link)) && uploads.length > 0 &&(
                       <div className="bg-gray-200 h-16 p-6 flex items-center rounded-md text-xs">
                       <PaperClip className="w-4 h-4"/>
                       Invalid<br /> Format
                     </div>
                     )}
                     {uploads.length === 0 && (
                       <div className="p-2">nout</div>
                     )}
                   </a>
                 ))}
               </div>
              </div>
               
            )}
           

            <div className="flex gap-2 mt-2 justify-end">
              <label className={(isUploading ? 'text-gray-400': 'text-gray-600')+" py-2 px-4  cursor-pointer"}>
                <span>{isUploading ? 'uploading...' : 'Attach Files'}</span>
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