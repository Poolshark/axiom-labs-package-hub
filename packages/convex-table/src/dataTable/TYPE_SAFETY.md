# Type Safety in DataTable

This document demonstrates the type safety features added to the DataTable component.

## Column Key Type Safety

Column keys are now constrained to only accept valid keys from the row data type:

```typescript
type User = {
  id: string;
  name: string;
  email: string;
};

// ✅ Valid - all keys exist in User type
const validColumns: ColumnDef<User>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
];

// ❌ TypeScript Error - "invalid" is not a key of User
const invalidColumns: ColumnDef<User>[] = [
  { key: "invalid", label: "Invalid" }, // Type error!
];
```

## Render Function Type Inference

The render function now receives properly typed values based on the column key:

```typescript
type Product = {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
};

const columns: ColumnDef<Product>[] = [
  {
    key: "name",
    label: "Product Name",
    // value is inferred as string
    render: (value) => <strong>{value.toUpperCase()}</strong>,
  },
  {
    key: "price",
    label: "Price",
    // value is inferred as number
    render: (value) => `$${value.toFixed(2)}`,
  },
  {
    key: "inStock",
    label: "In Stock",
    // value is inferred as boolean
    render: (value) => (value ? "Yes" : "No"),
  },
];
```

## SortBy Type Safety

The `sortBy` prop is now constrained to valid keys:

```typescript
type Tenant = {
  _id: string;
  name: string;
  slug: string;
};

// ✅ Valid
<DataTable<Tenant>
  columns={columns}
  data={data}
  sortBy="name" // Valid key
  // ...
/>

// ❌ TypeScript Error
<DataTable<Tenant>
  columns={columns}
  data={data}
  sortBy="invalid" // Type error!
  // ...
/>
```

## Validating URL Parameters

Use the `validateSortBy` helper to safely validate URL parameters:

```typescript
import { validateSortBy } from "@/components/data-table";

type Tenant = {
  _id: string;
  name: string;
  slug: string;
  hostname: string;
};

// Parse URL params (returns string | undefined)
const { sortBy } = parseTableParams(params);

// Validate and get type-safe key
const validSortBy = validateSortBy<Tenant>(sortBy, [
  "_id",
  "name",
  "slug",
  "hostname",
]);

// validSortBy is now: (keyof Tenant & string) | undefined
// TypeScript knows it's safe to use with DataTable
```

## Benefits

1. **Compile-time errors**: Invalid column keys are caught during development
2. **Better IntelliSense**: IDE autocomplete shows only valid keys
3. **Type inference**: Render functions receive correctly typed values
4. **Refactoring safety**: Renaming fields will show errors in column definitions
5. **Runtime validation**: Helper functions ensure URL params are valid

## Implementation Details

The type system uses TypeScript's mapped types and distributive conditional types:

```typescript
// Each column definition is typed based on its specific key
type TypedColumnDef<T, K extends keyof T & string> = {
  key: K;
  label: string;
  render?: (value: T[K], row: T) => React.ReactNode;
};

// ColumnDef is a union of all possible TypedColumnDef variants
type ColumnDef<T> = {
  [K in keyof T & string]: TypedColumnDef<T, K>;
}[keyof T & string];
```

This ensures that each column's render function receives the correct value type for that specific key.
