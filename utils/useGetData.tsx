import { collection, query, } from 'firebase/firestore';
import { useFirestoreCollectionData } from 'reactfire';
import { db } from '../services/firebase-config';

type GetDataProps = {
  dataBaseName?: string;
  options?: any;
}
const useGetData = ({ dataBaseName = "users", options, }: GetDataProps) => {
  const collections = collection(db, dataBaseName);
  const queryRef = options
    ? query(collections, ...options)
    : query(collections);
  const { status: dataStatus, data: resultData } =
    useFirestoreCollectionData(queryRef);

  return {
    dataStatus,
    resultData: resultData?.[0],
    ref: collections,
    db: db,
  };
};

export default useGetData;
