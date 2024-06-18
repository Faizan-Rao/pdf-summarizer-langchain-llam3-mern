'use client'
import { Provider } from 'react-redux'
import { persister, store  } from './redux.store'
import { PersistGate } from 'redux-persist/integration/react'

interface IStoreProvider {
    children : React.ReactElement
}
export const StoreProvider = ({
    children
} : IStoreProvider) => {
    return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persister} >
            {children}
        </PersistGate>
    </Provider>
    )
       
    
}