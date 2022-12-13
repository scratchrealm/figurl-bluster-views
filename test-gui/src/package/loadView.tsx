import { ViewComponentProps } from "@figurl/core-views"
import { FunctionComponent } from "react"
import BlusterStudyView from "./view-bluster-study/BlusterStudyView"
import { isBlusterStudyViewData } from "./view-bluster-study/BlusterStudyViewData"

const loadView = (o: {data: any, width: number, height: number, opts: any, ViewComponent: FunctionComponent<ViewComponentProps>}) => {
    const {data, width, height} = o
    if (isBlusterStudyViewData(data)) {
        return <BlusterStudyView data={data} width={width} height={height} />
    }
    else return undefined
}

export default loadView