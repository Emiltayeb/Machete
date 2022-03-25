import React from 'react';
import { collection, query, getFirestore } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { getApp } from 'firebase/app';

type GetDataProps = {
  dataBaseName?: string;
  options?: any;
}
const useGetData = ({ dataBaseName = "users", options, }: GetDataProps) => {
  const firestore = useFirestore();
  const db = getFirestore(getApp())
  const collections = collection(db, dataBaseName);
  const queryRef = options
    ? query(collections, ...options)
    : query(collections);
  const { status: dataStatus, data: resultData } = useFirestoreCollectionData(queryRef);

  return {
    dataStatus,
    resultData: resultData?.[0],
    ref: collections,
    db: firestore,
  };
};

export default useGetData;
