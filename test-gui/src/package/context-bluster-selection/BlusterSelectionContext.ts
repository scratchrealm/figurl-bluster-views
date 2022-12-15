import React, { useCallback, useContext, useMemo } from "react"
import { BlusterStudy } from "../view-bluster-study/BlusterStudyViewData"

export type BlusterSelectionState = {
    currentDatasetIndex?: number
    selectedDatapointIndices?: number[]
    selectedClusteringAlgorithms?: string[]
}

export const defaultBlusterSelectionState: BlusterSelectionState = {
}

export type BlusterSelectionAction = {
    type: 'setCurrentDatasetIndex',
    currentDatasetIndex?: number
} | {
    type: 'setSelectedDatapointIndices',
    selectedDatapointIndices?: number[]
} | {
    type: 'setSelectedClusteringAlgorithms',
    selectedClusteringAlgorithms?: string[]
} | {
    type: 'toggleSelectedClusteringAlgorithm',
    algorithmName: string
}

export const blusterSelectionReducer = (s: BlusterSelectionState, a: BlusterSelectionAction): BlusterSelectionState => {
    if (a.type === 'setCurrentDatasetIndex') {
        return {
            ...s,
            currentDatasetIndex: a.currentDatasetIndex
        }
    }
    else if (a.type === 'setSelectedDatapointIndices') {
        return {
            ...s,
            selectedDatapointIndices: a.selectedDatapointIndices
        }
    }
    else if (a.type === 'setSelectedClusteringAlgorithms') {
        return {
            ...s,
            selectedClusteringAlgorithms: a.selectedClusteringAlgorithms
        }
    }
    else if (a.type === 'toggleSelectedClusteringAlgorithm') {
        return {
            ...s,
            selectedClusteringAlgorithms: (s.selectedClusteringAlgorithms || []).includes(a.algorithmName) ? (s.selectedClusteringAlgorithms || []).filter(m => (m !== a.algorithmName)) : [...(s.selectedClusteringAlgorithms || []), a.algorithmName].sort()
        }
    }
    else return s
}

const BlusterSelectionContext = React.createContext<{
    blusterStudy?: BlusterStudy,
    clusteringAlgorithmNames?: string[],
    blusterSelectionState?: BlusterSelectionState,
    blusterSelectionDispatch?: (action: BlusterSelectionAction) => void
}>({})

export const useBlusterSelection = () => {
    const {blusterSelectionState, blusterSelectionDispatch, blusterStudy, clusteringAlgorithmNames} = useContext(BlusterSelectionContext)
    const {currentDatasetIndex, selectedDatapointIndices, selectedClusteringAlgorithms} = blusterSelectionState || defaultBlusterSelectionState
    const currentDataset = useMemo(() => {
        if (currentDatasetIndex === undefined) return undefined
        if (!blusterStudy) return undefined
        return blusterStudy.datasets[currentDatasetIndex]
    }, [currentDatasetIndex, blusterStudy])
    const setCurrentDatasetIndex = useCallback((currentDatasetIndex?: number) => {
        blusterSelectionDispatch && blusterSelectionDispatch({type: 'setCurrentDatasetIndex', currentDatasetIndex})
    }, [blusterSelectionDispatch])
    const setSelectedDatapointIndices = useCallback((selectedDatapointIndices?: number[]) => {
        blusterSelectionDispatch && blusterSelectionDispatch({type: 'setSelectedDatapointIndices', selectedDatapointIndices})
    }, [blusterSelectionDispatch])
    const setSelectedClusteringAlgorithms = useCallback((selectedClusteringAlgorithms?: string[]) => {
        blusterSelectionDispatch && blusterSelectionDispatch({type: 'setSelectedClusteringAlgorithms', selectedClusteringAlgorithms})
    }, [blusterSelectionDispatch])
    const toggleSelectedClusteringAlgorithm = useCallback((algorithmName: string) => {
        blusterSelectionDispatch && blusterSelectionDispatch({type: 'toggleSelectedClusteringAlgorithm', algorithmName})
    }, [blusterSelectionDispatch])
    return {
        currentDatasetIndex,
        currentDataset,
        setCurrentDatasetIndex,
        selectedDatapointIndices,
        setSelectedDatapointIndices,
        selectedClusteringAlgorithms,
        setSelectedClusteringAlgorithms,
        toggleSelectedClusteringAlgorithm,
        clusteringAlgorithmNames,
        blusterStudy
    }
}

export default BlusterSelectionContext