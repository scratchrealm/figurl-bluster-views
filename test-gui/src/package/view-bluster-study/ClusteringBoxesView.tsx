import { FunctionComponent } from "react";
import { useBlusterSelection } from "../context-bluster-selection";
import ClusteringView from "./ClusteringView";

type Props ={
	width: number
	height: number
}

const ClusteringBoxesView: FunctionComponent<Props> = ({width, height}) => {
	const {blusterStudy, currentDataset, currentDatasetIndex} = useBlusterSelection()
	const clusterings = blusterStudy ? blusterStudy.clusterings : []
	const n = clusterings.length
	const W = n ? width / n : width
	if (!currentDataset) return <span />
	if (currentDatasetIndex === undefined) return <span />
	return (
		<div>
			{
				clusterings.map((c, i) => (
					<div style={{position: 'absolute', width: W, height, left: i * W}}>
						<ClusteringView
							title={clusterings[i].method.name}
							datapoints={currentDataset.datapoints}
							labels={clusterings[i].datasetClusterings[currentDatasetIndex]?.synchronizedLabels}
							accuracy={clusterings[i].datasetClusterings[currentDatasetIndex]?.averageClusterAccuracy}
							width={W}
							height={height}
						/>
					</div>
				))
			}
		</div>
	)
}

export default ClusteringBoxesView
