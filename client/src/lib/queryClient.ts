import { QueryClient, QueryFunction } from "@tanstack/react-query";
import config from "@/config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Make an API request with the base URL from config
 * @param method HTTP method (GET, POST, etc.)
 * @param endpoint API endpoint (e.g., '/api/auth/request-otp')
 * @param data Optional request body
 * @returns Promise with the response
 */
export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Remove leading slash if present to avoid double slashes
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${config.apiBaseUrl}/${normalizedEndpoint}`;
  
  console.log(`[API Request] ${method} ${url}`, data);
  
  const headers: Record<string, string> = {};
  
  // Only set Content-Type for requests with body
  if (data) {
    headers['Content-Type'] = 'application/json';
  }
  
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
      mode: 'cors', // Ensure CORS mode is set
    });

    if (!res.ok) {
      const error = await res.text().catch(() => res.statusText);
      throw new Error(`HTTP error! status: ${res.status}, message: ${error}`);
    }
    
    // Check for authentication-related endpoints to log role information
    if (endpoint.includes('/auth/verify-otp') || endpoint.includes('/auth/session')) {
      // Clone the response to avoid consuming it
      const resClone = res.clone();
      
      // Process the response asynchronously to log role information
      resClone.json().then(data => {
        console.log(`%c [Role Debug] ${endpoint}`, 'background: #3B82F6; color: white; padding: 2px 6px; border-radius: 4px;');
        console.log('%c User Data:', 'font-weight: bold;', data);
        
        // Check if debug info is available
        if (data._debug) {
          console.log('%c Role Information:', 'font-weight: bold;', {
            dbRole: data._debug.dbRole,
            sessionRole: data._debug.sessionRole,
            roleChanged: data._debug.roleChanged,
            isVendor: data.role === 'vendor'
          });
        } else {
          console.log('%c Role:', 'font-weight: bold;', data.role);
          console.log('%c Is Vendor:', 'font-weight: bold;', data.role === 'vendor');
        }
      }).catch(err => {
        console.error('Error parsing response for role logging:', err);
      });
    }
    
    return res;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const endpoint = queryKey[0] as string;
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${config.apiBaseUrl}/${normalizedEndpoint}`;
    
    console.log(`[Query] GET ${url}`);
    
    const res = await fetch(url, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
