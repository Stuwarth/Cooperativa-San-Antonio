import { useState, useEffect, useCallback } from 'react';
import { fetchBranches } from '../services/api';

export const useBranches = (socketSelectBranch) => {
  const [branches, setBranches] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchBranches().then(res => { if (res.success) setBranches(res.data); }).catch(console.error);
  }, []);

  const selectBranch = useCallback((id) => {
    setSelectedId(id);
    socketSelectBranch?.(id);
  }, [socketSelectBranch]);

  const filtered = branches.filter(b =>
    b.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    b.zona.toLowerCase().includes(filter.toLowerCase())
  );

  return { branches: filtered, allBranches: branches, selectedId, selectBranch, filter, setFilter };
};
