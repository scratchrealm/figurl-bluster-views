import { FunctionComponent } from "react";
import { useBlusterSelection } from "../context-bluster-selection";
import ClusteringView from "./ClusteringView";
import ClusteringViewsLayout from "./ClusteringViewsLayout";

type Props ={
	width: number
	height: number
}

const ContentView: FunctionComponent<Props> = ({width, height}) => {
	const {currentDataset, selectedClusteringAlgorithms} = useBlusterSelection()

	if (!currentDataset) {
		return <span>No dataset selected</span>
	}
	return (
		<div style={{position: 'absolute', width, height}}>
			<ClusteringViewsLayout
				width={width}
				height={height}
			>
				<ClusteringView
					key="_truth"
					title="Truth"
					datapoints={currentDataset.datapoints}
					labels={currentDataset.labels}
					width={0}
					height={0}
				/>
				{
					currentDataset.clusterings.filter(c => (selectedClusteringAlgorithms ? selectedClusteringAlgorithms.includes(c.name) : true)).map((c, i) => (
						<ClusteringView
							key={c.name}
							title={c.name}
							datapoints={currentDataset.datapoints}
							labels={c.synchronizedLabels}
							accuracy={c.averageClusterAccuracy}
							width={0}
							height={0}
						/>
					))
				}
			</ClusteringViewsLayout>
		</div>
	)
}

export default ContentView
