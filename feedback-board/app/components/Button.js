export default function Button(props) {
  
  return(
    <button 
      {...props} 
      className={"flex items-center gap-2 py-1 px-4 rounded-md  text-opacity-90 " + 
        (props.primary ? 'bg-blue-500 text-white' : 'text-gray-600')} >
    </button> 
  )
}