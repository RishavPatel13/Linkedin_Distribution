import { useApp } from '../context/AppContext';

export const useGroups = () => {
  const { groups, isLoading, fetchGroups, addGroupItem, deleteGroupItem } = useApp();

  return {
    groups,
    isLoading,
    fetchGroups,
    addGroup: addGroupItem,
    deleteGroup: deleteGroupItem,
  };
};

export default useGroups;
