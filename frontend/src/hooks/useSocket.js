import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [signalData, setSignalData] = useState(null);
  const [logs, setLogs] = useState([
    { type: 'system', message: '[SISTEMA] Inicializando SMAT-SR para Cooperativa San Antonio R.L...', time: new Date() }
  ]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('signal-update', (data) => setSignalData(data));

    socket.on('wan-status-changed', (data) => {
      setSignalData(prev => prev ? { ...prev, wanLinks: data.wanLinks } : prev);
    });

    socket.on('emi-status-changed', (data) => {
      setSignalData(prev => prev ? { ...prev, emi: data } : prev);
    });

    socket.on('security-alert', (data) => {
      setSignalData(prev => prev ? { ...prev, security: data } : prev);
    });

    socket.on('log-event', (entry) => {
      setLogs(prev => [...prev.slice(-50), { ...entry, time: new Date() }]);
    });

    return () => { socket.disconnect(); };
  }, []);

  const selectBranch = useCallback((branchId) => {
    socketRef.current?.emit('select-branch', branchId);
  }, []);

  const addLog = useCallback((type, message) => {
    setLogs(prev => [...prev.slice(-50), { type, message, time: new Date() }]);
  }, []);

  return { connected, signalData, logs, selectBranch, addLog };
};
