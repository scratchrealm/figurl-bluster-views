import { FunctionComponent, PropsWithChildren, ReactElement, useMemo } from "react";

type Props ={
	width: number
	height: number
}

const ClusteringViewsLayout: FunctionComponent<PropsWithChildren<Props>> = ({children, width, height}) => {
	const cc = _flatten(Array.isArray(children) ? children.filter(c => (c)) : [children]) as ReactElement[]
	const boxes = useMemo(() => {
		const {numRows, numCols} = _findBestNumRowsCols(cc.length, width, height)
		const W = width / numCols
		const H = height / numRows
		const boxes: {left: number, top: number, width: number, height: number}[] = []
		for (let i = 0; i < cc.length; i++) {
			boxes.push({
				left: (i % numCols) * W,
				top: Math.floor(i / numCols) * H,
				width: W,
				height: H
			})
		}
		return boxes
	}, [cc.length, width, height])
	return (
		<div>
			{
				cc.map((child, ii) => {
					const b = boxes[ii]
					return (
						<div key={ii} style={{position: 'absolute', left: b.left, top: b.top, width: b.width, height: b.height}}>
							<child.type {...child.props} width={b.width} height={b.height} />
						</div>
					)	
				})
			}
		</div>
	)
}

function _findBestNumRowsCols(n: number, width: number, height: number) {
	const candidates: {nc: number, nr: number, score: number}[] = []
	for (let nc = 1; nc <= n; nc ++) {
		const nr = Math.ceil(n / nc)
		const W = width / nc
		const H = height / nr
		const score = Math.abs(Math.log(W / H))
		candidates.push({
			nc,
			nr,
			score
		})
	}
	candidates.sort((a, b) => (a.score - b.score))
	return {
		numRows: candidates[0].nr,
		numCols: candidates[0].nc
	}

}

function _flatten(x: any[]) {
	const y: any[] = []
	x.forEach(a => {
		if (Array.isArray(a)) {
			const b = _flatten(a)
			for (let c of b) {
				y.push(c)
			}
		}
		else {
			y.push(a)
		}
	})
	return y
}

export default ClusteringViewsLayout
