import { Checkbox } from "@material-ui/core";
import { FunctionComponent } from "react";
import { useBlusterSelection } from "../context-bluster-selection";

type Props ={
}

const ClusteringAlgorithmsSelectionControl: FunctionComponent<Props> = () => {
	const {clusteringAlgorithmNames, selectedClusteringAlgorithms, toggleSelectedClusteringAlgorithm} = useBlusterSelection()
	return (
		<div>
			{
				(clusteringAlgorithmNames || []).map(name => (
					<div key={name}>
						<Checkbox checked={selectedClusteringAlgorithms?.includes(name) || false} onClick={() => {toggleSelectedClusteringAlgorithm(name)}} />
						{name}
					</div>
				))
			}
		</div>
	)
}

export default ClusteringAlgorithmsSelectionControl
