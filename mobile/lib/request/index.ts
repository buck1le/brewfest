import { FetchResponse } from "./types";

export const HOST = (__DEV__) ?
  'http://localhost:3000' : 'https://wwbf-api.herokuapp.com';

type RequestFetchResponse<ApiResponse = unknown> =
  Omit<FetchResponse<ApiResponse>, 'loading'>;

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

const get = async <ApiResponse = unknown>(
  resource: string,
): Promise<RequestFetchResponse<ApiResponse>> => {
  try {
    const response = await fetch(resource, {
      method: 'GET',
      headers
    });

    console.log("resource", resource);
    console.log('response', response);

    if (!response.ok) {
      return { status: response.status, error: "Internal Server Error" };
    }

    const data = await response.json();
    return {
      status: response.status,
      data
    };
  } catch (error) {
    return { status: 444, error: "No Response" };
  }
};

const post = async (
  resource: string,
  payload: any,
): Promise<RequestFetchResponse> => {
  try {
    const response = await fetch(resource, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { status: response.status, error: "Internal Server Error" };
    }

    const data = await response.json();
    return {
      status: response.status,
      data
    };
  } catch (error) {
    return { status: 444, error: "No Response" };
  }
}

export default {
  get,
  post,
};

