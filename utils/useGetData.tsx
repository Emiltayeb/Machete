import { collection, query } from 'firebase/firestore';
import React from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

const useGetData = ({
  dataBaseName,
  options,
}: {
  dataBaseName: string;
  options?: any;
}) => {
  const firestore = useFirestore();
  const collections = collection(firestore, dataBaseName);
  const queryRef = options
    ? query(collections, ...options)
    : query(collections);
  const { status: dataStatus, data: resultData } =
    useFirestoreCollectionData(queryRef);

  return { dataStatus, resultData: resultData?.[0], ref: collections, db: firestore };
};

export default useGetData;
