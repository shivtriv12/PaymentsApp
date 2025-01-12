export interface BalanceProps{
    value:number
}

export const Balance = (props:BalanceProps) => {
    return <div className="flex">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {props.value}
        </div>
    </div>
}