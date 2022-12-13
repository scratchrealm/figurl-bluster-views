import { FunctionComponent, PropsWithChildren, useEffect, useMemo, useReducer } from "react";
import { BlusterStudy } from "../view-bluster-study/BlusterStudyViewData";
import BlusterSelectionContext, { blusterSelectionReducer, defaultBlusterSelectionState } from "./BlusterSelectionContext";

type Props = {
	blusterStudy: BlusterStudy
}

const SetupBlusterSelection: FunctionComponent<PropsWithChildren<Props>> = ({children, blusterStudy}) => {
	const [blusterSelectionState, blusterSelectionDispatch] = useReducer(blusterSelectionReducer, defaultBlusterSelectionState)
    const value = useMemo(() => ({
		blusterSelectionState, blusterSelectionDispatch, blusterStudy
	}), [blusterSelectionState, blusterSelectionDispatch, blusterStudy])
    useEffect(() => {
		if ((blusterSelectionState.currentDatasetIndex === undefined) && (blusterStudy.datasets.length > 0)) {
			blusterSelectionDispatch({type: 'setCurrentDatasetIndex', currentDatasetIndex: 0})
		}
	}, [blusterSelectionState.currentDatasetIndex, blusterStudy.datasets])
    useEffect(() => {
        blusterSelectionDispatch && blusterSelectionDispatch({type: 'setSelectedDatapointIndices', selectedDatapointIndices: undefined})
    }, [blusterSelectionState.currentDatasetIndex])
    return (
        <BlusterSelectionContext.Provider value={value}>
            {children}
        </BlusterSelectionContext.Provider>
    )
}

export default SetupBlusterSelection
