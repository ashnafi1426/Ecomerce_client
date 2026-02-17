import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ChatWidget from '../components/chat/ChatWidget'

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full">
        <div className="responsive-container responsive-padding-y">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default CustomerLayout
