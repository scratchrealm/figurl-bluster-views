import { FunctionComponent, PropsWithChildren, useEffect, useMemo, useReducer } from "react";
import { BlusterStudy } from "../view-bluster-study/BlusterStudyViewData";
import BlusterSelectionContext, { blusterSelectionReducer, defaultBlusterSelectionState } from "./BlusterSelectionContext";
import { useUrlState } from "@figurl/interface";

type Props = {
	blusterStudy: BlusterStudy
}

const SetupBlusterSelection: FunctionComponent<PropsWithChildren<Props>> = ({children, blusterStudy}) => {
	const [blusterSelectionState, blusterSelectionDispatch] = useReducer(blusterSelectionReducer, defaultBlusterSelectionState)
    const clusteringAlgorithmNames = useMemo(() => {
        const ret: string[] = []
        for (let ds of (blusterStudy?.datasets || [])) {
            for (let c of ds.clusterings) {
                if (!ret.includes(c.name)) {
                    ret.push(c.name)
                }
            }
        }
        return ret
    }, [blusterStudy])
    const value = useMemo(() => ({
		blusterSelectionState, blusterSelectionDispatch, blusterStudy, clusteringAlgorithmNames
	}), [blusterSelectionState, blusterSelectionDispatch, blusterStudy, clusteringAlgorithmNames])
    useEffect(() => {
		if ((blusterSelectionState.currentDatasetIndex === undefined) && (blusterStudy.datasets.length > 0)) {
			blusterSelectionDispatch({type: 'setCurrentDatasetIndex', currentDatasetIndex: 0})
		}
	}, [blusterSelectionState.currentDatasetIndex, blusterStudy.datasets])
    useEffect(() => {
        blusterSelectionDispatch && blusterSelectionDispatch({type: 'setSelectedDatapointIndices', selectedDatapointIndices: undefined})
    }, [blusterSelectionState.currentDatasetIndex])
    useEffect(() => {
        if (blusterSelectionState.selectedClusteringAlgorithms === undefined) {
            blusterSelectionDispatch({type: 'setSelectedClusteringAlgorithms', selectedClusteringAlgorithms: clusteringAlgorithmNames})
        }
    })
    const {updateUrlState, initialUrlState} = useUrlState()
    useEffect(() => {
        if (blusterSelectionState.currentDatasetIndex !== undefined) {
            updateUrlState({ds: blusterSelectionState.currentDatasetIndex})
        }
    }, [blusterSelectionState.currentDatasetIndex, updateUrlState])
    useEffect(() => {
        if (blusterSelectionState.selectedClusteringAlgorithms !== undefined) {
            updateUrlState({algs: blusterSelectionState.selectedClusteringAlgorithms})
        }
    }, [blusterSelectionState.selectedClusteringAlgorithms, updateUrlState])
    useEffect(() => {
        const a = initialUrlState['ds']
        if (a !== undefined) {
            blusterSelectionDispatch({type: 'setCurrentDatasetIndex', currentDatasetIndex: a})
        }
        const b = initialUrlState['algs']
        if (b !== undefined) {
            blusterSelectionDispatch({type: 'setSelectedClusteringAlgorithms', selectedClusteringAlgorithms: b})
        }
    }, [blusterSelectionDispatch, initialUrlState])
    return (
        <BlusterSelectionContext.Provider value={value}>
            {children}
        </BlusterSelectionContext.Provider>
    )
}

export default SetupBlusterSelection
