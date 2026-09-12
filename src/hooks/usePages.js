import { useApp } from '../context/AppContext';

export const usePages = () => {
  const { pages, isLoading, fetchPages, addPageItem, deletePageItem } = useApp();

  return {
    pages,
    isLoading,
    fetchPages,
    addPage: addPageItem,
    deletePage: deletePageItem,
  };
};

export default usePages;
