interface InputBoxProps {
    label: string;
    placeholder: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?:string
}

export function InputBox(props:InputBoxProps) {
    return <div>
      <div className="text-sm font-medium text-left py-2">
        {props.label}
      </div>
      <input type={props.type} onChange={props.onChange} placeholder={props.placeholder} className="w-full px-2 py-1 border rounded border-slate-200" />
    </div>
}