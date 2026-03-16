import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  Observable,
} from "@apollo/client";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_SERVER_URL || "http://localhost:8000/graphql",
});

const timeout = Number(import.meta.env.VITE_TIMEOUT_MS) || 10000;

const timeoutLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const timer = setTimeout(() => {
      observer.error(new Error("Request timed out"));
    }, timeout);

    const subscription = forward(operation).subscribe({
      next: (result) => observer.next(result),
      error: (error) => observer.error(error),
      complete: () => observer.complete(),
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  });
});

export const clientWithTimeout = new ApolloClient({
  link: ApolloLink.from([timeoutLink, httpLink]),
  cache: new InMemoryCache(),
});
