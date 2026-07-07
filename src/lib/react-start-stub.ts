export function useServerFn<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
}

export function createServerFn(options: any = {}) {
  // TanStack Start server function emulator
  const fn = (args: any = {}) => {
    if (options.handler) {
      return options.handler(args);
    }
    return Promise.resolve({ ok: true });
  };
  
  // Chainable API builder
  fn.method = () => fn;
  fn.middleware = () => fn;
  fn.inputValidator = (validatorFn: any) => {
    const nextFn = (args: any = {}) => {
      // Validate input if validatorFn is provided
      if (validatorFn) {
        try {
          validatorFn(args.data);
        } catch (e) {
          return Promise.reject(e);
        }
      }
      if (options.handler) {
        return options.handler(args);
      }
      return Promise.resolve({ ok: true });
    };
    nextFn.method = () => nextFn;
    nextFn.middleware = () => nextFn;
    nextFn.handler = (handlerFn: any) => {
      const finalFn = (args: any = {}) => {
        return handlerFn({ ...args, context: { userId: "mock-admin-id" } });
      };
      return finalFn;
    };
    return nextFn;
  };
  
  fn.handler = (handlerFn: any) => {
    const finalFn = (args: any = {}) => {
      return handlerFn({ ...args, context: { userId: "mock-admin-id" } });
    };
    return finalFn;
  };
  
  return fn;
}

export function createStart() {
  return () => ({});
}

export function createMiddleware() {
  const middleware = {
    client: (cb: any) => {
      const clientMw = (args: any) => cb(args);
      return clientMw;
    },
    server: (cb: any) => {
      const serverMw = (args: any) => cb(args);
      return serverMw;
    },
  };
  return middleware;
}
