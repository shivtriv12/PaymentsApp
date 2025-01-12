import { Link } from "react-router-dom"

export interface BottomWarningProps{
    label:string;
    buttonText:string;
    to:string
}
export function BottomWarning(props:BottomWarningProps) {
    return <div className="py-2 text-sm flex justify-center">
      <div>
        {props.label}
      </div>
      <Link className="pointer underline pl-1 cursor-pointer" to={props.to}>
        {props.buttonText}
      </Link>
    </div>
}