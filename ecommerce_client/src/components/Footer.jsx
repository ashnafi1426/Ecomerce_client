const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Get to Know Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Press Releases</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Make Money with Us</h3>
            <ul className="space-y-2">
              <li><a href="/seller-register" className="text-gray-300 hover:text-white">Sell on FastShop</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Become an Affiliate</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Advertise Your Products</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Let Us Help You</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Your Account</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Your Orders</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Help</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">FastShop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Customer Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Returns</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">&copy; 2024 FastShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer