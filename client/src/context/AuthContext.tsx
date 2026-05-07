import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  currentUser: User;
  switchUser: (userId: string | number) => void;
  mockUsers: User[];
}

const mockUsers: User[] = [
  { id: 1, name: "Alice", role: "org_admin", department: "engineering" },
  { id: 2, name: "Bob", role: "dept_head", department: "engineering" },
  { id: 3, name: "Charlie", role: "member", department: "engineering" },
  { id: 4, name: "Diana", role: "dept_head", department: "design" },
  { id: 5, name: "Eve", role: "member", department: "design" },
  { id: 6, name: "Frank", role: "member", department: "engineering" }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);

  const switchUser = (userId: string | number) => {
    const user = mockUsers.find(u => u.id === parseInt(userId.toString(), 10));
    if (user) setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchUser, mockUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};