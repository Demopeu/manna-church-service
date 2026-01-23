type ErrorState = {
  success: false;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

type SuccessState = {
  success: true;
};

export type ActionState = ErrorState | SuccessState;
