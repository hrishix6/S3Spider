import { useReducer } from 'react';

interface S3PaginationState {
  prevIndex: number;
  done: boolean;
  prevKeys: (string | undefined)[];
}

const initialState: S3PaginationState = {
  prevIndex: -2,
  done: true,
  prevKeys: [],
};

enum S3PaginationActionType {
  PREV_PAGE_LOADED = 'PREV_PAGE_LOADED',
  NEXT_PAGE_LOADED = 'NEXT_PAGE_LOADED',
  CLEAR = 'CLEAR',
}

interface S3PaginationAction {
  type: S3PaginationActionType;
  payload: any;
}

const s3PaginationReducer = (
  state: S3PaginationState,
  action: S3PaginationAction
): S3PaginationState => {
  switch (action.type) {
    case S3PaginationActionType.NEXT_PAGE_LOADED:
      return {
        done: action.payload.done,
        prevIndex: state.prevIndex + 1,
        prevKeys: [...state.prevKeys, action.payload.last],
      };
    case S3PaginationActionType.PREV_PAGE_LOADED:
      state.prevKeys.pop();
      return {
        done: action.payload.done,
        prevIndex: state.prevIndex - 1,
        prevKeys: [...state.prevKeys],
      };

    case S3PaginationActionType.CLEAR:
      return {
        done: true,
        prevIndex: -2,
        prevKeys: [],
      };

    default:
      return state;
  }
};

export function useS3Pagination() {
  const [state, dispatch] = useReducer(s3PaginationReducer, initialState);

  function nextPage(done: boolean, last?: string) {
    dispatch({
      type: S3PaginationActionType.NEXT_PAGE_LOADED,
      payload: { done, last },
    });
  }

  function prevPage(done: boolean) {
    dispatch({
      type: S3PaginationActionType.PREV_PAGE_LOADED,
      payload: { done },
    });
  }

  function clear() {
    dispatch({ type: S3PaginationActionType.CLEAR, payload: null });
  }

  return { state, nextPage, prevPage, clear };
}
