from typing import List
import numpy as np
from abc import ABC, abstractmethod
from isosplit5 import isosplit5
from sklearn.cluster import KMeans, DBSCAN
from sklearn.mixture import GaussianMixture

class ClusteringAlgorithm(ABC):
    @abstractmethod
    def cluster(self, samples: np.ndarray) -> np.array:
        pass

class IsosplitAlgorithm(ClusteringAlgorithm):
    def __init__(self) -> None:
        super().__init__()
        self.name = 'Isosplit'
    def cluster(self, samples: np.ndarray) -> np.array:
        return isosplit5(samples)

class KmeansAlgorithm(ClusteringAlgorithm):
    def __init__(self, n_clusters: int) -> None:
        super().__init__()
        self.name = 'K-means'
        self.n_clusters = n_clusters
    def cluster(self, samples: np.ndarray) -> np.array:
        kmeans = KMeans(n_clusters=self.n_clusters, random_state=0, init='k-means++').fit(samples.T)
        return kmeans.labels_ + 1

class GaussianMixtureAlgorithm(ClusteringAlgorithm):
    def __init__(self, n_components_to_try: List[int]) -> None:
        super().__init__()
        self.name = 'GMM'
        self.n_components_to_try = n_components_to_try
    def cluster(self, samples: np.ndarray) -> np.array:
        aic_list = []
        labels_list = []
        for nc in self.n_components_to_try:
            gmm = GaussianMixture(n_components=nc, random_state=0, covariance_type='spherical').fit(samples.T)
            aic_list.append(gmm.aic(samples.T))
            labels_list.append(gmm.predict(samples.T))
        # nc = self.n_components_to_try[np.argmin(aic_list)]
        # print(f'Using nc = {nc}')
        return labels_list[np.argmin(aic_list)] + 1

class DBSCANAlgorithm(ClusteringAlgorithm):
    def __init__(self, eps: float, min_samples: int) -> None:
        super().__init__()
        self.name = 'DBSCAN'
        self.eps = eps
        self.min_samples = min_samples
    def cluster(self, samples: np.ndarray) -> np.array:
        dbscan = DBSCAN(eps=self.eps, min_samples=self.min_samples).fit(samples.T)
        return dbscan.labels_ + 1