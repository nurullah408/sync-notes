import type { TAuthContext } from '@/types/AuthContext';
import { createContext } from 'react';

export const AuthContext = createContext<TAuthContext | null>(null);