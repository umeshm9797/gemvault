// ============================================================
//  GemVault — Global App Context
// ============================================================
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LISTINGS, MY_STONES, PENDING_SUBMISSIONS, MOCK_USERS, ACTIVITY_FEED } from '../data/seedData';

const AppContext = createContext();

const initialState = {
  currentUser:       null,
  listings:          [...LISTINGS],
  myStones:          [...MY_STONES],
  pendingSubmissions:[...PENDING_SUBMISSIONS],
  activityFeed:      [...ACTIVITY_FEED],
  adminUsers:        [],
  notifications:     3,
  isLoading:         false,
};

function reducer(state, action) {
  switch (action.type) {

    case 'SET_USER':
      return { ...state, currentUser: action.payload };

    case 'LOGOUT':
      return { ...state, currentUser: null };

    case 'ADD_LISTING':
      return { ...state, listings: [action.payload, ...state.listings] };

    case 'REMOVE_LISTING': {
      return { ...state, listings: state.listings.filter(l => l.id !== action.payload) };
    }

    case 'ADD_MY_STONE':
      return { ...state, myStones: [action.payload, ...state.myStones] };

    case 'REMOVE_MY_STONE':
      return { ...state, myStones: state.myStones.filter(s => s.id !== action.payload) };

    case 'ADD_SUBMISSION':
      return { ...state, pendingSubmissions: [action.payload, ...state.pendingSubmissions] };

    case 'APPROVE_SUBMISSION': {
      const sub = state.pendingSubmissions.find(s => s.id === action.payload);
      const newListing = sub ? {
        id:          String(Date.now()),
        name:        sub.name, type: sub.type, emoji: sub.emoji,
        weight:      sub.weight, clarity: sub.clarity,
        price:       sub.price, seller: sub.user, badge: 'new',
        origin:      sub.origin || 'Unknown', cut: sub.cut || '—',
        cert:        sub.cert, status: 'active',
        description: sub.description || '',
        createdAt:   new Date().toISOString().slice(0,10), offers: 0,
      } : null;
      return {
        ...state,
        pendingSubmissions: state.pendingSubmissions.filter(s => s.id !== action.payload),
        listings: newListing ? [newListing, ...state.listings] : state.listings,
        activityFeed: [{ id: Date.now(), icon:'✅', text:`${sub?.name} approved and live`, time:'just now', type:'approved' }, ...state.activityFeed],
      };
    }

    case 'REJECT_SUBMISSION':
      return {
        ...state,
        pendingSubmissions: state.pendingSubmissions.filter(s => s.id !== action.payload),
      };

    case 'UPDATE_USER_STATS':
      return { ...state, currentUser: { ...state.currentUser, ...action.payload } };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restore session on app start
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('gemvault_user');
        if (saved) dispatch({ type:'SET_USER', payload: JSON.parse(saved) });
      } catch {}
    })();
  }, []);

  // Actions
  const login = async (email, password) => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    const safeUser = { ...user };
    delete safeUser.password;
    dispatch({ type:'SET_USER', payload: safeUser });
    await AsyncStorage.setItem('gemvault_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const register = async (data) => {
    if (MOCK_USERS.find(u => u.email === data.email)) throw new Error('Email already registered');
    const newUser = { id: String(Date.now()), ...data, role:'seller', listings:0, sold:0, earned:0 };
    MOCK_USERS.push({ ...newUser, password: data.password });
    const safeUser = { ...newUser };
    delete safeUser.password;
    dispatch({ type:'SET_USER', payload: safeUser });
    await AsyncStorage.setItem('gemvault_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('gemvault_user');
    dispatch({ type:'LOGOUT' });
  };

  const submitListing = (listingData) => {
    const newStone = { id: String(Date.now()), ...listingData, status:'pending', offers:0, createdAt: new Date().toISOString().slice(0,10) };
    const submission = { ...newStone, user: `${state.currentUser?.firstName} ${state.currentUser?.lastName}`, email: state.currentUser?.email, submitted: newStone.createdAt };
    dispatch({ type:'ADD_MY_STONE', payload: newStone });
    dispatch({ type:'ADD_SUBMISSION', payload: { id: 'sub_'+Date.now(), ...submission } });
    dispatch({ type:'UPDATE_USER_STATS', payload: { listings: (state.currentUser?.listings||0)+1 } });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, register, logout, submitListing }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
