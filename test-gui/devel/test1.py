# 12-13-2022
# https://figurl.org/f?v=http://localhost:3000&d=sha1://867d8cbf743d12567e1c51c9454b580cadfe2b2d&label=test%20bluster%20study%20view

from typing import Any
import numpy as np
import figurl as fig
from ClusteringAlgorithm import KmeansAlgorithm, IsosplitAlgorithm, GaussianMixtureAlgorithm, DBSCANAlgorithm, ClusteringAlgorithm
from generate_random_clusters import generate_random_clusters, generate_samples_for_clusters, Cluster


def main():
    datasets = _generate_datasets()
    sigma = 10
    pop = 500
    dbscan_eps = (5 * sigma) / np.sqrt(pop)
    dbscan_min_samples = 3
    clusterings = [
        _create_study_clustering(datasets, KmeansAlgorithm(n_clusters=2), name='k-means', algorithm_name='K-means', parameters={'n_clusters': 2}),
        _create_study_clustering(datasets, GaussianMixtureAlgorithm(n_components_to_try=[2]), name='GMM', algorithm_name='GMM', parameters={'n_components_to_try': [2]}),
        _create_study_clustering(datasets, DBSCANAlgorithm(eps=dbscan_eps, min_samples=dbscan_min_samples), name='DBSCAN', algorithm_name='DBSCAN', parameters={'eps': dbscan_eps, 'min_samples': dbscan_min_samples}),
        _create_study_clustering(datasets, IsosplitAlgorithm(), name='Isosplit', algorithm_name='Isosplit', parameters={})
    ]
    study = {
        'name': 'test study',
        'description': '',
        'datasets': datasets,
        'clusterings': clusterings
    }
    data = {
        'type': 'bluster.BlusterStudy',
        'study': study
    }
    F = fig.Figure(data=data, view_url='http://localhost:3000')
    print(F.url(label='test bluster study view'))

def _generate_datasets():
    datasets = []

    pop = 500
    num_clusters = 2
    separations = np.arange(0, 6, 0.2)
    num_trials = 3
    sigma = 10

    for separation in separations:
        print(f'Separation: {separation}')
        clusters = [
            Cluster(covmat=np.eye(2) * sigma**2, mu=[0, 0], pop=pop, nongaussian=False),
            Cluster(covmat=np.eye(2) * 1**2, mu=[sigma * separation, 0], pop=pop, nongaussian=False)
        ]
        for itrial in range(num_trials):
            print(f'    Trial: {itrial + 1}')
            samples, labels = generate_samples_for_clusters(clusters)
            datasets.append({
                'name': f'Separation {separation:.2f}; Trial {itrial};',
                'parameters': {'separation': separation, 'trial': itrial + 1},
                'numClusters': len(clusters),
                'numDimensions': 2,
                'numDatapoints': samples.shape[1],
                'datapoints': samples.T,  # N x D
                'labels': labels # N
            })
    return datasets

def _create_study_clustering(datasets, alg: ClusteringAlgorithm, *, name: str, algorithm_name: str, parameters: Any):
    dataset_clusterings = []
    for ds in datasets:
        print(f'{name} {ds["name"]}')
        labels = alg.cluster(ds['datapoints'].T).astype(np.int32)
        dataset_clusterings.append({
            'labels': labels
        })
    return {
        'method': {
            'name': name,
            'algorithmName': algorithm_name,
            'parameters': parameters
        },
        'datasetClusterings': dataset_clusterings
    }

if __name__ == '__main__':
    main()
