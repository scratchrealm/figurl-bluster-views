import { FunctionComponent } from "react";
import { useBlusterSelection } from "../context-bluster-selection";
import { BlusterStudy } from "./BlusterStudyViewData";
import DatasetSelect from "./DatasetSelect";

type Props ={
	width: number
	height: number
	study: BlusterStudy
}

const ControlPanel: FunctionComponent<Props> = ({width, height}) => {
	const {currentDatasetIndex, setCurrentDatasetIndex} = useBlusterSelection()
	return (
		<div style={{position: 'absolute', width: width - 20, height: height - 20, top: 10, left: 10, overflowY: 'auto', overflowX: 'hidden'}}>
			<DatasetSelect
				selectedDatasetIndex={currentDatasetIndex}
				setSelectedDatasetIndex={setCurrentDatasetIndex}
			/>
		</div>
	)
}

export default ControlPanel
