# @axiom-labs/convex-table

A flexible, type-safe table component library for React and Next.js applications with built-in Convex integration. Features sortable columns, pagination, search, and URL state synchronization for Next.js.

## Features

- 🎯 **Dual Framework Support**: Separate entry points for React and Next.js
- 🔒 **Type-Safe**: Full TypeScript support with generic types
- 🎨 **Styled Components**: Bundled shadcn/ui components (no external setup required)
- 🔗 **URL Synchronization**: Next.js version syncs table state with URL parameters
- 🎛️ **Flexible State Management**: React version works with any state management solution
- ♿ **Accessible**: WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation
- 📦 **Tree-Shakeable**: Import only what you need

## Installation

### For React Projects

```bash
npm install @axiom-labs/convex-table react
```

### For Next.js Projects

```bash
npm install @axiom-labs/convex-table react next
```

### Peer Dependencies

- **react**: ^19.0.0 (required)
- **next**: ^16.0.0 (optional)

The package bundles all shadcn/ui dependencies internally, so you don't need to install or configure shadcn/ui separately.

## Entry Points

This package provides three entry points:

### `@axiom-labs/convex-table` (Main Entry)

Exports shared code used by both frameworks:
- `DataTable` component
- TypeScript types
- Utility functions

### `@axiom-labs/convex-table/react` (React Entry)

**Use this for**: Standard React applications, React with custom state management (Redux, Zustand, Jotai, etc.)

Components accept state and callbacks as props, giving you full control over state management:
- `SearchInput` - Controlled input with debouncing
- `TableHeader` - Sortable column headers with callbacks
- `TablePagination` - Pagination controls with callbacks
- `useTableState` - Optional hook for local state management

**Key characteristics**:
- No Next.js dependencies
- Callback-based API
- Works with any state management solution
- You control how state is stored and updated

### `@axiom-labs/convex-table/next` (Next.js Entry)

**Use this for**: Next.js applications using the App Router

Components automatically sync with URL search parameters:
- `SearchInput` - Syncs search query to URL
- `TableHeader` - Syncs sort state to URL
- `TablePagination` - Syncs page/pageSize to URL
- `useTableState` - Hook that reads/writes URL parameters

**Key characteristics**:
- Requires Next.js 14+ with App Router
- Automatic URL synchronization
- Shareable/bookmarkable table states
- Uses `useRouter` and `useSearchParams` from `next/navigation`

## Tailwind CSS Configuration

This package requires Tailwind CSS to be configured in your project. The bundled components use Tailwind utility classes and CSS variables.

### Required Setup

1. **Install Tailwind CSS** (if not already installed):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. **Configure Tailwind** to scan the package files:

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Add this line to include the package components
    './node_modules/@axiom-labs/convex-table/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. **Add CSS variables** to your global CSS file:

```css
/* app/globals.css or styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

## Usage Examples

### React Example: Basic Usage with useState

```tsx
import { useState } from 'react';
import { DataTable } from '@axiom-labs/convex-table';
import { SearchInput, TableHeader, TablePagination } from '@axiom-labs/convex-table/react';
import type { ColumnDef } from '@axiom-labs/convex-table';

interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function UsersTable({ users }: { users: User[] }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  const columns: ColumnDef<User>[] = [
    { key: 'name', label: 'Name', sortable: true, searchable: true },
    { key: 'email', label: 'Email', sortable: true, searchable: true },
    { key: 'role', label: 'Role', sortable: true },
  ];

  // Filter and sort data
  const filteredData = users.filter(user =>
    search ? user.name.toLowerCase().includes(search.toLowerCase()) ||
             user.email.toLowerCase().includes(search.toLowerCase())
           : true
  );

  const sortedData = sortBy
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortBy as keyof User];
        const bVal = b[sortBy as keyof User];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortOrder === 'asc' ? comparison : -comparison;
      })
    : filteredData;

  const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (columnKey: string, newSortOrder: 'asc' | 'desc' | undefined) => {
    setSortBy(newSortOrder ? columnKey : undefined);
    setSortOrder(newSortOrder || 'asc');
  };

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search users..."
      />
      
      <DataTable<User>
        columns={columns}
        data={paginatedData}
      />
      
      <TablePagination
        page={page}
        pageSize={pageSize}
        totalCount={sortedData.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
```

### React Example: Using useTableState Hook

```tsx
import { DataTable } from '@axiom-labs/convex-table';
import { SearchInput, TableHeader, TablePagination, useTableState } from '@axiom-labs/convex-table/react';
import type { ColumnDef } from '@axiom-labs/convex-table';

interface Product extends Record<string, unknown> {
  id: string;
  name: string;
  price: number;
  category: string;
}

export function ProductsTable({ products }: { products: Product[] }) {
  const { state, actions } = useTableState({
    page: 1,
    pageSize: 20,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const columns: ColumnDef<Product>[] = [
    { key: 'name', label: 'Product Name', sortable: true, searchable: true },
    { 
      key: 'price', 
      label: 'Price', 
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`
    },
    { key: 'category', label: 'Category', sortable: true },
  ];

  // Apply filtering, sorting, and pagination
  const filteredData = state.search
    ? products.filter(p => p.name.toLowerCase().includes(state.search!.toLowerCase()))
    : products;

  const sortedData = state.sortBy
    ? [...filteredData].sort((a, b) => {
        const aVal = a[state.sortBy as keyof Product];
        const bVal = b[state.sortBy as keyof Product];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return state.sortOrder === 'asc' ? comparison : -comparison;
      })
    : filteredData;

  const paginatedData = sortedData.slice(
    (state.page - 1) * state.pageSize,
    state.page * state.pageSize
  );

  return (
    <div className="space-y-4">
      <SearchInput
        value={state.search || ''}
        onChange={actions.setSearch}
        placeholder="Search products..."
      />
      
      <DataTable<Product>
        columns={columns}
        data={paginatedData}
      />
      
      <TablePagination
        page={state.page}
        pageSize={state.pageSize}
        totalCount={sortedData.length}
        onPageChange={actions.setPage}
        onPageSizeChange={actions.setPageSize}
      />
    </div>
  );
}
```

### React Example: Integration with Redux

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { DataTable } from '@axiom-labs/convex-table';
import { SearchInput, TablePagination } from '@axiom-labs/convex-table/react';
import { setPage, setSearch, setSort } from './store/tableSlice';
import type { ColumnDef } from '@axiom-labs/convex-table';

interface TableRow extends Record<string, unknown> {
  id: string;
  // Add your data fields here
}

const columns: ColumnDef<TableRow>[] = [
  // Define your columns
];

export function ReduxTable() {
  const dispatch = useDispatch();
  const { data, page, pageSize, sortBy, sortOrder, search, totalCount } = useSelector(
    (state: RootState) => state.table
  );

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={(value) => dispatch(setSearch(value))}
      />
      
      <DataTable<TableRow>
        columns={columns}
        data={data}
      />
      
      <TablePagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={(p) => dispatch(setPage(p))}
      />
    </div>
  );
}
```

### Next.js Example: App Router with URL Synchronization

```tsx
// app/users/page.tsx
import { DataTable } from '@axiom-labs/convex-table';
import { SearchInput, TablePagination } from '@axiom-labs/convex-table/next';
import type { ColumnDef } from '@axiom-labs/convex-table';

interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
}

// This component automatically syncs with URL parameters
export default function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string; sortBy?: string; sortOrder?: string; search?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const sortBy = searchParams.sortBy;
  const sortOrder = (searchParams.sortOrder as 'asc' | 'desc') || 'asc';
  const search = searchParams.search || '';

  // Fetch data based on URL parameters
  const users = fetchUsers({ page, pageSize, sortBy, sortOrder, search });

  const columns: ColumnDef<User>[] = [
    { key: 'name', label: 'Name', sortable: true, searchable: true },
    { key: 'email', label: 'Email', sortable: true, searchable: true },
    { key: 'role', label: 'Role', sortable: true },
  ];

  return (
    <div className="space-y-4">
      <SearchInput placeholder="Search users..." />
      
      <DataTable<User>
        columns={columns}
        data={users.data}
        search={search}
      />
      
      <TablePagination
        page={page}
        pageSize={pageSize}
        totalCount={users.totalCount}
      />
    </div>
  );
}
```

### Next.js Example: Server-Side Data Fetching with Convex

```tsx
// app/products/page.tsx
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { DataTable } from '@axiom-labs/convex-table';
import { SearchInput, TablePagination } from '@axiom-labs/convex-table/next';
import type { ColumnDef } from '@axiom-labs/convex-table';

interface Product extends Record<string, unknown> {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;
  const search = params.search || '';

  // Fetch data from Convex using search index and pagination
  const result = await fetchQuery(api.products.list, {
    paginationOpts: {
      numItems: pageSize,
      cursor: null, // For page-based UI, we fetch from start each time
    },
    search: search || undefined,
  });

  // For page-based pagination, we need to slice the results
  // Note: This fetches all pages up to current page
  // For better performance with large datasets, consider using cursor-based "Load More" UI
  const allItems: Product[] = [];
  let currentResult = result;
  
  // Fetch pages until we have enough data for the current page
  while (allItems.length < page * pageSize && currentResult.page.length > 0) {
    allItems.push(...currentResult.page);
    
    if (currentResult.isDone || allItems.length >= page * pageSize) {
      break;
    }
    
    // Fetch next page if needed
    if (currentResult.continueCursor) {
      currentResult = await fetchQuery(api.products.list, {
        paginationOpts: {
          numItems: pageSize,
          cursor: currentResult.continueCursor,
        },
        search: search || undefined,
      });
    } else {
      break;
    }
  }

  // Slice to get only the current page
  const startIndex = (page - 1) * pageSize;
  const paginatedData = allItems.slice(startIndex, startIndex + pageSize);

  const columns: ColumnDef<Product>[] = [
    { key: 'name', label: 'Product', sortable: true, searchable: true },
    { 
      key: 'price', 
      label: 'Price', 
      sortable: true,
      render: (value) => `$${(value as number).toFixed(2)}`
    },
    { key: 'stock', label: 'Stock', sortable: true },
  ];

  return (
    <div className="container mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      
      <SearchInput placeholder="Search products..." />
      
      <DataTable<Product>
        columns={columns}
        data={paginatedData}
        search={search}
      />
      
      <TablePagination
        page={page}
        pageSize={pageSize}
        totalCount={allItems.length}
      />
    </div>
  );
}
```

**Note**: The example above shows how to adapt Convex's cursor-based pagination to a page-based UI. For better performance with large datasets, consider using a "Load More" button UI pattern that works naturally with Convex's cursor-based pagination:

```tsx
// Alternative: Load More pattern (better for large datasets)
'use client';

import { usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DataTable } from '@axiom-labs/convex-table';
import { SearchInput } from '@axiom-labs/convex-table/next';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  
  const { results, status, loadMore } = usePaginatedQuery(
    api.products.list,
    { search: search || undefined },
    { initialNumItems: 10 }
  );

  const columns = [
    { key: 'name', label: 'Product', sortable: true, searchable: true },
    { 
      key: 'price', 
      label: 'Price', 
      render: (value) => `$${(value as number).toFixed(2)}`
    },
    { key: 'stock', label: 'Stock' },
  ];

  return (
    <div className="container mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      
      <SearchInput 
        value={search}
        onChange={setSearch}
        placeholder="Search products..." 
      />
      
      <DataTable columns={columns} data={results} search={search} />
      
      {status === 'CanLoadMore' && (
        <Button onClick={() => loadMore(10)}>Load More</Button>
      )}
    </div>
  );
}
```

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    price: v.number(),
    stock: v.number(),
    description: v.optional(v.string()),
  }).searchIndex("search_name", {
    searchField: "name",
  }),
});
```

```typescript
// convex/products.ts
import { query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // If search query provided, use search index
    if (args.search && args.search.trim()) {
      const results = await ctx.db
        .query('products')
        .withSearchIndex('search_name', (q) => q.search('name', args.search!))
        .paginate(args.paginationOpts);
      
      return results;
    }
    
    // Otherwise, return all products with pagination
    const results = await ctx.db
      .query('products')
      .order('desc')
      .paginate(args.paginationOpts);
    
    return results;
  },
});
```

## API Reference

### DataTable Component

The `DataTable` component is a generic component that requires a type parameter for proper type inference:

```tsx
<DataTable<YourDataType>
  columns={columns}
  data={data}
  search={searchQuery}  // optional
/>
```

**Props:**
- `columns`: Array of column definitions
- `data`: Array of row data to display (pre-filtered and pre-sorted)
- `search`: Optional search query string (used for empty state message)

**Important**: 
- Always specify the generic type parameter (e.g., `<User>`, `<Product>`) when using `DataTable` to ensure proper type checking for your columns and data.
- Your data type must extend `Record<string, unknown>` or have an index signature. For example:

```tsx
// Option 1: Extend Record<string, unknown>
interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
}

// Option 2: Add index signature
interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}
```

### Types

```typescript
// Column definition
type ColumnDef<T> = {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

// Table state
type TableState = {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  search?: string;
};
```

### Components

See usage examples above for detailed component APIs.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
