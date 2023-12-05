import Popup from "./Popup"
import Button from "./Button"

export default function FeedbackFormPopup({setShow}){

  return(
    <Popup setShow={setShow} title="Make a suggestion" >
      <form action="" className="p-8">
          <label 
            className="block mt-4 mb-1 text-slate-700"
            htmlFor="">Title</label>
          <input
            className="w-full border p-2 rounded-md" 
            type="text" 
            placeholder="A short descriptive title" />
            <label
              className="block mt-4 mb-1 text-slate-700"
              htmlFor="">Details</label>
          <textarea
            className="w-full border p-2 rounded-md" 
            placeholder="please include any details"></textarea>
            <div className="flex gap-2 mt-2 justify-end">
              <Button>Attach files</Button>
              <Button primary>Create Post</Button>
            </div>
          
        </form>
    </Popup>
  )
}