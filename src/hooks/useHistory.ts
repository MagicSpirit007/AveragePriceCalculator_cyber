import { useState, useEffect, useCallback } from 'react';
import { HistoryRecord } from '../types/favorites';
import { storageService } from '../services/storage';

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        try {
            const records = await storageService.getHistory();
            setHistory(records);
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const addHistory = async (record: HistoryRecord) => {
        try {
            await storageService.addHistory(record);
            await loadHistory(); // Refresh list
        } catch (error) {
            console.error('Failed to add history:', error);
        }
    };

    const deleteHistory = async (id: string) => {
        try {
            await storageService.deleteHistory(id);
            await loadHistory();
        } catch (error) {
            console.error('Failed to delete history:', error);
        }
    };

    const clearHistory = async () => {
        try {
            await storageService.clearHistory();
            await loadHistory();
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    }

    return {
        history,
        loading,
        addHistory,
        deleteHistory,
        clearHistory,
        refreshHistory: loadHistory
    };
};
