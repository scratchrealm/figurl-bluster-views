import { colorForUnitId } from "@figurl/core-utils";
import { FunctionComponent, useCallback, useMemo } from "react";
import { Scene2d, Scene2dObject } from "../component-scene2d";
import { useBlusterSelection } from "../context-bluster-selection";
import useWheelZoom from "./useWheelZoom";

type Props ={
	title: string
	datapoints: number[][] // N x D
	labels?: number[] // N
	accuracy?: number
	width: number
	height: number
}

const ClusteringView: FunctionComponent<Props> = ({title, datapoints, accuracy, labels, width, height}) => {
	const xValues = useMemo(() => (datapoints.map(p => (p[0]))), [datapoints])
	const yValues = useMemo(() => (datapoints.map(p => (p[1]))), [datapoints])
	const margin = 25
	const titleHeight = 30
	const W = width - margin * 2
	const H = height - margin * 2 - titleHeight
	const {selectedDatapointIndices, setSelectedDatapointIndices} = useBlusterSelection()
	const {xMin, xMax, yMin, yMax} = useMemo(() => {
		let xMin = Math.min(...xValues)
		let xMax = Math.max(...xValues)
		let yMin = Math.min(...yValues)
		let yMax = Math.max(...yValues)
		const xSpan = xMax - xMin
		const ySpan = yMax - yMin
		if (xSpan * H > ySpan * W) {
			yMin -= (xSpan * H / W - ySpan) / 2
			yMax += (xSpan * H / W - ySpan) / 2
		}
		else {
			xMin -= (ySpan * W / H - xSpan) / 2
			xMax += (ySpan * W / H - xSpan) / 2
		}
		return {xMin, xMax, yMin, yMax}
	}, [xValues, yValues, W, H])
	const coordToPixel = useCallback((coord: {x: number, y: number}) => ({
		x: margin + (coord.x - xMin) / (xMax - xMin) * W,
		y: margin + (1 - (coord.y - yMin) / (yMax - yMin)) * H
	}), [xMin, xMax, yMin, yMax, W, H])
	const objects = useMemo(() => {
		const selectedDatapointIndicesSet = new Set(selectedDatapointIndices)
		const objects: Scene2dObject[] = []
		for (let i = 0; i < datapoints.length; i++) {
			const dp = datapoints[i]
			const label = labels ? labels[i] : 0
			const p = coordToPixel({x: dp[0], y: dp[1]})
			objects.push({
				type: 'marker',
				objectId: `datapoint-${i}`,
				x: p.x,
				y: p.y,
				attributes: {
					fillColor: colorForUnitId(label),
					lineColor: 'black',
					shape: 'circle',
					radius: 3
				},
				selectedAttributes: {
					fillColor: colorForUnitId(label),
					lineColor: 'yellow',
					shape: 'circle',
					radius: 5
				},
				selected: selectedDatapointIndicesSet.has(i),
				clickable: true
			})
		}
		return objects
	}, [coordToPixel, datapoints, labels, selectedDatapointIndices])
	const handleSelectObjects = useCallback((objectIds: string[], e: React.MouseEvent | undefined) => {
		const a: number[] = []
		objectIds.forEach(id => {
			if (id.startsWith('datapoint-')) {
				const b = parseInt(id.slice('datapoint-'.length))
				a.push(b)
			}
		})
		setSelectedDatapointIndices(a)
	}, [setSelectedDatapointIndices])
	const handleClickObject = useCallback((objectId: string, e: React.MouseEvent | undefined) => {
		if (objectId.startsWith('datapoint-')) {
			const b = parseInt(objectId.slice('datapoint-'.length))
			setSelectedDatapointIndices([b])
		}
	}, [setSelectedDatapointIndices])
	const handleClick = useCallback((p: {x: number, y: number}, e: React.MouseEvent<Element, MouseEvent>) => {
		setSelectedDatapointIndices([])
	}, [setSelectedDatapointIndices])
	const {affineTransform, handleWheel} = useWheelZoom(0, 0, width, height - titleHeight, {shiftKey: false})
	return (
		<div>
			<div style={{textAlign: 'center'}}>{title}{accuracy !== undefined ? ` (${formatAccuracy(accuracy)})` : ``}</div>
			<div style={{position: 'absolute', top: titleHeight, width, height: height - titleHeight}} onWheel={handleWheel}>
				<Scene2d
					width={width}
					height={height}
					objects={objects}
					onSelectObjects={handleSelectObjects}
					onClickObject={handleClickObject}
					onClick={handleClick}
					affineTransform={affineTransform}
				/>
			</div>
		</div>
	)
}

function formatAccuracy(a: number) {
	return `${Math.round(a * 100)}%`
}

export default ClusteringView
