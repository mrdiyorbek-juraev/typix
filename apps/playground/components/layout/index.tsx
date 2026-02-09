"use client"
import Header from './header'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-6 px-4 py-8">
            <Header />
            {children}
        </div>
    )
}

export default Layout