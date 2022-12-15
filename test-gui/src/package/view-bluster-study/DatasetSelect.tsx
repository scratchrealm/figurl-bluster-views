import { FormControl, InputLabel, MenuItem, Select, Slider } from "@material-ui/core";
import { FunctionComponent, useCallback } from "react";
import { useBlusterSelection } from "../context-bluster-selection";

type Props ={
	width: number
}

const DatasetSelect: FunctionComponent<Props> = ({width}) => {
	const {currentDatasetIndex, setCurrentDatasetIndex} = useBlusterSelection()
	const {blusterStudy} = useBlusterSelection()
	const datasets = blusterStudy?.datasets
	const handleChange = (event: any) => {
		setCurrentDatasetIndex(event.target.value ? parseInt(event.target.value) : undefined);
	}
	const handleNext = useCallback(() => {
		if (currentDatasetIndex === undefined) return
		if (!blusterStudy) return
		if (currentDatasetIndex >= blusterStudy.datasets.length - 1) return
		setCurrentDatasetIndex(currentDatasetIndex + 1)
	}, [currentDatasetIndex, setCurrentDatasetIndex, blusterStudy])
	const handlePrev = useCallback(() => {
		if (currentDatasetIndex === undefined) return
		if (currentDatasetIndex <= 0) return
		setCurrentDatasetIndex(currentDatasetIndex - 1)
	}, [currentDatasetIndex, setCurrentDatasetIndex])
	const handleSliderChange = useCallback((event: any, newValue: number | number[]) => {
		setCurrentDatasetIndex(newValue as number)
	}, [setCurrentDatasetIndex])
	return (
		<div>
			<FormControl fullWidth>
				<InputLabel id="dataset-select-label">Dataset</InputLabel>
				<Select
					labelId="dataset-select-label"
					id="dataset-select"
					value={currentDatasetIndex !== undefined ? `${currentDatasetIndex}` : ''}
					label="Dataset"
					onChange={handleChange}
				>
					{
						(datasets || []).map((ds, ii) => (
							<MenuItem key={ds.name} value={ii}>{ds.name}</MenuItem>
						))
					}
				</Select>
			</FormControl>
			<div style={{position: 'relative', left: 10, width: width - 20}}>
				<Slider min={0} max={(datasets?.length || 0) - 1} value={currentDatasetIndex || 0} onChange={handleSliderChange} />
			</div>
			<div>
			<button onClick={handlePrev}>{`<`}</button>
			&nbsp;
			<button onClick={handleNext}>{`>`}</button>
			</div>
		</div>
	)
}

export default DatasetSelect
