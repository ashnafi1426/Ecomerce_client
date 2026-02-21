import { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * Used to wrap modal components to prevent rendering failures from
 * breaking the entire page.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2 text-red-600">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              {this.props.fallbackMessage || 'An error occurred while rendering this component.'}
            </p>
            {this.props.onReset && (
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null })
                  this.props.onReset()
                }}
                className="px-6 py-2 bg-[#FF9900] hover:bg-[#F08804] text-white rounded-lg font-semibold"
              >
                Try Again
              </button>
            )}
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackMessage: PropTypes.string,
  onReset: PropTypes.func
}

export default ErrorBoundary
