# Development Guidelines

## Overview

This document establishes comprehensive development guidelines for the WebCraft project, ensuring consistent code quality, maintainability, and team collaboration.

## Table of Contents

1. [Code Standards](#code-standards)
2. [File Organization](#file-organization)
3. [Naming Conventions](#naming-conventions)
4. [Component Guidelines](#component-guidelines)
5. [API Development](#api-development)
6. [State Management](#state-management)
7. [Styling Guidelines](#styling-guidelines)
8. [Testing Guidelines](#testing-guidelines)
9. [Git Workflow](#git-workflow)
10. [Documentation Standards](#documentation-standards)
11. [Performance Guidelines](#performance-guidelines)
12. [Security Guidelines](#security-guidelines)
13. [Debugging Guidelines](#debugging-guidelines)
14. [Code Review Process](#code-review-process)

---

## Code Standards

### TypeScript Configuration

Always use strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

### Code Quality Rules

1. **Always use TypeScript** for new files
2. **No any types** - Use proper type definitions
3. **Explicit return types** for functions
4. **No unused variables** - Clean up unused code
5. **Consistent error handling** throughout the application
6. **Proper async/await** usage instead of raw promises

### Example TypeScript Code

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

type UserRole = 'admin' | 'user' | 'guest';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<User> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch user');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// ❌ Bad
const getUser = async (id) => {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data;
};
```

---

## File Organization

### Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Button, Input, etc.)
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   └── forms/            # Form-specific components
├── pages/               # Page components (routes)
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── services/            # API service functions
├── store/               # State management (Zustand)
├── styles/              # Global styles and themes
└── constants/           # Application constants
```

### File Naming

```typescript
// Components: PascalCase
components/
├── Button.tsx
├── UserCard.tsx
├── NavigationHeader.tsx

// Utilities: camelCase
utils/
├── formatDate.ts
├── validateEmail.ts
├── apiHelpers.ts

// Hooks: camelCase with 'use' prefix
hooks/
├── useAuth.ts
├── useTheme.ts
├── useLocalStorage.ts

// Types: PascalCase with descriptive names
types/
├── User.types.ts
├── Api.types.ts
├── Component.types.ts
```

---

## Naming Conventions

### Variables and Functions

```typescript
// ✅ Good
const userName = 'John Doe';
const isLoading = true;
const userCount = 42;

const getUserById = (id: string): User => { ... };
const calculateTotalPrice = (items: CartItem[]): number => { ... };
const formatDateString = (date: Date): string => { ... };

// ❌ Bad
const u = 'John Doe';
const loading = true;
const count = 42;

const getUser = (x: string) => { ... };
const calc = (items: any[]) => { ... };
const format = (d: Date) => { ... };
```

### Constants

```typescript
// ✅ Good
const API_BASE_URL = 'https://api.example.com';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_PAGE_SIZE = 20;

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile'
} as const;

// ❌ Bad
const apiUrl = 'https://api.example.com';
const maxSize = 5242880;
const pageSize = 20;
```

### React Components

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children 
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ Bad
const Button = (props: any) => {
  return <button {...props} />;
};
```

---

## Component Guidelines

### Component Structure

```typescript
// ✅ Good
// src/components/UserCard/UserCard.tsx
import React from 'react';
import { User } from '@/types/User.types';
import { formatDate } from '@/utils/formatDate';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(user);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDelete(user.id);
    }
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>Joined: {formatDate(user.createdAt)}</p>
      <div className="actions">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

// ✅ Good: Separate styles
// src/components/UserCard/UserCard.module.css
.user-card {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.user-card h3 {
  margin: 0 0 0.5rem 0;
}

.user-card .actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
```

### Component Best Practices

1. **Keep components small and focused** (max 200 lines)
2. **Use composition over inheritance**
3. **Extract reusable logic into custom hooks**
4. **Use TypeScript interfaces for props**
5. **Implement proper error boundaries**
6. **Use semantic HTML elements**
7. **Add accessibility attributes**

### Custom Hooks

```typescript
// ✅ Good: Custom hook for form handling
// src/hooks/useForm.ts
import { useState } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    // Submit
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      // Reset form on success
      setValues(initialValues);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};
```

---

## API Development

### API Service Structure

```typescript
// ✅ Good: API service layer
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiError {
  message: string;
  status?: number;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const error: ApiError = {
          message: `HTTP error! status: ${response.status}`,
          status: response.status
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService(API_BASE_URL);
```

### API Usage in Components

```typescript
// ✅ Good: Using API service in component
// src/services/userService.ts
import { api } from './api';
import { User } from '@/types/User.types';

export const userService = {
  async getUserById(id: string): Promise<User> {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data;
  },

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const response = await api.post<{ data: User }>('/users', userData);
    return response.data;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const response = await api.put<{ data: User }>(`/users/${id}`, updates);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
```

---

## State Management

### Zustand Store Structure

```typescript
// ✅ Good: Zustand store with TypeScript
// src/store/userStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '@/types/User.types';
import { userService } from '@/services/userService';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUser: (id: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  clearUser: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        error: null,

        fetchUser: async (id: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const user = await userService.getUserById(id);
            set({ user, isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch user',
              isLoading: false 
            });
          }
        },

        updateUser: async (updates: Partial<User>) => {
          const { user } = get();
          if (!user) return;

          set({ isLoading: true, error: null });
          
          try {
            const updatedUser = await userService.updateUser(user.id, updates);
            set({ user: updatedUser, isLoading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to update user',
              isLoading: false 
            });
          }
        },

        clearUser: () => set({ user: null }),
        clearError: () => set({ error: null })
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ user: state.user })
      }
    )
  )
);
```

---

## Styling Guidelines

### Tailwind CSS Best Practices

```typescript
// ✅ Good: Semantic and maintainable classes
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">
    User Profile
  </h2>
  <p className="text-gray-600 leading-relaxed">
    Welcome to your profile page where you can manage your account settings.
  </p>
</div>

// ❌ Bad: Overly complex or inconsistent
<div className="bg-white rounded shadow p-6 hover:shadow-lg">
  <h2 className="text-xl font-bold text-gray-800 mb-3">
    User Profile
  </h2>
  <p className="text-gray-600">
    Welcome to your profile page.
  </p>
</div>
```

### Responsive Design

```typescript
// ✅ Good: Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-6 lg:p-8">
  <div className="text-sm md:text-base lg:text-lg">
    Responsive content
  </div>
</div>

// ✅ Good: Responsive navigation
<nav className="flex flex-col md:flex-row md:items-center md:justify-between">
  <div className="mb-4 md:mb-0">
    <Logo />
  </div>
  <ul className="flex flex-col md:flex-row md:space-x-4">
    <li><Link to="/">Home</Link></li>
    <li><Link to="/about">About</Link></li>
    <li><Link to="/contact">Contact</Link></li>
  </ul>
</nav>
```

### Custom CSS Classes

When custom CSS is needed:

```css
/* ✅ Good: CSS modules */
/* Button.module.css */
.button {
  composes: base-button from global;
  transition: all 0.2s ease-in-out;
}

.button-primary {
  composes: button;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.button-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## Testing Guidelines

### Unit Testing

```typescript
// ✅ Good: Component unit test
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button onClick={jest.fn()}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    const { container } = render(
      <Button variant="primary" onClick={jest.fn()}>Primary</Button>
    );
    expect(container.firstChild).toHaveClass('btn-primary');
  });
});
```

### Integration Testing

```typescript
// ✅ Good: API integration test
// src/services/__tests__/userService.test.ts
import { userService } from '../userService';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          id: req.params.id,
          name: 'John Doe',
          email: 'john@example.com'
        }
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserService', () => {
  it('fetches user successfully', async () => {
    const user = await userService.getUserById('123');
    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('handles API errors gracefully', async () => {
    server.use(
      rest.get('/api/users/:id', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    await expect(userService.getUserById('123')).rejects.toThrow();
  });
});
```

---

## Git Workflow

### Branch Strategy

```bash
# Main branches
main        # Production-ready code
develop     # Integration branch for features

# Feature branches
feature/user-authentication
feature/payment-integration
feature/admin-dashboard

# Bug fix branches
fix/login-error
fix/mobile-responsive-issue

# Release branches
release/v1.2.0
```

### Commit Message Convention

```bash
# Format: type(scope): description

# Examples:
feat(auth): add user login functionality
fix(ui): resolve mobile navigation issue
docs(readme): update installation instructions
style(button): improve hover effects
refactor(api): optimize database queries
test(user): add unit tests for user service
chore(deps): update npm packages
```

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Pull Request Process

1. **Create feature branch from develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **PR Requirements**
   - [ ] Code follows project standards
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] No console.logs or debug code
   - [ ] Performance considered
   - [ ] Security reviewed

---

## Documentation Standards

### Code Documentation

```typescript
// ✅ Good: JSDoc comments for functions
/**
 * Calculates the total price of items in a shopping cart
 * @param items - Array of cart items with price and quantity
 * @param taxRate - Tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns Total price including tax, rounded to 2 decimal places
 * @throws Error if items array is empty or tax rate is negative
 * @example
 * ```typescript
 * const items = [{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }];
 * const total = calculateTotal(items, 0.08); // Returns 27.00
 * ```
 */
export const calculateTotal = (
  items: CartItem[],
  taxRate: number
): number => {
  if (items.length === 0) {
    throw new Error('Items array cannot be empty');
  }
  
  if (taxRate < 0) {
    throw new Error('Tax rate cannot be negative');
  }

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );
  
  const total = subtotal * (1 + taxRate);
  return Math.round(total * 100) / 100;
};
```

### Component Documentation

```typescript
// ✅ Good: Component documentation
/**
 * UserCard Component
 * 
 * Displays user information in a card format with edit and delete actions.
 * Includes user avatar, name, email, and join date.
 * 
 * @component
 * @example
 * ```tsx
 * <UserCard
 *   user={userData}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  // Component implementation
};
```

---

## Performance Guidelines

### React Performance

```typescript
// ✅ Good: Memo for expensive components
import { memo } from 'react';

interface ExpensiveListProps {
  items: Item[];
  filter: string;
}

export const ExpensiveList = memo<ExpensiveListProps>(({ items, filter }) => {
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <ul>
      {filteredItems.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});

// ✅ Good: useMemo for expensive calculations
const ExpensiveComponent = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: heavyComputation(item)
    }));
  }, [data]);

  return <div>{/* render processedData */}</div>;
};

// ✅ Good: useCallback for stable function references
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return <ChildComponent onClick={handleClick} />;
};
```

### API Performance

```typescript
// ✅ Good: Implement caching
const useCachedData = (key: string, fetcher: () => Promise<any>) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(key);
    
    if (cached) {
      setData(JSON.parse(cached));
      setIsLoading(false);
    } else {
      fetcher().then(result => {
        setData(result);
        localStorage.setItem(key, JSON.stringify(result));
        setIsLoading(false);
      });
    }
  }, [key, fetcher]);

  return { data, isLoading };
};

