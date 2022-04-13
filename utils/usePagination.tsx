/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

type PaginationProps<T = any[]> = { initialData: T[], initialPage: number, itemsPerPage: number, dependencies?: any[], onDepsChange?: (args: any) => void }

export const usePagination = function <T = any[]>({ initialData, initialPage, itemsPerPage, dependencies, onDepsChange }: PaginationProps<T>) {
	const [originalData, setOriginalData] = React.useState(initialData)
	const [pagesBtns, setPagesBtns] = React.useState<number[]>([]);
	const [currentPage, setCurrPage] = React.useState(initialPage);
	const [paginatedData, setPaginatedData] = React.useState(() => {
		const startIndex = currentPage * itemsPerPage;
		return initialData.slice(
			startIndex,
			itemsPerPage + startIndex
		);
	});



	React.useEffect(() => {
		onDepsChange?.(dependencies)
	}, dependencies)

	React.useEffect(() => {
		const maxPageNumber = Math.ceil(originalData.length / itemsPerPage);
		const btns = Array.from({ length: maxPageNumber }).map(
			(_el, index) => index
		);
		setPagesBtns(btns);
	}, [originalData]);


	React.useEffect(() => {
		const startIndex = currentPage * itemsPerPage;
		const paginatedData = originalData.slice(
			startIndex,
			itemsPerPage + startIndex
		);
		setPaginatedData(paginatedData)
	}, [currentPage, originalData]);


	return { paginatedData, currentPage, setOriginalData, itemsPerPage, pagesBtns, setCurrPage };
};