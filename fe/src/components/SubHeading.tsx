export interface SubHeadingProps{
    content:string
}

export function SubHeading(props:SubHeadingProps){
    return <div className="text-slate-500 text-md pt-1 px-4 pb-4">
    {props.content}
  </div>
}