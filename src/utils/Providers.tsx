"use client"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"


const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient()
  return (
    <SessionProvider>
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {children}
    </QueryClientProvider>
    </SessionProvider>
  )
}

export default Providers
