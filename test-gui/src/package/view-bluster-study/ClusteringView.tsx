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
	const outerMargin = 20
	const innerMargin = 20
	const titleHeight = 20
	const W = width - outerMargin * 2
	const H = height - outerMargin * 2 - titleHeight
	const W2 = W - innerMargin * 2
	const H2 = H - innerMargin * 2
	const {selectedDatapointIndices, setSelectedDatapointIndices} = useBlusterSelection()
	const {xMin, xMax, yMin, yMax} = useMemo(() => {
		let xMin = Math.min(...xValues)
		let xMax = Math.max(...xValues)
		let yMin = Math.min(...yValues)
		let yMax = Math.max(...yValues)
		const xSpan = xMax - xMin
		const ySpan = yMax - yMin
		if (xSpan * H2 > ySpan * W2) {
			yMin -= (xSpan * H2 / W2 - ySpan) / 2
			yMax += (xSpan * H2 / W2 - ySpan) / 2
		}
		else {
			xMin -= (ySpan * W2 / H2 - xSpan) / 2
			xMax += (ySpan * W2 / H2 - xSpan) / 2
		}
		return {xMin, xMax, yMin, yMax}
	}, [xValues, yValues, W2, H2])
	const coordToPixel = useCallback((coord: {x: number, y: number}) => ({
		x: innerMargin + (coord.x - xMin) / (xMax - xMin) * W2,
		y: innerMargin + (1 - (coord.y - yMin) / (yMax - yMin)) * H2
	}), [xMin, xMax, yMin, yMax, W2, H2])
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
	const {affineTransform, handleWheel} = useWheelZoom(0, 0, W, H, {shiftKey: true})
	return (
		<div>
			<div style={{position: 'absolute', left: outerMargin, top: outerMargin, width: W, height: titleHeight, textAlign: 'center'}}>{title}{accuracy !== undefined ? ` (${formatAccuracy(accuracy)})` : ``}</div>
			<div style={{position: 'absolute', left: outerMargin, top: outerMargin + titleHeight, width: W, height: H, border: 'solid 1px lightgray'}} onWheel={handleWheel}>
				<Scene2d
					width={W}
					height={H}
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
