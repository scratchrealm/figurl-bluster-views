import { Splitter } from "@figurl/core-views";
import { FunctionComponent, useEffect } from "react";
import { SetupBlusterSelection } from "../context-bluster-selection";
import { BlusterStudyViewData } from "./BlusterStudyViewData";
import ContentView from "./ContentView";
import ControlPanel from "./ControlPanel";

type Props = {
	data: BlusterStudyViewData
	width: number
	height: number
}

const BlusterStudyView: FunctionComponent<Props> = ({data, width, height}) => {
	const {study} = data

	useEffect(() => {
		// synchronize the labels
		study.datasets.forEach((dd) => {
			dd.clusterings.forEach((cc, ii) => {
				cc.synchronizedLabels = computeSynchronizedLabels(dd.labels, cc.labels)
				cc.clusterAccuracies = computeClusterAccuracies(dd.labels, cc.labels)
				cc.averageClusterAccuracy = computeMean(Object.values(cc.clusterAccuracies || {}))
			})
		}, [])
	}, [study])
	
	return (
		<SetupBlusterSelection blusterStudy={study}>
			<div className="BlusterStudyView">
				<Splitter
					width={width}
					height={height}
					initialPosition={300}
				>
					<ControlPanel
						width={0}
						height={0}
						study={study}
					/>
					<ContentView
						width={0}
						height={0}
					/>
				</Splitter>
			</div>
		</SetupBlusterSelection>
	)
}

const computeSynchronizedLabels = (labels1: number[], labels2: number[]) => {
	function findBestK2(x: {[k2: number]: number}) {
		let bestK2: number | undefined = undefined
		let bestValue = 0
		for (let k2String in x) {
			const k2 = parseInt(k2String)
			if (x[k2] > bestValue) {
				bestK2 = k2
				bestValue = x[k2]
			}
		}
		return bestK2
	}
	function getNextAvailableLabel() {
		const vv = new Set(Object.values(labelMap))
		let candidate = 1
		while (true) {
			if (!vv.has(candidate)) return candidate
			candidate += 1
		}
	}
	const K1s = unique(labels1)
	const K2s = unique(labels2)
	const CM = createConfusionMatrix(labels1, labels2)
	const labelMap: {[k2: number]: number} = {}
	let usedK2s = new Set()
	for (let k1 of K1s) {
		const k2 = findBestK2(CM[k1])
		if (k2 !== undefined) {
			if (!usedK2s.has(k2)) {
				labelMap[k2] = k1
				usedK2s.add(k2)
			}
		}
	}
	for (let k2 of K2s) {
		if (!usedK2s.has(k2)) {
			labelMap[k2] = getNextAvailableLabel()
		}
	}
	return labels2.map(x => (labelMap[x]))
}

const computeClusterAccuracies = (labels1: number[], labels2: number[]) => {
	const CM = createConfusionMatrix(labels1, labels2)
	const K1s = unique(labels1)
	const K2s = unique(labels2)
	const ret: {[k1: number]: number} = {}
	for (let k1 of K1s) {
		let accuracies: number[] = []
		for (let k2 of K2s) {
			const denom = computeSum(K2s.map(k2b => (CM[k1][k2b] || 0))) + computeSum(K1s.map(k1b => (CM[k1b][k2] || 0))) - (CM[k1][k2] || 0)
			if (denom) {
				accuracies.push((CM[k1][k2] || 0) / denom)
			}
			else accuracies.push(0)
		}
		ret[k1] = Math.max(...accuracies)
	}
	return ret
}

function computeSum(x: number[]) {
	return x.reduce((prev, a) => (a + prev), 0)
}

function computeMean(x: number[]) {
	if (x.length === 0) return 0
	return computeSum(x) / x.length
}

function createConfusionMatrix(labels1: number[], labels2: number[]): {[k1: number]: {[k2: number]: number}} {
	const ret: {[k1: number]: {[k2: number]: number}} = {}
	for (let i = 0; i < labels1.length; i++) {
		if (!(labels1[i] in ret)) {
			ret[labels1[i]] = {}
		}
		if (!(labels2[i] in ret[labels1[i]])) {
			ret[labels1[i]][labels2[i]] = 0
		}
		ret[labels1[i]][labels2[i]] += 1
	}
	return ret
}

const unique = (x: number[]) => {
	return [...(new Set(x))].sort()
}

export default BlusterStudyView
