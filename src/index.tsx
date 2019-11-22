import * as React from 'react'

export interface StoreProviderProps<T> {
  initialState?: T
}

export function create<S, A>(reducer: React.Reducer<S, A>, initialState?: S, displayName = 'StoreContext') {
  const Context = React.createContext<[S, React.Dispatch<A>]>([initialState] as any)
  Context.displayName = displayName

  const StoreProvider: React.FC<StoreProviderProps<S>> = props => {
    const value = React.useReducer(reducer, props.initialState || initialState)
    return (
      <Context.Provider value={value}>
        {props.children}
      </Context.Provider>
    )
  }

  const useStore = () => {
    const [store] = React.useContext(Context)
    if (typeof store === 'undefined') {
      throw new Error('You should not use `useStore` outside <StoreProvider/>')
    }
    return store
  }

  const useDispatch = () => {
    const [, dispatch] = React.useContext(Context)
    if (typeof dispatch === 'undefined') {
      throw new Error('You should not use `useDispatch` outside <StoreProvider/>')
    }
    return dispatch
  }

  return {
    StoreProvider,
    useStore,
    useDispatch,
  }
}