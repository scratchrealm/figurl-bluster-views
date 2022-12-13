import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { FunctionComponent, useCallback } from "react";
import { useBlusterSelection } from "../context-bluster-selection";

type Props ={
	selectedDatasetIndex?: number
	setSelectedDatasetIndex: (i?: number) => void
}

const DatasetSelect: FunctionComponent<Props> = ({selectedDatasetIndex, setSelectedDatasetIndex}) => {
	const {blusterStudy} = useBlusterSelection()
	const datasets = blusterStudy?.datasets
	const handleChange = (event: any) => {
		setSelectedDatasetIndex(event.target.value ? parseInt(event.target.value) : undefined);
	}
	const handleNext = useCallback(() => {
		if (selectedDatasetIndex === undefined) return
		if (!blusterStudy) return
		if (selectedDatasetIndex >= blusterStudy.datasets.length - 1) return
		setSelectedDatasetIndex(selectedDatasetIndex + 1)
	}, [selectedDatasetIndex, setSelectedDatasetIndex, blusterStudy])
	const handlePrev = useCallback(() => {
		if (selectedDatasetIndex === undefined) return
		if (selectedDatasetIndex <= 0) return
		setSelectedDatasetIndex(selectedDatasetIndex - 1)
	}, [selectedDatasetIndex, setSelectedDatasetIndex])
	return (
		<div>
			<FormControl fullWidth>
				<InputLabel id="dataset-select-label">Dataset</InputLabel>
				<Select
					labelId="dataset-select-label"
					id="dataset-select"
					value={selectedDatasetIndex !== undefined ? `${selectedDatasetIndex}` : ''}
					label="Dataset"
					onChange={handleChange}
				>
					{
						(datasets || []).map((ds, ii) => (
							<MenuItem value={ii}>{ds.name}</MenuItem>
						))
					}
				</Select>
			</FormControl>
			<button onClick={handlePrev}>{`< prev`}</button>
			&nbsp;
			<button onClick={handleNext}>{`next >`}</button>
		</div>
	)
}

export default DatasetSelect
