import { Splitter } from "@figurl/core-views";
import { FunctionComponent } from "react";
import { useBlusterSelection } from "../context-bluster-selection";
import ClusteringBoxesView from "./ClusteringBoxesView";
import ClusteringView from "./ClusteringView";

type Props ={
	width: number
	height: number
}

const ContentView: FunctionComponent<Props> = ({width, height}) => {
	const {currentDataset} = useBlusterSelection()

	if (!currentDataset) {
		return <span>No dataset selected</span>
	}
	return (
		<div style={{position: 'absolute', width, height}}>
			<Splitter
				width={width}
				height={height}
				direction="vertical"
				initialPosition={height / 2}
			>
				<ClusteringView
					title="Truth"
					datapoints={currentDataset.datapoints}
					labels={currentDataset.labels}
					width={0}
					height={0}
				/>
				<ClusteringBoxesView
					width={0}
					height={0}
				/>
			</Splitter>
		</div>
	)
}

export default ContentView
