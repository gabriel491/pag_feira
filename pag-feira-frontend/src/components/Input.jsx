export default function Input(props) {
    return (
        <input
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
        />
    )
}