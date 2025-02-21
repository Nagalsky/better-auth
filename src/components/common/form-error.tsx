import { CircleAlert } from 'lucide-react'
import { FC } from 'react'

type Props = {
	message?: string
}

const FormError: FC<Props> = ({ message }) => {
	if (!message) return null
	return (
		<div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
			<CircleAlert />
			{message}
		</div>
	)
}

export default FormError
