import { ExtendedClusters } from '../types/ExtendedClusters';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import orderBy from 'lodash/orderBy';

type EqualColumnsCount = {
    numberOfEqualColumns: number;
    total: number;
}[];

/** Returns the total number of clusters  */
export const getTotalClusters = (clusters: ExtendedClusters) => {
    return uniqBy(clusters, 'cluster').length;
};

/** Returns the minimum, maximum and mean size of all clusters */
export const getClusterSize = (clusters: ExtendedClusters) => {
    const groupedClusters = getGroupedClusters(clusters);

    return {
        min: orderBy(groupedClusters, 'total', 'asc')[0].total,
        max: orderBy(groupedClusters, 'total', 'desc')[0].total,
        mean: (groupedClusters.map(x => x.total).reduce((a, b) => a + b, 0) / groupedClusters.length).toFixed(2)
    }
};

/** Returns the minimum, maximum and mean amount of equal columns per cluster. This insinuates how concentrated clusters are */
export const getEqualColumnsPerCluster = (clusters: ExtendedClusters) => {
    const groupedClusters = getGroupedClusters(clusters);
    const equalColumns = getAverageOfEqualColumnValues(groupedClusters.map(x => x.id), clusters);

    return {
        min: equalColumns.sort((a, b) => a.columns - b.columns)[0],
        max: equalColumns.sort((a, b) => a.columns - b.columns)[equalColumns.length - 1],
        mean: equalColumns.reduce((a, b) => a + b.columns, 0) / equalColumns.length
    }
};

/** Returns the amount of equal column occurrences */
export const getEqualColumnsCountPerCluster = (clusters: ExtendedClusters) => {
    const groupedClusters = getGroupedClusters(clusters);
    const equalColumns = getAverageOfEqualColumnValues(groupedClusters.map(x => x.id), clusters);
    let listOfEqualColumnCount: EqualColumnsCount = [];

    equalColumns.forEach(column => {
        // If number already exists in collection
        if (listOfEqualColumnCount.find(x => x.numberOfEqualColumns === column.columns)) {
            listOfEqualColumnCount = listOfEqualColumnCount.map(x => {
                if (x.numberOfEqualColumns === column.columns) {
                    return {
                        ...x,
                        total: x.total + 1
                    }
                }

                return x;
            });
        } else {
            listOfEqualColumnCount.push({
                numberOfEqualColumns: column.columns,
                total: 1
            });
        }
    });

    return orderBy(listOfEqualColumnCount, ['total', 'numberOfEqualColumns'], ['desc', 'desc']);
};

/** Returns the amount of columns in every measured data item */
export const getTotalColumnsPerItem = (clusters: ExtendedClusters) => {
    if (clusters.length === 0) {
        return 0;
    }

    // Getting rid of the id column name
    const { id,  ...columnsWithoutId } = clusters[0].meta

    return Object.keys(columnsWithoutId).length;
};

const getAverageOfEqualColumnValues = (idList: number[], clusters: ExtendedClusters) => {
    const columnGroup = idList.map(g => ({
        cluster: g,
        columns: getColumnsWithEqualValues(clusters.filter(x => x.cluster === g)).length
    }));

    return columnGroup;
};

const getColumnsWithEqualValues = (rows: ExtendedClusters) => {
    const uniqueValues: { [key: string]: any[] } = {};

    rows.forEach((row) => {
        Object.keys(row.meta).forEach((propKey) => {
            if (propKey !== 'id') {
                if (!uniqueValues[propKey]) {
                    uniqueValues[propKey] = [row.meta[propKey]];
                } else {
                    uniqueValues[propKey].push(row.meta[propKey]);
                }
            }
        });
    });
    const columnsWithEqualValues: string[] = [];

    Object.keys(uniqueValues).forEach(rowKey => {
        uniqueValues[rowKey] = uniq(uniqueValues[rowKey]);

        if (uniqueValues[rowKey].length === 1) {
            columnsWithEqualValues.push(rowKey);
        }
    });

    return columnsWithEqualValues;
};

const getGroupedClusters = (clusters: ExtendedClusters) => {
    const valueList = clusters.map(x => x.cluster);
    const uniqueValues = uniq(valueList).sort();
    let groups: { id: number, total: number }[] = [];

    uniqueValues.forEach((value) => {
        groups.push({
            id: value,
            total: valueList.filter(x => x === value).length
        });
    });

    groups = sortBy(groups, ['id']);

    return groups;
};
