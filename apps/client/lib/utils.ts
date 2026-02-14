export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const m: Record<string, string> = {
    pending:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    preparing:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    ready:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    served:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    active:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    available:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    occupied: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    reserved:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };
  return (
    m[status.toLowerCase()] ??
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  );
}