// ✅ Good: Debounce search inputs
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const debouncedSearch = useMemo(
    () => debounce(async (term: string) => {
      if (term.length > 2) {
        const results = await searchAPI(term);
        setResults(results);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <SearchResults results={results} />
    </div>
  );
};
```

---

## Security Guidelines

### Input Validation

```typescript
// ✅ Good: Input validation and sanitization
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

### API Security

```typescript
// ✅ Good: Secure API calls
const secureApiCall = async (endpoint: string, token: string, data?: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-CSRF-Token': getCSRFToken() // Implement CSRF protection
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
```

---

## Debugging Guidelines

### Development Debugging

```typescript
// ✅ Good: Proper debugging practices
const debugComponent = (componentName: string, props: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔍 ${componentName} Debug Info`);
    console.log('Props:', props);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }
};

// ✅ Good: Error boundaries
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Production Debugging

```typescript
// ✅ Good: Structured logging
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: any;
  userId?: string;
}

class Logger {
  static log(entry: LogEntry) {
    const logEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(`[${logEntry.level.toUpperCase()}]`, logEntry);
    } else {
      // Send to logging service (e.g., Sentry, LogRocket)
      this.sendToLoggingService(logEntry);
    }
  }

  static info(message: string, context?: any) {
    this.log({ level: 'info', message, context });
  }

  static warn(message: string, context?: any) {
    this.log({ level: 'warn', message, context });
  }

  static error(message: string, error?: Error, context?: any) {
    this.log({ 
      level: 'error', 
      message, 
      context: { ...context, error: error?.message, stack: error?.stack } 
    });
  }

  private static sendToLoggingService(entry: LogEntry) {
    // Implementation for sending to logging service
    console.log('Sending to logging service:', entry);
  }
}
```

