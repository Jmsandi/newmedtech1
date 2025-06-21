
import { User } from './types';
import { getAllDocsByType } from './core';

// Authentication functions
export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const users = await getAllDocsByType<User>('user');
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
};

export const getUserByRole = async (role: User['role']): Promise<User[]> => {
  const users = await getAllDocsByType<User>('user');
  return users.filter(user => user.role === role);
};
