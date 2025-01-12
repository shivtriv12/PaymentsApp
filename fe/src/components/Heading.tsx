export interface HeadingProps{
    content:string
}

export function Heading(props:HeadingProps){
    return <div className="font-bold text-4xl pt-6">
        {props.content}
    </div>
}