// RichTextEditor.js
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const RichTextEditor = ({ value, onChange }) => {
	return (
		<ReactQuill
			value={value}
			onChange={onChange}
			modules={RichTextEditor.modules}
			formats={RichTextEditor.formats}
			placeholder="Enter product description..."
			rows={4}
		/>
	)
}

RichTextEditor.modules = {
	toolbar: [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons
		['blockquote', 'code-block'],

		[{ header: 1 }, { header: 2 }], // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
		[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
		[{ direction: 'rtl' }], // text direction

		[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
		[{ header: [1, 2, 3, 4, 5, 6, false] }],

		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
		[{ font: [] }],
		[{ align: [] }],

		['clean'], // remove formatting button
	],
	clipboard: {
		matchVisual: false,
	},
	keyboard: {
		bindings: {
			tab: false,
		},
	},
	blotFormatter: {},
}

RichTextEditor.formats = [
	'header',
	'font',
	'size',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'image',
	'color',
	'background',
]

export default RichTextEditor