---

## Code Review Process

### Pre-Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows project standards
- [ ] All tests pass
- [ ] No console.logs or debug code
- [ ] Performance considered
- [ ] Security reviewed
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)

### Review Criteria

1. **Functionality**: Does the code work as intended?
2. **Readability**: Is the code easy to understand?
3. **Maintainability**: Can the code be easily modified?
4. **Performance**: Are there any performance concerns?
5. **Security**: Are there any security vulnerabilities?
6. **Testing**: Are there adequate tests?
7. **Documentation**: Is the code properly documented?

### Review Process

1. **Author**: Submit PR with detailed description
2. **Reviewer**: Review within 24 hours
3. **Feedback**: Address all feedback
4. **Approval**: Get approval from at least one reviewer
5. **Merge**: Merge to develop branch
6. **Deploy**: Deploy to staging for testing

---

## Conclusion

These guidelines ensure:

- **Consistency**: Uniform code style across the project
- **Quality**: High standards for code quality and maintainability
- **Collaboration**: Smooth team collaboration and code reviews
- **Performance**: Optimized application performance
- **Security**: Secure coding practices
- **Scalability**: Code that can grow with the project

Remember: **Guidelines are meant to be helpful, not restrictive**. When in doubt, prioritize clarity, maintainability, and team consensus.

**Happy coding!** 🚀