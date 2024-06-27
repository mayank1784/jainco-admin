import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import CheckboxFive from '../components/Checkboxes/CheckboxFive'
import CheckboxFour from '../components/Checkboxes/CheckboxFour'
import CheckboxOne from '../components/Checkboxes/CheckboxOne'
import CheckboxThree from '../components/Checkboxes/CheckboxThree'
import CheckboxTwo from '../components/Checkboxes/CheckboxTwo'
import TableOne from '../components/Tables/TableOne'
import TableThree from '../components/Tables/TableThree'
import TableTwo from '../components/Tables/TableTwo'
import DefaultLayout from '../layout/DefaultLayout'

const Tables = () => {
	return (
		<DefaultLayout>
			<Breadcrumb pageName="Tables" />

			<div className="flex flex-col gap-10">
				<TableOne />
				<TableTwo />
				<TableThree />
			</div>
		</DefaultLayout>
	)
}

export default Tables
