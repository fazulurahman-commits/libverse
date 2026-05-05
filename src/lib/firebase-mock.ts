
export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  total_copies: number;
  available_copies: number;
  location: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  member_id: string;
  phone: string;
  role: 'admin' | 'user';
};

export type Transaction = {
  id: string;
  book_id: string;
  member_id: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: 'issued' | 'returned';
  fine_amount: number;
};

export const MOCK_BOOKS: Book[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', category: 'Fiction', total_copies: 5, available_copies: 3, location: 'Shelf A1' },
  { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', category: 'Fiction', total_copies: 4, available_copies: 4, location: 'Shelf A2' },
  { id: '3', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', category: 'Science', total_copies: 3, available_copies: 1, location: 'Shelf B1' },
  { id: '4', title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', category: 'Technology', total_copies: 10, available_copies: 8, location: 'Shelf C3' },
  { id: '5', title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316097', category: 'History', total_copies: 6, available_copies: 6, location: 'Shelf D1' },
];

export const MOCK_MEMBERS: Member[] = [
  { id: 'm1', name: 'John Doe', email: 'john@example.com', member_id: 'LIB001', phone: '123-456-7890', role: 'user' },
  { id: 'm2', name: 'Jane Smith', email: 'jane@libverse.com', member_id: 'ADM001', phone: '987-654-3210', role: 'admin' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', book_id: '1', member_id: 'm1', issue_date: '2023-10-01', due_date: '2023-10-15', status: 'issued', fine_amount: 0 },
  { id: 't2', book_id: '3', member_id: 'm1', issue_date: '2023-09-15', due_date: '2023-09-29', return_date: '2023-10-05', status: 'returned', fine_amount: 5.50 },
];
