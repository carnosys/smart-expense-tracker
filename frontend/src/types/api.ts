export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type ValidationIssue = {
  loc?: Array<string | number>;
  msg?: string;
};

export type DetailError = {
  detail?: string | ValidationIssue[];
};
