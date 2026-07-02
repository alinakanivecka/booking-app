export interface GoogleCredentialResponse {
  credential: string;
}

export interface GoogleAccountsApi {
  accounts?: {
    id?: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (
        element: HTMLElement | null,
        options: {
          theme: string;
          size: string;
          text: string;
          locale: string;
        },
      ) => void;
      prompt: () => void;
    };
  };
}
