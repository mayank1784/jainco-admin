import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import { useForm, Controller } from 'react-hook-form'
import 'react-quill/dist/quill.snow.css'

interface RichDescriptionProps {
	mandatory?: boolean
	minChars?: number
	onChange: (content: string) => void
}

const RichDescription: React.FC<RichDescriptionProps> = ({
	mandatory = false,
	minChars = 0,
	onChange,
}) => {
	const {
		control,
		setValue,
		formState: { errors },
	} = useForm()
	const [data, setData] = useState('')

	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ size: [] }],
			[{ font: [] }],
			[{ align: ['right', 'center', 'justify'] }],
			[{ list: 'ordered' }, { list: 'bullet' }],
			['link', 'image'],
			[{ color: ['red', '#785412'] }],
			[{ background: ['red', '#785412'] }],
		],
	}

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'link',
		'color',
		'image',
		'background',
		'align',
		'size',
		'font',
	]

	const handleProcedureContentChange = (content: string) => {
		setData(content)
		onChange(content)
		setValue('description', content, { shouldValidate: true })
	}

	useEffect(() => {
		setValue('description', data)
	}, [data, setValue])

	return (
		<>
			<Controller
				name="description"
				control={control}
				defaultValue=""
				rules={{
					required: mandatory ? 'Description is required' : false,
					validate: (value) =>
						(mandatory && value && value.length >= minChars) ||
						!mandatory ||
						`Description must be at least ${minChars} characters`,
				}}
				render={({ field }) => (
					<ReactQuill
						theme="snow"
						modules={modules}
						formats={formats}
						value={field.value}
						onChange={handleProcedureContentChange}
                        placeholder={
                            'Description of the product'
                        }
                        className="h-20 sm:mb-9 mb-15"
					/>
				)}
			/>
			{typeof errors.description?.message === 'string' && (
				<span className="text-red-600">
					{errors.description?.message}
				</span>
			)}
		</>
	)
}

export default RichDescription
