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
	clusterings: BlusterStudyClustering[]
}

export const isBlusterStudy = (x: any): x is BlusterStudy => {
    return validateObject(x, {
        name: isString,
        description: isString,
        datasets: isArrayOf(isBlusterDataset),
        clusterings: isArrayOf(isBlusterStudyClustering)
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
}

export const isBlusterDataset = (x: any): x is BlusterDataset => {
    return validateObject(x, {
        name: isString,
        parameters: () => (true),
        numClusters: isNumber,
        numDimensions: isNumber,
        numDatapoints: isNumber,
        datapoints: () => (true),
        labels: () => (true)
    })
}

export type BlusterStudyClustering = {
	method: BlusterClusteringMethod
	datasetClusterings: (BlusterDatasetClustering | undefined)[]
}

export const isBlusterStudyClustering = (x: any): x is BlusterStudyClustering => {
    return validateObject(x, {
        method: isBlusterClusteringMethod,
        datasetClusterings: isArrayOf(optional(isBlusterDatasetClustering))
    })
}

export type BlusterClusteringMethod = {
	name: string
	algorithmName: string
	parameters: {[pname: string]: any}
}

export const isBlusterClusteringMethod = (x: any): x is BlusterClusteringMethod => {
    return validateObject(x, {
        name: isString,
        algorithmName: isString,
        parameters: () => (true)
    })
}

export type BlusterDatasetClustering = {
	labels: number[] // N
    synchronizedLabels?: number[] // internally computed
    clusterAccuracies?: {[k: number]: number}
    averageClusterAccuracy?: number
}

export const isBlusterDatasetClustering = (x: any): x is BlusterDatasetClustering => {
    return validateObject(x, {
        labels: () => (true),
        synchronizedLabels: optional(() => (true)),
        clusterAccuracies: optional(() => (true)),
        averageClusterAccuracy: optional(() => (true))
    })
}