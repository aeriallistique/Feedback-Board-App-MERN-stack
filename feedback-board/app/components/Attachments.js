import Trash from "./icons/Trash"
import PaperClip from "./icons/PaperClip"

export default function Attachment({link, showRemoveButton=false, handleReomveFileButtonClick, uploads}){
  
  return (
    <a href={link} target="_blank" className="h-16 relative">
      {showRemoveButton && (
        <button
        onClick={(ev)=> handleReomveFileButtonClick(ev,link) } 
        className="-right-2 -top-2 absolute bg-red-300 
          p-1 rounded-md text-white">
         <Trash />
        </button>
      )}
      {uploads?.length > 0 && /.(jpg|png|jpeg)$/.test(link) && (
        <img className="h-16 w-auto rounded-md" src={link} alt={link}  />
          ) }
      {!(/.(jpg|png|jpeg)$/.test(link)) && uploads.length > 0 &&(
        <div className="bg-gray-200 h-16 p-6 flex items-center rounded-md text-xs">
          <PaperClip className="w-4 h-4"/>
            Invalid<br /> Format
        </div>
        )}
        {uploads?.length === 0 && (
          <div className="p-2">nout</div>
        )}
    </a>                 
  )
}