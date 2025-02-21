import { CircleCheck } from 'lucide-react'
import { FC } from 'react'

type Props = {
	message?: string
}

const FormSuccess: FC<Props> = ({ message }) => {
	if (!message) return null
	return (
		<div className='bg-green-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-500'>
			<CircleCheck />
			{message}
		</div>
	)
}

export default FormSuccess
