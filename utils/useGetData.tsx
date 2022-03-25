import React from 'react';
import { collection, getFirestore, query } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

type GetDataProps = {
  dataBaseName?: string;
  options?: any;
}
const useGetData = ({ dataBaseName = "users", options, }: GetDataProps) => {
  const firestore = useFirestore();
  const collections = collection(getFirestore(), dataBaseName);
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
