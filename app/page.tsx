"use client"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import DataTable from './ui/DataTable'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataTable />
    </QueryClientProvider>
  );
}
