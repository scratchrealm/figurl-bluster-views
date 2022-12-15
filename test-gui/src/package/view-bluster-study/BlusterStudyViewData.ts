import { isArrayOf, isEqualTo, isNumber, isString, optional, validateObject } from "@figurl/core-utils"

export type BlusterStudyViewData = {
    type: 'bluster.BlusterStudy',
    study: BlusterStudy
}

export const isBlusterStudyViewData = (x: any): x is BlusterStudyViewData => {
    return validateObject(x, {
        type: isEqualTo('bluster.BlusterStudy'),
        study: isBlusterStudy
    })
}

export type BlusterStudy = {
	name: string
	description: string
	datasets: BlusterDataset[]
}

export const isBlusterStudy = (x: any): x is BlusterStudy => {
    return validateObject(x, {
        name: isString,
        description: isString,
        datasets: isArrayOf(isBlusterDataset)
    })
}

export type BlusterDataset = {
	name: string
	parameters: {[pname: string]: any}
	numClusters: number // L
	numDimensions: number // D
	numDatapoints: number // N
	datapoints: number[][] // N x D
	labels: number[] // N
    clusterings: BlusterClustering[]
}

export const isBlusterDataset = (x: any): x is BlusterDataset => {
    return validateObject(x, {
        name: isString,
        parameters: () => (true),
        numClusters: isNumber,
        numDimensions: isNumber,
        numDatapoints: isNumber,
        datapoints: () => (true),
        labels: () => (true),
        clusterings: isArrayOf(isBlusterClustering)
    })
}

export type BlusterClustering = {
	name: string
    classname: string
    parameters: {[pname: string]: any}
    labels: number[]
    synchronizedLabels?: number[] // internally computed
    clusterAccuracies?: {[k: number]: number} // internally computed
    averageClusterAccuracy?: number // internally computed
}

export const isBlusterClustering = (x: any): x is BlusterClustering => {
    return validateObject(x, {
        name: isString,
        classname: isString,
        parameters: () => (true),
        labels: () => (true),
        synchronizedLabels: optional(() => (true)),
        clusterAccuracies: optional(() => (true)),
        averageClusterAccuracy: optional(() => (true))
    })
}