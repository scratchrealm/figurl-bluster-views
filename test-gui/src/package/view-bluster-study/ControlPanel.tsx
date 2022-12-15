import { FunctionComponent } from "react";
import { BlusterStudy } from "./BlusterStudyViewData";
import ClusteringAlgorithmsSelectionControl from "./ClusteringAlgorithmsSelectionControl";
import DatasetSelect from "./DatasetSelect";

type Props ={
	width: number
	height: number
	study: BlusterStudy
}

const ControlPanel: FunctionComponent<Props> = ({width, height}) => {
	return (
		<div style={{position: 'absolute', width: width - 20, height: height - 20, top: 10, left: 10, overflowY: 'auto', overflowX: 'hidden'}}>
			<DatasetSelect width={width - 20} />
			&nbsp;
			<ClusteringAlgorithmsSelectionControl />
		</div>
	)
}

export default ControlPanel
