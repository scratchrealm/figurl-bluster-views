import React, { useCallback, useContext, useMemo } from "react"
import { BlusterStudy } from "../view-bluster-study/BlusterStudyViewData"

export type BlusterSelectionState = {
    currentDatasetIndex?: number
    selectedDatapointIndices?: number[]
}

export const defaultBlusterSelectionState: BlusterSelectionState = {
}

export type BlusterSelectionAction = {
    type: 'setCurrentDatasetIndex',
    currentDatasetIndex?: number
} | {
    type: 'setSelectedDatapointIndices',
    selectedDatapointIndices?: number[]
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
    else return s
}

const BlusterSelectionContext = React.createContext<{
    blusterStudy?: BlusterStudy,
    blusterSelectionState?: BlusterSelectionState,
    blusterSelectionDispatch?: (action: BlusterSelectionAction) => void
}>({})

export const useBlusterSelection = () => {
    const {blusterSelectionState, blusterSelectionDispatch, blusterStudy} = useContext(BlusterSelectionContext)
    const {currentDatasetIndex, selectedDatapointIndices} = blusterSelectionState || defaultBlusterSelectionState
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
    return {
        currentDatasetIndex,
        currentDataset,
        setCurrentDatasetIndex,
        selectedDatapointIndices,
        setSelectedDatapointIndices,
        blusterStudy
    }
}

export default BlusterSelectionContext